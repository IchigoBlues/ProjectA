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
let state = 'null';

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
            chrome.storage.local.get(['subscriptionStatus'], result => {
                if (result.subscriptionStatus === 'trialExpired' || result.subscriptionStatus === 'notStartedTrial') {
                    setFilteringMode('all-urls',0);
                } else {
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

        });
    }

        case 'setDefaultFilteringMode': {
            chrome.storage.local.get(['subscriptionStatus'], result => {
            if (result.subscriptionStatus === 'trialExpired' || result.subscriptionStatus === 'notStartedTrial') {
                setDefaultFilteringMode(0);
        } else {
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
        })
        }

        case 'setTrustedSites':
            chrome.storage.local.get(['subscriptionStatus'], result => {
                if (result.subscriptionStatus === 'trialExpired' || result.subscriptionStatus === 'notStartedTrial') {
                    callback({ success: false, message: 'Cannot set trusted sites.' });
                    console.log('Cannot set trusted sites.');
                } else {
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
                }
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
        //const disableFirstRunPage = await adminRead('disableFirstRunPage');
        // if (disableFirstRunPage !== true) {
        //     runtime.openOptionsPage();
        // }
        extpay.openTrialPage('Start your 7-day free trial!');
    }


    checkSubscriptionStatus(); // Check subscription status when the extension starts

    //setOff(); // Set filtering mode to 0 for all tabs when the extension starts

}

async function setOff() {
    if (subscriptionStatus === 'trialExpired' || subscriptionStatus === 'notStartedTrial') {
            setFilteringMode('all-urls', 0).then(() => {
                console.log(`Filtering mode set to 0 for ${tab.url}`);
            }).catch((error) => {
                console.error(`Failed to set filtering mode for ${tab.url}:`, error);
            });
    }
}



async function checkSubscriptionStatus() {
    try {
        const user = await extpay.getUser();
        const now = new Date();

        let state;
        let secondsRemaining = 0; // Initialize with a default value

        if (user.paid) {
            console.log('paid user');
            state = 'paidUser';
        } else if (!user.trialStartedAt) {
            console.log('not started trial');
            state = 'notStartedTrial';
        } else {
            const trialEnd = new Date(user.trialStartedAt.getTime() + 1 * 60 * 1000); // 1 minute trial period 
            const timeRemaining = trialEnd - now;

            if (now < trialEnd) {
                console.log('Trial is still active');
                state = 'trialActive';
                secondsRemaining = Math.max(0, Math.ceil(timeRemaining / 1000));
            } else {
                console.log('Trial has expired');
                state = 'trialExpired';
            }
        }

        // Set the subscription status and seconds remaining in storage
        chrome.storage.local.set({ subscriptionStatus: state, secondsRemaining });
    } catch (error) {
        console.error('Failed to get user info:', error);
    }
}

chrome.webNavigation.onCompleted.addListener(async function(details) {
    if (details.frameId === 0) {  // Ensure it's the main frame (top-level document)
        console.log('Navigation completed for main frame:', details.url);

        const subscriptionStatus = await new Promise(resolve => {
            chrome.storage.local.get(['subscriptionStatus'], result => {
                console.log('Subscription status retrieved:', result.subscriptionStatus);
                resolve(result.subscriptionStatus || 'trialExpired');
            });
        });

        console.log('Current subscription status:', subscriptionStatus);

        if (subscriptionStatus === 'trialExpired' || subscriptionStatus === 'notStartedTrial') {
            if (details.url) {
                setFilteringMode(details.url, 0).then(() => {
                    const logMessage = `Filtering mode set to 0 for ${details.url}`;
                    console.log(logMessage);
                    storeLogMessage(logMessage);
                }).catch((error) => {
                    const errorMessage = `Failed to set filtering mode for ${details.url}: ${error}`;
                    console.error(errorMessage);
                    storeLogMessage(errorMessage);
                });
            }
        }
    }
});

function storeLogMessage(message) {
    chrome.storage.local.get(['logMessages'], result => {
        const logMessages = result.logMessages || [];
        logMessages.push(message);
        chrome.storage.local.set({ logMessages });
    });
}


try {
    start();
} catch (reason) {
    console.trace(reason);
}

// chrome.runtime.onInstalled.addListener((details) => {
//     if (details.reason === 'install') {
//         chrome.runtime.sendMessage({ action: 'extensionInstalled' });
//     }
// });

// Check trial status on any extension interaction
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.checkSubscriptionStatus) {
        checkSubscriptionStatus().then(() => {
            chrome.storage.local.get(['subscriptionStatus', 'secondsRemaining'], result => {
                sendResponse({
                    subscriptionStatus: result.subscriptionStatus || 'trialExpired',
                    secondsRemaining: result.secondsRemaining || 0
                });
            });
        });
        return true;
    }
});

