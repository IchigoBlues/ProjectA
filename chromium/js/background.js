import { ExtPay } from './ExtPay.js'; // Adjust the path if needed

const extpay = ExtPay('redguard');
extpay.startBackground();

import {
    adminRead,
    browser,
    dnr,
    localRead, localWrite,
    runtime,
    sessionRead, sessionWrite,
} from './ext.js';

import {
    broadcastMessage,
    ubolLog,
} from './utils.js';

import {
    defaultRulesetsFromLanguage,
    enableRulesets,
    getEnabledRulesetsDetails,
    getRulesetDetails,
    updateDynamicRules,
} from './ruleset-manager.js';

import {
    getDefaultFilteringMode,
    setDefaultFilteringMode,
    getFilteringMode,
    getTrustedSites,
    setFilteringMode,
    setTrustedSites,
    syncWithBrowserPermissions,
} from './mode-manager.js';

import {
    registerInjectables,
} from './scripting-manager.js';

const rulesetConfig = {
    version: '',
    enabledRulesets: ['default'],
    autoReload: true,
    showBlockedCount: true,
};

const UBOL_ORIGIN = runtime.getURL('').replace(/\/$/, '');
const canShowBlockedCount = typeof dnr.setExtensionActionOptions === 'function';
let firstRun = false;
let wakeupRun = false;

function getCurrentVersion() {
    return runtime.getManifest().version;
}

async function loadRulesetConfig() {
    let data = await sessionRead('rulesetConfig');
    if (data) {
        rulesetConfig.version = data.version;
        rulesetConfig.enabledRulesets = data.enabledRulesets;
        rulesetConfig.autoReload = typeof data.autoReload === 'boolean' ? data.autoReload : true;
        rulesetConfig.showBlockedCount = typeof data.showBlockedCount === 'boolean' ? data.showBlockedCount : true;
        wakeupRun = true;
        return;
    }
    data = await localRead('rulesetConfig');
    if (data) {
        rulesetConfig.version = data.version;
        rulesetConfig.enabledRulesets = data.enabledRulesets;
        rulesetConfig.autoReload = typeof data.autoReload === 'boolean' ? data.autoReload : true;
        rulesetConfig.showBlockedCount = typeof data.showBlockedCount === 'boolean' ? data.showBlockedCount : true;
        sessionWrite('rulesetConfig', rulesetConfig);
        return;
    }
    rulesetConfig.enabledRulesets = await defaultRulesetsFromLanguage();
    sessionWrite('rulesetConfig', rulesetConfig);
    localWrite('rulesetConfig', rulesetConfig);
    firstRun = true;
}

async function saveRulesetConfig() {
    sessionWrite('rulesetConfig', rulesetConfig);
    return localWrite('rulesetConfig', rulesetConfig);
}

async function hasGreatPowers(origin) {
    if (/^https?:\/\//.test(origin) === false) {
        return false;
    }
    return browser.permissions.contains({
        origins: [`${origin}/*`],
    });
}

function hasOmnipotence() {
    return browser.permissions.contains({
        origins: ['<all_urls>'],
    });
}

async function onPermissionsRemoved() {
    const beforeMode = await getDefaultFilteringMode();
    const modified = await syncWithBrowserPermissions();
    if (modified === false) {
        return false;
    }
    const afterMode = await getDefaultFilteringMode();
    if (beforeMode > 1 && afterMode <= 1) {
        updateDynamicRules();
    }
    registerInjectables();
    return true;
}

