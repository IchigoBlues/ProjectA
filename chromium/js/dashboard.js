import { runtime } from './ext.js';
import { dom } from './dom.js';
import { ExtPay } from './ExtPay.js';

const extpay = ExtPay('redguard');

/******************************************************************************/

{
    const manifest = runtime.getManifest();
    dom.text('#aboutNameVer', `${manifest.name} ${manifest.version}`);
}

dom.attr('a', 'target', '_blank');

dom.on('#dashboard-nav', 'click', '.tabButton', ev => {
    dom.body.dataset.pane = ev.target.dataset.pane;
});

/******************************************************************************/

// Disable the trusted sites textbox if the trial has not started
async function updateTextboxState() {
    const user = await extpay.getUser();
    const trustedSitesTextarea = document.getElementById('trustedSites');
    if (!user.trialStartedAt) {
        trustedSitesTextarea.disabled = true;
    } else {
        trustedSitesTextarea.disabled = false;
    }
}

updateTextboxState();
