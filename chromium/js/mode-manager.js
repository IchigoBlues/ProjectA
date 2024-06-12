import {
    browser,
    dnr,
    localRead, localWrite, localRemove,
    sessionRead, sessionWrite,
    adminRead,
} from './ext.js';

import {
    broadcastMessage,
    hostnamesFromMatches,
    isDescendantHostnameOfIter,
    toBroaderHostname,
} from './utils.js';

import {
    TRUSTED_DIRECTIVE_BASE_RULE_ID,
    getDynamicRules
} from './ruleset-manager.js';

const MODE_NONE = 0;
const MODE_OPTIMAL = 1;

const eqSets = (setBefore, setAfter) => {
    for (const hn of setAfter) {
        if (setBefore.has(hn) === false) { return false; }
    }
    for (const hn of setBefore) {
        if (setAfter.has(hn) === false) { return false; }
    }
    return true;
};

const unserializeModeDetails = details => {
    return {
        none: new Set(details.none),
        optimal: new Set(details.optimal ?? details.extendedSpecific),
    };
};

const serializeModeDetails = details => {
    return {
        none: Array.from(details.none),
        optimal: Array.from(details.optimal),
    };
};

function lookupFilteringMode(filteringModes, hostname) {
    const { none, optimal } = filteringModes;
    if (hostname === 'all-urls') {
        if (filteringModes.none.has('all-urls')) { return MODE_NONE; }
        if (filteringModes.optimal.has('all-urls')) { return MODE_OPTIMAL; }
        return MODE_OPTIMAL;
    }
    if (none.has(hostname)) { return MODE_NONE; }
    if (none.has('all-urls') === false) {
        if (isDescendantHostnameOfIter(hostname, none)) { return MODE_NONE; }
    }
    if (optimal.has(hostname)) { return MODE_OPTIMAL; }
    if (optimal.has('all-urls') === false) {
        if (isDescendantHostnameOfIter(hostname, optimal)) { return MODE_OPTIMAL; }
    }
    return lookupFilteringMode(filteringModes, 'all-urls');
}

async function readFilteringModeDetails() {
    if (readFilteringModeDetails.cache) {
        return readFilteringModeDetails.cache;
    }
    const sessionModes = await sessionRead('filteringModeDetails');
    if (sessionModes instanceof Object) {
        readFilteringModeDetails.cache = unserializeModeDetails(sessionModes);
        return readFilteringModeDetails.cache;
    }
    let [userModes, adminNoFiltering] = await Promise.all([
        localRead('filteringModeDetails'),
        localRead('adminNoFiltering'),
    ]);
    if (userModes === undefined) {
        userModes = { optimal: ['all-urls'] };
    }
    userModes = unserializeModeDetails(userModes);
    if (Array.isArray(adminNoFiltering)) {
        for (const hn of adminNoFiltering) {
            applyFilteringMode(userModes, hn, 0);
        }
    }
    filteringModesToDNR(userModes);
    sessionWrite('filteringModeDetails', serializeModeDetails(userModes));
    readFilteringModeDetails.cache = userModes;
    adminRead('noFiltering').then(results => {
        if (results) {
            localWrite('adminNoFiltering', results);
        } else {
            localRemove('adminNoFiltering');
        }
    });
    return userModes;
}

async function writeFilteringModeDetails(afterDetails) {
    await filteringModesToDNR(afterDetails);
    const data = serializeModeDetails(afterDetails);
    localWrite('filteringModeDetails', data);
    sessionWrite('filteringModeDetails', data);
    readFilteringModeDetails.cache = unserializeModeDetails(data);

    Promise.all([
        getDefaultFilteringMode(),
        getTrustedSites(),
    ]).then(results => {
        broadcastMessage({
            defaultFilteringMode: results[0],
            trustedSites: Array.from(results[1]),
        });
    });
}

function applyFilteringMode(filteringModes, hostname, afterLevel) {
    const defaultLevel = lookupFilteringMode(filteringModes, 'all-urls');
    if (hostname === 'all-urls') {
        if (afterLevel === defaultLevel) { return afterLevel; }
        switch (afterLevel) {
            case MODE_NONE:
                filteringModes.none.clear();
                filteringModes.none.add('all-urls');
                break;
            case MODE_OPTIMAL:
                filteringModes.optimal.clear();
                filteringModes.optimal.add('all-urls');
                break;
        }
        switch (defaultLevel) {
            case MODE_NONE:
                filteringModes.none.delete('all-urls');
                break;
            case MODE_OPTIMAL:
                filteringModes.optimal.delete('all-urls');
                break;
        }
        return lookupFilteringMode(filteringModes, 'all-urls');
    }
    const beforeLevel = lookupFilteringMode(filteringModes, hostname);
    if (afterLevel === beforeLevel) { return afterLevel; }
    const { none, optimal } = filteringModes;
    switch (beforeLevel) {
        case MODE_NONE:
            none.delete(hostname);
            break;
        case MODE_OPTIMAL:
            optimal.delete(hostname);
            break;
    }
    if (afterLevel !== defaultLevel) {
        switch (afterLevel) {
            case MODE_NONE:
                if (isDescendantHostnameOfIter(hostname, none) === false) {
                    filteringModes.none.add(hostname);
                }
                break;
            case MODE_OPTIMAL:
                if (isDescendantHostnameOfIter(hostname, optimal) === false) {
                    filteringModes.optimal.add(hostname);
                }
                break;
        }
    }
    return lookupFilteringMode(filteringModes, hostname);
}

