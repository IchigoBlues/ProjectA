import {
    browser,
    runtime,
    sendMessage,
    localRead, localWrite,
} from './ext.js';

import { dom, qs$ } from './dom.js';
import { i18n, i18n$ } from './i18n.js';
import punycode from './punycode.js';

/******************************************************************************/

const popupPanelData = {};
const currentTab = {};
let tabHostname = '';

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
    const level = await sendMessage({
        what: 'getFilteringMode',
        hostname: normalizedHostname(tabHostname),
    });
    setFilteringMode(level);
}

dom.on('#filteringModeImage', 'click', async () => {
    const modeImage = qs$('#filteringModeImage');
    const currentLevel = parseInt(modeImage.dataset.level, 10);
    const newLevel = currentLevel === 0 ? 1 : 0;
    await setFilteringMode(newLevel, true);
});

dom.on('[data-i18n-title="popupTipDashboard"]', 'click', ev => {
    if (ev.isTrusted !== true) { return; }
    if (ev.button !== 0) { return; }
    runtime.openOptionsPage();
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

    await updateButtonState();

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

    return true;
}

async function tryInit() {
    try {
        await init();
    } catch (ex) {
        setTimeout(tryInit, 100);
    }
}

tryInit();