function onMessage(request, sender, callback) {
    switch (request.what) {
        case 'applyRulesets': {
            enableRulesets(request.enabledRulesets).then(() => {
                rulesetConfig.enabledRulesets = request.enabledRulesets;
                return saveRulesetConfig();
            }).then(() => {
                registerInjectables();
                callback();
                broadcastMessage({ enabledRulesets: rulesetConfig.enabledRulesets });
            });
            return true;
        }

        case 'getOptionsPageData': {
            Promise.all([
                getDefaultFilteringMode(),
                getTrustedSites(),
                getRulesetDetails(),
                dnr.getEnabledRulesets(),
            ]).then(results => {
                const [
                    defaultFilteringMode,
                    trustedSites,
                    rulesetDetails,
                    enabledRulesets,
                ] = results;
                callback({
                    defaultFilteringMode,
                    trustedSites: Array.from(trustedSites),
                    enabledRulesets,
                    maxNumberOfEnabledStaticRulesets: dnr.MAX_NUMBER_OF_ENABLED_STATIC_RULESETS,
                    rulesetDetails: Array.from(rulesetDetails.values()),
                    autoReload: rulesetConfig.autoReload,
                    showBlockedCount: rulesetConfig.showBlockedCount,
                    canShowBlockedCount,
                    firstRun,
                });
                firstRun = false;
            });
            return true;
        }

        case 'setAutoReload':
            rulesetConfig.autoReload = request.state && true || false;
            saveRulesetConfig().then(() => {
                callback();
                broadcastMessage({ autoReload: rulesetConfig.autoReload });
            });
            return true;

        case 'setShowBlockedCount':
            rulesetConfig.showBlockedCount = request.state && true || false;
            if (canShowBlockedCount) {
                dnr.setExtensionActionOptions({
                    displayActionCountAsBadgeText: rulesetConfig.showBlockedCount,
                });
            }
            saveRulesetConfig().then(() => {
                callback();
                broadcastMessage({ showBlockedCount: rulesetConfig.showBlockedCount });
            });
            return true;

        case 'popupPanelData': {
            Promise.all([
                getFilteringMode(request.hostname),
                hasOmnipotence(),
                hasGreatPowers(request.origin),
                getEnabledRulesetsDetails(),
            ]).then(results => {
                callback({
                    level: results[0],
                    autoReload: rulesetConfig.autoReload,
                    hasOmnipotence: results[1],
                    hasGreatPowers: results[2],
                    rulesetDetails: results[3],
                });
            });
            return true;
        }

        case 'getFilteringMode': {
            getFilteringMode(request.hostname).then(actualLevel => {
                callback(actualLevel);
            });
            return true;
        }

        case 'setFilteringMode': {
            getFilteringMode(request.hostname).then(actualLevel => {
                if (request.level === actualLevel) {
                    return actualLevel;
                }
                return setFilteringMode(request.hostname, request.level);
            }).then(actualLevel => {
                registerInjectables();
                callback(actualLevel);
            });
            return true;
        }

        case 'setDefaultFilteringMode': {
            getDefaultFilteringMode().then(beforeLevel =>
                setDefaultFilteringMode(request.level).then(afterLevel =>
                    ({ beforeLevel, afterLevel })
                )
            ).then(({ beforeLevel, afterLevel }) => {
                if (beforeLevel === 1 || afterLevel === 1) {
                    updateDynamicRules();
                }
                if (afterLevel !== beforeLevel) {
                    registerInjectables();
                }
                callback(afterLevel);
            });
            return true;
        }

        case 'setTrustedSites':
            setTrustedSites(request.hostnames).then(() => {
                registerInjectables();
                return Promise.all([
                    getDefaultFilteringMode(),
                    getTrustedSites(),
                ]);
            }).then(results => {
                callback({
                    defaultFilteringMode: results[0],
                    trustedSites: Array.from(results[1]),
                });
            });
            return true;

        default:
            break;
    }
}

async function start() {
    await loadRulesetConfig();

    if (wakeupRun === false) {
        await enableRulesets(rulesetConfig.enabledRulesets);
    }

    if (wakeupRun === false) {
        const currentVersion = getCurrentVersion();
        if (currentVersion !== rulesetConfig.version) {
            ubolLog(`Version change: ${rulesetConfig.version} => ${currentVersion}`);
            updateDynamicRules().then(() => {
                rulesetConfig.version = currentVersion;
                saveRulesetConfig();
            });
        }
    }

    const permissionsChanged = await onPermissionsRemoved();

    if (wakeupRun === false || permissionsChanged) {
        registerInjectables();

        const enabledRulesets = await dnr.getEnabledRulesets();
        ubolLog(`Enabled rulesets: ${enabledRulesets}`);

        dnr.getAvailableStaticRuleCount().then(count => {
            ubolLog(`Available static rule count: ${count}`);
        });
    }

    if (wakeupRun === false && canShowBlockedCount) {
        dnr.setExtensionActionOptions({
            displayActionCountAsBadgeText: rulesetConfig.showBlockedCount,
        });
    }

    runtime.onMessage.addListener(onMessage);

    browser.permissions.onRemoved.addListener(() => {
        onPermissionsRemoved();
    });

    if (firstRun) {
        const disableFirstRunPage = await adminRead('disableFirstRunPage');
        if (disableFirstRunPage !== true) {
            runtime.openOptionsPage();
        }
    }

    checkTrialStatus(); // Check trial status when the extension starts
}

function checkTrialStatus() {
    extpay.getUser().then(user => {
        if (!user.trialStartedAt) {
            setDefaultFilteringMode(0); // Set to no filter
            extpay.openTrialPage('Start your 7-day free trial!');
        } else {
            setDefaultFilteringMode(1); // Set to optimal filter
        }
    }).catch(error => {
        console.error('Failed to get user info:', error);
    });
}

try {
    start();
} catch (reason) {
    console.trace(reason);
}

// Check trial status on any extension interaction
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.checkTrialStatus) {
        checkTrialStatus();
        sendResponse({ status: 'checked' });
    }
});
