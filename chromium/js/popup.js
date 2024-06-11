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

// Function to set filtering mode and save the state
function setFilteringMode(level, commit = false) {
    const modeImage = qs$('#filteringModeImage');
    modeImage.dataset.level = level;
    modeImage.src = level === 0 ? 'img/redguard_off.png' : 'img/redguard.png';
    const filteringModeText = level === 0 ? i18n$('filteringMode0Name') : i18n$('filteringMode1Name');
    dom.text('#filteringModeCurrentText', filteringModeText);
    // Save the state to local storage
    localWrite('filteringMode', level);
    if (commit !== true) { return; }
    commitFilteringMode();
}

// Function to commit the filtering mode
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
    dom.text(
        '#filteringModeCurrentText',
        afterLevel === 0 ? i18n$('filteringMode0Name') : i18n$('filteringMode1Name')
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

// Event listener for image click
dom.on('#filteringModeImage', 'click', () => {
    const modeImage = qs$('#filteringModeImage');
    const currentLevel = parseInt(modeImage.dataset.level, 10);
    const newLevel = currentLevel === 0 ? 1 : 0;
    setFilteringMode(newLevel, true);
});

// Initialize the popup and load the saved state
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

    // Load the saved state from local storage or set to default (1)
    const savedMode = await localRead('filteringMode');
    const initialMode = savedMode !== null ? parseInt(savedMode, 10) : 1; // Default to 'On' (1)
    setFilteringMode(initialMode); // This ensures the button is set correctly on load

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
