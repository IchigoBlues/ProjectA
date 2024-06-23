import {
    browser,
    runtime,
    sendMessage,
    localRead, localWrite,
} from './ext.js';

import { dom, qs$ } from './dom.js';
import { i18n, i18n$ } from './i18n.js';
import punycode from './punycode.js';
import { ExtPay } from './ExtPay.js';

const extpay = ExtPay('redguard');

/******************************************************************************/

const popupPanelData = {};
const currentTab = {};
let tabHostname = '';
let userPaid = false; //to make this more useful you'll have to put this in chrome storage otherwise this resets every time the computer shuts off

/******************************************************************************/

function normalizedHostname(hn) {
    return hn.replace(/^www\./, '');
}

async function setFilteringMode(level, commit = false) {
    const modeImage = qs$('#filteringModeImage');
    modeImage.dataset.level = level;
    modeImage.src = level === 0 ? 'img/redguard_off.png' : 'img/redguard.png';
    const filteringModeText = level === 0 ? 'no filtering' : 'optimal';
    dom.text('#filteringModeCurrentText', filteringModeText);

    // Save the state to local storage
    await localWrite('filteringMode', level);
    if (commit !== true) { return; }
    await commitFilteringMode();
}

async function commitFilteringMode() {
    if (tabHostname === '') { return; }
    const targetHostname = normalizedHostname(tabHostname);
    const modeImage = qs$('#filteringModeImage');
    const afterLevel = parseInt(modeImage.dataset.level, 10);
    const beforeLevel = parseInt(modeImage.dataset.levelBefore, 10);
    if (afterLevel === 1) {
        let granted = false;
        try {
            granted = await browser.permissions.request({
                origins: [`*://*.${targetHostname}/*`],
            });
        } catch (ex) {
        }
        if (granted !== true) {
            setFilteringMode(beforeLevel);
            return;
        }
    }
    const actualLevel = await sendMessage({
        what: 'setFilteringMode',
        hostname: targetHostname,
        level: afterLevel,
    });
    if (actualLevel !== afterLevel) {
        setFilteringMode(actualLevel);
    }
    if (actualLevel !== beforeLevel && popupPanelData.autoReload) {
        browser.tabs.reload(currentTab.id);
    }
}

async function updateButtonState() {

    const subscriptionStatus = await new Promise(resolve => {
        chrome.storage.local.get(['subscriptionStatus'], result => {
            resolve(result.subscriptionStatus  || 'trialExpired');
        });

    });

        
    if (subscriptionStatus === 'notStartedTrial') {
        setFilteringMode(0, true);
        return;
    }
    else if (subscriptionStatus === 'trialActive') {
        setFilteringMode(1, true);
    }
    else if (subscriptionStatus === 'trialExpired') {
        setFilteringMode(0, true);
    } else if (subscriptionStatus === 'paidUser') {
        setFilteringMode(1, true);
    } else {
        console.log('Unknown state');
        return;
    }



}

dom.on('#filteringModeImage', 'click', async () => {
    const modeImage = qs$('#filteringModeImage');
    const currentLevel = parseInt(modeImage.dataset.level, 10);
    const newLevel = currentLevel === 0 ? 1 : 0;



    const subscriptionStatus = await new Promise(resolve => {
        chrome.storage.local.get(['subscriptionStatus'], result => {
            resolve(result.subscriptionStatus  || 'trialExpired');
        });


    });

    const startTrialButton = document.getElementById('startTrialButton'); //but even after the user pays, there's going to be so maany unnecessary calls to this function
    const subscribeButton = document.getElementById('subscribeButton'); //look into chrome storage to store the user's trial status
    const trialCountdown = document.getElementById('trialCountdown');
    let state = subscriptionStatus

        
    if (state === 'notStartedTrial') {
        setFilteringMode(0, true);
        startTrialButton.style.display = 'block';
        subscribeButton.style.display = 'none';
        trialCountdown.style.display = 'none';
        extpay.openTrialPage('Start your 7-day free trial!');
        return;
    }
    else if (state === 'trialActive') {
        startTrialButton.style.display = 'none';
        subscribeButton.style.display = 'block';
        trialCountdown.style.display = 'block';
        updateTrialTime();
        setFilteringMode(newLevel, true);
        
    }
    else if (state === 'trialExpired') {
        startTrialButton.style.display = 'none';
        subscribeButton.style.display = 'block';
        trialCountdown.innerText = 'Free trial has expired';
        trialCountdown.style.display = 'block';
        setFilteringMode(0, true);
        extpay.openPaymentPage('Please support the developer to continue using this amazing extension!');
    } else if (state === 'paidUser') {
        startTrialButton.style.display = 'none';
        subscribeButton.style.display = 'block';
        trialCountdown.style.display = 'none';
        setFilteringMode(newLevel, true);
    } else {
        console.log('Unknown state');
        return;
    }


});

dom.on('[data-i18n-title="popupTipDashboard"]', 'click', ev => {
    if (ev.isTrusted !== true) { return; }
    if (ev.button !== 0) { return; }
    runtime.openOptionsPage();
});

