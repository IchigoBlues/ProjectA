/*******************************************************************************

    uBlock Origin Lite - a comprehensive, MV3-compliant content blocker
    Copyright (C) 2022-present Raymond Hill

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see {http://www.gnu.org/licenses/}.

    Home: https://github.com/gorhill/uBlock

*******************************************************************************/

/* jshint esversion:11 */

'use strict';

/******************************************************************************/

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

/******************************************************************************/

const BLOCKING_MODE_MAX = 1;

function setFilteringMode(level, commit = false) {
    const modeButton = qs$('#filteringModeButton');
    modeButton.dataset.level = level;
    modeButton.textContent = level === 0 ? 'Off' : 'On';
    if (commit !== true) { return; }
    commitFilteringMode();
}

async function commitFilteringMode() {
    if (tabHostname === '') { return; }
    const targetHostname = normalizedHostname(tabHostname);
    const modeButton = qs$('#filteringModeButton');
    const afterLevel = parseInt(modeButton.dataset.level, 10);
    const beforeLevel = parseInt(modeButton.dataset.levelBefore, 10);
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
    dom.text(
        '#filteringModeText > span:nth-of-type(1)',
        i18n$(`filteringMode${afterLevel}Name`)
    );
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

{
    // Remove slider-related variables and functions
    const modeButton = qs$('#filteringModeButton');

    // Function to toggle filtering mode
    const toggleFilteringMode = () => {
        const currentLevel = parseInt(modeButton.dataset.level, 10);
        const newLevel = currentLevel === 0 ? 1 : 0;
        setFilteringMode(newLevel, true);
    };

    // Event listener for button click
    dom.on('#filteringModeButton', 'click', toggleFilteringMode);
}

/******************************************************************************/

// The popup panel is made of sections. Visibility of sections can be
// toggled on/off.

const maxNumberOfSections = 2;

const sectionBitsFromAttribute = function() {
    const value = dom.body.dataset.section;
    if (value === '') { return 0; }
    let bits = 0;
    for (const c of value.split(' ')) {
        bits |= 1 << (c.charCodeAt(0) - 97);
    }
    return bits;
};

const sectionBitsToAttribute = function(bits) {
    if (typeof bits !== 'number') { return; }
    if (isNaN(bits)) { return; }
    const value = [];
    for (let i = 0; i < maxNumberOfSections; i++) {
        const bit = 1 << i;
        if ((bits & bit) === 0) { continue; }
        value.push(String.fromCharCode(97 + i));
    }
    dom.body.dataset.section = value.join(' ');
};

async function toggleSections(more) {
    let currentBits = sectionBitsFromAttribute();
    let newBits = currentBits;
    for (let i = 0; i < maxNumberOfSections; i++) {
        const bit = 1 << (more ? i : maxNumberOfSections - i - 1);
        if (more) {
            newBits |= bit;
        } else {
            newBits &= ~bit;
        }
        if (newBits !== currentBits) { break; }
    }
    if (newBits === currentBits) { return; }
    sectionBitsToAttribute(newBits);
    localWrite('popupPanelSections', newBits);
}

localRead('popupPanelSections').then(bits => {
    sectionBitsToAttribute(bits || 0);
});

dom.on('#moreButton', 'click', () => {
    toggleSections(true);
});

dom.on('#lessButton', 'click', () => {
    toggleSections(false);
});

/******************************************************************************/

dom.on('[data-i18n-title="popupTipDashboard"]', 'click', ev => {
    if (ev.isTrusted !== true) { return; }
    if (ev.button !== 0) { return; }
    runtime.openOptionsPage();
});

/******************************************************************************/

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

    setFilteringMode(popupPanelData.level);

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

/******************************************************************************/