async function filteringModesToDNR(modes) {
    const dynamicRuleMap = await getDynamicRules();
    const presentRule = dynamicRuleMap.get(TRUSTED_DIRECTIVE_BASE_RULE_ID + 0);
    const presentNone = new Set(
        presentRule && presentRule.condition.requestDomains
    );
    if (eqSets(presentNone, modes.none)) { return; }
    const removeRuleIds = [];
    if (presentRule !== undefined) {
        removeRuleIds.push(TRUSTED_DIRECTIVE_BASE_RULE_ID + 0);
        removeRuleIds.push(TRUSTED_DIRECTIVE_BASE_RULE_ID + 1);
        dynamicRuleMap.delete(TRUSTED_DIRECTIVE_BASE_RULE_ID + 0);
        dynamicRuleMap.delete(TRUSTED_DIRECTIVE_BASE_RULE_ID + 1);
    }
    const addRules = [];
    const noneHostnames = [...modes.none];
    const notNoneHostnames = [...modes.optimal];
    if (noneHostnames.length !== 0) {
        const rule0 = {
            id: TRUSTED_DIRECTIVE_BASE_RULE_ID + 0,
            action: { type: 'allowAllRequests' },
            condition: {
                resourceTypes: ['main_frame'],
            },
            priority: 100,
        };
        if (modes.none.has('all-urls') === false) {
            rule0.condition.requestDomains = noneHostnames.slice();
        } else if (notNoneHostnames.length !== 0) {
            rule0.condition.excludedRequestDomains = notNoneHostnames.slice();
        }
        addRules.push(rule0);
        dynamicRuleMap.set(TRUSTED_DIRECTIVE_BASE_RULE_ID + 0, rule0);
        const rule1 = {
            id: TRUSTED_DIRECTIVE_BASE_RULE_ID + 1,
            action: { type: 'allow' },
            condition: {
                resourceTypes: ['script'],
            },
            priority: 100,
        };
        if (modes.none.has('all-urls') === false) {
            rule1.condition.initiatorDomains = noneHostnames.slice();
        } else if (notNoneHostnames.length !== 0) {
            rule1.condition.excludedInitiatorDomains = notNoneHostnames.slice();
        }
        addRules.push(rule1);
        dynamicRuleMap.set(TRUSTED_DIRECTIVE_BASE_RULE_ID + 1, rule1);
    }
    const updateOptions = {};
    if (addRules.length) {
        updateOptions.addRules = addRules;
    }
    if (removeRuleIds.length) {
        updateOptions.removeRuleIds = removeRuleIds;
    }
    await dnr.updateDynamicRules(updateOptions);
}

/******************************************************************************/

export async function getFilteringModeDetails() {
    const actualDetails = await readFilteringModeDetails();
    return {
        none: new Set(actualDetails.none),
        optimal: new Set(actualDetails.optimal),
    };
}

export async function getFilteringMode(hostname) {
    const filteringModes = await getFilteringModeDetails();
    return lookupFilteringMode(filteringModes, hostname);
}

export async function setFilteringMode(hostname, afterLevel) {
    const filteringModes = await getFilteringModeDetails();
    const level = applyFilteringMode(filteringModes, hostname, afterLevel);
    await writeFilteringModeDetails(filteringModes);
    return level;
}

export function getDefaultFilteringMode() {
    return getFilteringMode('all-urls');
}

export function setDefaultFilteringMode(afterLevel) {
    return setFilteringMode('all-urls', afterLevel);
}

export async function getTrustedSites() {
    const filteringModes = await getFilteringModeDetails();
    return filteringModes.none;
}

export async function setTrustedSites(hostnames) {
    const filteringModes = await getFilteringModeDetails();
    const { none } = filteringModes;
    const hnSet = new Set(hostnames);
    let modified = false;
    for (const hn of none) {
        if (hnSet.has(hn)) {
            hnSet.delete(hn);
        } else {
            none.delete(hn);
            modified = true;
        }
    }
    for (const hn of hnSet) {
        const level = applyFilteringMode(filteringModes, hn, MODE_NONE);
        if (level !== MODE_NONE) { continue; }
        modified = true;
    }
    if (modified === false) { return; }
    return writeFilteringModeDetails(filteringModes);
}

export async function syncWithBrowserPermissions() {
    const [permissions, beforeMode] = await Promise.all([
        browser.permissions.getAll(),
        getDefaultFilteringMode(),
    ]);
    const allowedHostnames = new Set(hostnamesFromMatches(permissions.origins || []));
    let modified = false;
    if (beforeMode > MODE_OPTIMAL && allowedHostnames.has('all-urls') === false) {
        await setDefaultFilteringMode(MODE_OPTIMAL);
        modified = true;
    }
    const afterMode = await getDefaultFilteringMode();
    if (afterMode > MODE_OPTIMAL) { return false; }
    const filteringModes = await getFilteringModeDetails();
    const { optimal } = filteringModes;
    for (const hn of optimal) {
        if (allowedHostnames.has(hn)) { continue; }
        optimal.delete(hn);
        modified = true;
    }
    await writeFilteringModeDetails(filteringModes);
    return modified;
}