async function updatePopup() { // you need to make this more efficient. this function gets called every time a new tab is open which is so bad
    const startTrialButton = document.getElementById('startTrialButton'); //but even after the user pays, there's going to be so maany unnecessary calls to this function
    const subscribeButton = document.getElementById('subscribeButton'); //look into chrome storage to store the user's trial status
    const trialCountdown = document.getElementById('trialCountdown');

    const subscriptionStatus = await new Promise(resolve => {
        chrome.storage.local.get(['subscriptionStatus'], result => {
            resolve(result.subscriptionStatus  || 'trialExpired');
        });
    });
            updateButtonState();


            if (subscriptionStatus === 'notStartedTrial') {

                startTrialButton.style.display = 'block';
                subscribeButton.style.display = 'none';
                trialCountdown.style.display = 'none';
                
            } else if (subscriptionStatus === 'paidUser') {
                startTrialButton.style.display = 'none';
                subscribeButton.style.display = 'block';
                trialCountdown.style.display = 'none';
                subscribeButton.textContent = 'Manage Subscription';
            } else if (subscriptionStatus === 'trialActive') {
                startTrialButton.style.display = 'none';
                subscribeButton.style.display = 'block';
                trialCountdown.style.display = 'block';
                updateTrialTime();
            } else if (subscriptionStatus === 'trialExpired') {
                startTrialButton.style.display = 'none';
                subscribeButton.style.display = 'block';
                trialCountdown.innerText = 'Free trial has expired';
                trialCountdown.style.display = 'block';
            } else {
                console.log('Unknown state');
                return;
            }



}

async function updateTrialTime() {
    chrome.runtime.sendMessage({ checkSubscriptionStatus: true }, function(response) {
        const trialCountdown = document.getElementById('trialCountdown');
        if (response) {
            const { secondsRemaining } = response;
            const minutesRemaining = Math.floor(secondsRemaining / 60);
            const seconds = secondsRemaining % 60;
            trialCountdown.innerText = `Free trial time remaining: ${minutesRemaining}m ${seconds}s`;
            trialCountdown.style.display = 'block';
        } else {
            console.error('No response received');
            trialCountdown.innerText = 'Error retrieving trial time';
            trialCountdown.style.display = 'block';
        }
    });
}

dom.on('#startTrialButton', 'click', async () => {
    await extpay.openTrialPage('Start your 7-day free trial!');
    await updatePopup();
});

dom.on('#subscribeButton', 'click', async () => {
    await extpay.openPaymentPage('Please support the developer to continue using this amazing extension!');
    await updatePopup();

});

async function setOff() { 
    setFilteringMode(0, true);
}


// Add a listener for messages from background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'update') {

        chrome.runtime.sendMessage({ checkSubscriptionStatus: true });
        
        const subscriptionStatus = new Promise(resolve => {
            chrome.storage.local.get(['subscriptionStatus'], result => {
                resolve(result.subscriptionStatus  || 'trialExpired');
            });
        });
        if (subscriptionStatus !== 'userPaid') {
        updatePopup();
        updateButtonState();
        }
  
    }
    // if (message.action === 'extensionInstalled') {
    //     console.log('Extension installed successfully.');
    //     setOff();
    // }
});



async function init() {
    const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });
    if (tab instanceof Object === false) { return true; }
    Object.assign(currentTab, tab);

    let url;
    try {
        url = new URL(currentTab.url);
        tabHostname = url.hostname || '';
    } catch (ex) {
    }

    if (url !== undefined) {
        const response = await sendMessage({
            what: 'popupPanelData',
            origin: url.origin,
            hostname: normalizedHostname(tabHostname),
        });
        if (response instanceof Object) {
            Object.assign(popupPanelData, response);
        }
    }

    await updatePopup();

    dom.text('#hostname', punycode.toUnicode(tabHostname));

    const parent = qs$('#rulesetStats');
    for (const details of popupPanelData.rulesetDetails || []) {
        const div = dom.clone('#templates .rulesetDetails');
        qs$(div, 'h1').append(i18n.patchUnicodeFlags(details.name));
        const { rules, filters, css } = details;
        let ruleCount = rules.plain + rules.regex;
        if (popupPanelData.hasOmnipotence) {
            ruleCount += rules.removeparam + rules.redirect + rules.modifyHeaders;
        }
        let specificCount = 0;
        if (typeof css.specific === 'number') {
            specificCount += css.specific;
        }
        if (typeof css.declarative === 'number') {
            specificCount += css.declarative;
        }
        if (typeof css.procedural === 'number') {
            specificCount += css.procedural;
        }
        dom.text(
            qs$(div, 'p'),
            i18n$('perRulesetStats')
                .replace('{{ruleCount}}', ruleCount.toLocaleString())
                .replace('{{filterCount}}', filters.accepted.toLocaleString())
                .replace('{{cssSpecificCount}}', specificCount.toLocaleString())
        );
        parent.append(div);
    }

    dom.cl.remove(dom.body, 'loading');


}

async function tryInit() {
    try {
        await init();
    } catch (ex) {
        setTimeout(tryInit, 100);
    }
}

tryInit();
