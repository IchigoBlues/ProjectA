/*******************************************************************************

    uBlock Origin Lite - a comprehensive, MV3-compliant content blocker
    Copyright (C) 2014-present Raymond Hill

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
*/

/* jshint esversion:11 */

'use strict';

// ruleset: annoyances-overlays

/******************************************************************************/

// Important!
// Isolate from global scope
(function uBOL_cssProceduralImport() {

/******************************************************************************/

const argsList = [["{\"selector\":\"p > b\",\"tasks\":[[\"xpath\",\"//*[contains(text(),\\\"AdBlock\\\")]\"]]}"],["{\"selector\":\"style\",\"action\":[\"remove\",\"\"],\"tasks\":[[\"has-text\",\"@media print\"]]}"],["{\"selector\":\".GrowthUnauthPinImage > a > div[class^=\\\"Jea\\\"]\",\"tasks\":[[\"has\",{\"selector\":\"button[class^=\\\"noButtonStyles \\\"]\"}]]}"],["{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"devtoolsDetector\"]]}"],["{\"selector\":\"#root > div > div\",\"tasks\":[[\"has-text\",\"Get one more story in your member\"]]}","{\"selector\":\".overlay\",\"tasks\":[[\"not\",{\"selector\":\"\",\"tasks\":[[\"has-text\",\"Welcome back\"]]}],[\"not\",{\"selector\":\"\",\"tasks\":[[\"has-text\",\"write a response\"]]}],[\"not\",{\"selector\":\"\",\"tasks\":[[\"has-text\",\"Publish now\"]]}]]}"],["{\"selector\":\"style\",\"action\":[\"remove\",\"\"],\"tasks\":[[\"has-text\",\"user-select:\"]]}"],["{\"selector\":\"[id=\\\"toggle_notification_notification-ad-blocker\\\"]\",\"tasks\":[[\"upward\",1]]}"],["{\"selector\":\"style\",\"tasks\":[[\"has-text\",\"@media print\"]]}"],["{\"selector\":\"body > div[style]\",\"tasks\":[[\"has\",{\"selector\":\".brz_msg_wall_body\"}]]}"],["{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"document.oncontextmenu\"]]}"],["{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"debugger\"]]}"],["{\"selector\":\".adsbygoogle\",\"tasks\":[[\"upward\",1]]}"],["{\"selector\":\".ct_warn\",\"tasks\":[[\"has-text\",\"adblock\"]]}","{\"selector\":\".ui-dialog[aria-describedby=\\\"modal-msg\\\"]\",\"tasks\":[[\"has\",{\"selector\":\"a[href$=\\\"/console/abo.pl\\\"][style^=\\\"text-decoration:underline\\\"]\"}]]}"],["{\"selector\":\"div[style] > div > .userBanner--red\",\"tasks\":[[\"upward\",2]]}"],["{\"selector\":\"div[class^=\\\"-_\\\"] > form\",\"tasks\":[[\"has-text\",\"newsletters\"]]}"],["{\"selector\":\"style\",\"action\":[\"remove\",\"\"],\"tasks\":[[\"has-text\",\"user-select\"]]}"],["{\"selector\":\"button[type=\\\"submit\\\"]\",\"action\":[\"remove-attr\",\"disabled\"]}"],["{\"selector\":\".js-dismissable-hero\",\"tasks\":[[\"has-text\",\"Sign up\"]]}"],["{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"document.onmousedown\"]]}"],["{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"/addLinkToCopy/i\"]]}"],["{\"selector\":\".section > .wrapper\",\"tasks\":[[\"has-text\",\"Newsletters\"]]}"],["{\"selector\":\"#modal_login\",\"tasks\":[[\"upward\",2]]}"],["{\"selector\":\"\",\"tasks\":[[\"xpath\",\"//div[contains(text(),\\\"Adblock\\\")]/..\"]]}"],["{\"selector\":\"h2\",\"tasks\":[[\"has-text\",\"Using an ad blocker?\"],[\"upward\",3]]}"],["{\"selector\":\"style\",\"action\":[\"remove\",\"\"],\"tasks\":[[\"has-text\",\"/-moz-user-select:none|@media print/\"]]}"],["{\"selector\":\".ReactModalPortal\",\"tasks\":[[\"has-text\",\"mobile\"]]}"],["{\"selector\":\".cTopicPostArea\",\"tasks\":[[\"has\",{\"selector\":\".cGuestTeaser\"}]]}"],["{\"selector\":\".swal2-shown\",\"action\":[\"remove-class\",\"swal2-shown\"]}"],["{\"selector\":\".fbUserStory\",\"tasks\":[[\"has-text\",\"Popular Across Facebook\"]]}","{\"selector\":\".userContentWrapper\",\"tasks\":[[\"has-text\",\"Popular Across Facebook\"]]}"],["{\"selector\":\"div[style^=\\\"background: none;\\\"]\",\"tasks\":[[\"has\",{\"selector\":\"#mobile_login_bar\"}]]}"],["{\"selector\":\"style\",\"action\":[\"remove\",\"\"],\"tasks\":[[\"has-text\",\"-moz-none\"]]}"],["{\"selector\":\"[oncontextmenu=\\\"return false;\\\"]\",\"action\":[\"remove-attr\",\"oncontextmenu\"]}"],["{\"selector\":\"\",\"tasks\":[[\"xpath\",\"//*[contains(text(),\\\"blocking software\\\")]/../../..\"]]}"],["{\"selector\":\"script[id=\\\"jquery-core-js-after\\\"]\",\"tasks\":[[\"has-text\",\"e.preventDefault();\"]]}"],["{\"selector\":\"html.no-scroll\",\"action\":[\"remove-class\",\"no-scroll\"]}"],["{\"selector\":\".adsbygoogle\",\"action\":[\"remove\",\"\"],\"tasks\":[[\"upward\",1]]}","{\"selector\":\"body > div[id]\",\"action\":[\"style\",\"visibility: hidden !important\"],\"tasks\":[[\"matches-css\",{\"name\":\"position\",\"value\":\"^fixed$\"}]]}"],["{\"selector\":\"body[style*=\\\"overflow\\\"] > div[class]\",\"action\":[\"style\",\"opacity: 0 !important; visibility: collapse !important;\"],\"tasks\":[[\"has\",{\"selector\":\"> #passport-modal-overlay\"}]]}","{\"selector\":\"body[style*=\\\"overflow\\\"]\",\"action\":[\"style\",\"overflow: auto !important; position: relative !important; padding-right: 0px !important; inset: unset !important;\"],\"tasks\":[[\"has\",{\"selector\":\"> div[class] > #passport-modal-overlay\"}]]}"],["{\"selector\":\".l-section > .u-border-dark-blue\",\"tasks\":[[\"has-text\",\"Newsletters\"]]}"],["{\"selector\":\"#react-root ~ div[class*=\\\" \\\"][class$=\\\" \\\"][role=\\\"presentation\\\"]\",\"tasks\":[[\"has\",{\"selector\":\"a[href^=\\\"/accounts/\\\"][href*=\\\"signup/\\\"]\"}],[\"not\",{\"selector\":\"\",\"tasks\":[[\"has\",{\"selector\":\"button[type=\\\"button\\\"] > div > svg[aria-label][width=\\\"18\\\"][height=\\\"18\\\"][viewBox*=\\\"48\\\"]\"}]]}]]}"],["{\"selector\":\"body\",\"action\":[\"remove-attr\",\"contextmenu\"]}"],["{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"stopRefreshSite\"]]}"],["{\"selector\":\"style\",\"tasks\":[[\"has-text\",\"user-select: none;\"]]}"],["{\"selector\":\".modal\",\"tasks\":[[\"has\",{\"selector\":\"[style^=\\\"background-image: url(\\\\\\\"/assets/newsletter-\\\"]\"}]]}"],["{\"selector\":\"style\",\"action\":[\"remove\",\"\"],\"tasks\":[[\"has-text\",\"unselectable\"]]}"],["{\"selector\":\"[data-pw-desk]\",\"tasks\":[[\"upward\",1]]}"],["{\"selector\":\"#MainModule + div[class] > div[style^=\\\"width\\\"] > div > i[data-icon-name=\\\"OutlookLogo\\\"]\",\"tasks\":[[\"upward\",3]]}"],["{\"selector\":\"style\",\"action\":[\"remove\",\"\"],\"tasks\":[[\"has-text\",\"::selection\"]]}"],["{\"selector\":\".under-map-wrapper\",\"tasks\":[[\"upward\",1]]}"],["{\"selector\":\"style\",\"action\":[\"remove\",\"\"],\"tasks\":[[\"has-text\",\"/media print|user-select:/\"]]}"],["{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"ConsoleBan\"]]}"],["{\"selector\":\".ReactModalPortal\",\"tasks\":[[\"has\",{\"selector\":\".welcomeAd\"}]]}"],["{\"selector\":\"div[class=\\\"container_box content_box\\\"] > div:only-child > div:last-child > div:last-child > ins.adsbygoogle\",\"tasks\":[[\"upward\",4]]}","{\"selector\":\"div[class=\\\"container_box content_box\\\"] > div[id][class] > div:last-child > div:last-child > ins.adsbygoogle\",\"tasks\":[[\"upward\",3]]}","{\"selector\":\"div[id][class][style^=\\\"position:\\\"] > div:last-child > div:last-child > ins.adsbygoogle\",\"tasks\":[[\"upward\",3]]}"],["{\"selector\":\"body\",\"action\":[\"remove-attr\",\"/oncopy|oncut|onpaste/\"]}"],["{\"selector\":\".confirm\",\"tasks\":[[\"has-text\",\"AdBlocker\"]]}"],["{\"selector\":\"body > div[id]\",\"tasks\":[[\"has\",{\"selector\":\".modal_signup_dialog\"}]]}"],["{\"selector\":\"[bundlename=\\\"desktop_rpl_nsfw_blocking_modal\\\"]\",\"action\":[\"remove\",\"\"]}"],["{\"selector\":\"a\",\"action\":[\"remove-attr\",\"href\"],\"tasks\":[[\"has\",{\"selector\":\"shreddit-player\"}]]}","{\"selector\":\"shreddit-player\",\"action\":[\"remove-attr\",\"autoplay\"]}"],["{\"selector\":\".has-profile.post:first-child\",\"tasks\":[[\"has-text\",\"/adblock/i\"]]}"],["{\"selector\":\"form[id=\\\"tfnewsearch\\\"]\",\"action\":[\"remove-attr\",\"onsubmit\"]}"],["{\"selector\":\".message-inner\",\"tasks\":[[\"has\",{\"selector\":\".ads\"}]]}"],["{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"contextmenu\"]]}"],["{\"selector\":\"[oncopy=\\\"return false\\\"]\",\"action\":[\"remove-attr\",\"oncopy\"]}"],["{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"copyprotect\"]]}"],["{\"selector\":\"[data-text-as-pseudo-element*=\\\" push \\\"]\",\"tasks\":[[\"upward\",\"[role]\"],[\"upward\",\"[role]\"]]}"],["{\"selector\":\"style\",\"action\":[\"remove\",\"\"],\"tasks\":[[\"has-text\",\":not(input):not(textarea)\"]]}"],["{\"selector\":\".ReactModal__Overlay--after-open\",\"tasks\":[[\"has\",{\"selector\":\"iframe[srcdoc], img\"}],[\"has-text\",\"signing up\"]]}","{\"selector\":\".ReactModal__Overlay--after-open\",\"tasks\":[[\"has-text\",\"/Premium|Try 7 days/\"]]}","{\"selector\":\"main > div[class*=\\\"-\\\"] > div[class^=\\\"_\\\"] > div[class^=\\\"_\\\"] > div[class]\",\"tasks\":[[\"has\",{\"selector\":\"> div[class^=\\\"_\\\"]\",\"tasks\":[[\"has-text\",\"Do your part to support us\"]]}]]}"],["{\"selector\":\"body\",\"action\":[\"remove-attr\",\"/onselectstart|oncopy|oncontextmenu/\"]}"],["{\"selector\":\"a[class^=\\\"_\\\"][href^=\\\"/restaurants\\\"]\",\"tasks\":[[\"has\",{\"selector\":\"div[style=\\\"background: rgb(58, 60, 65) none repeat scroll 0% 0%; color: rgb(255, 255, 255); border-color: rgb(30, 32, 35) transparent;\\\"]\"}]]}"],["{\"selector\":\"*\",\"action\":[\"remove-attr\",\"oncontextmenu\"]}"],["{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"innerText\"]]}"],["{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"preventDefault\"]]}"],["{\"selector\":\".dark-theme-dialog__dialogBody___106Di\",\"tasks\":[[\"upward\",4]]}"],["{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"/debugger/i\"]]}"],["{\"selector\":\"div[tabindex=\\\"0\\\"]\",\"tasks\":[[\"matches-css\",{\"name\":\"position\",\"value\":\"^fixed$\"}],[\"has\",{\"selector\":\"[href=\\\"/signup\\\"]\"}]]}"],["{\"selector\":\"#layers > div[class] > div[class] > div[class] > div[class]\",\"tasks\":[[\"has\",{\"selector\":\"> div[class] > div[class] > div[class] > div[class] > div[class] > a[href=\\\"/login\\\"]\"}]]}"],["{\"selector\":\".no-select\",\"action\":[\"remove-class\",\"no-select\"]}"],["{\"selector\":\"section\",\"tasks\":[[\"has-text\",\"Winter-Update\"],[\"upward\",1]]}"],["{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"oncontextmenu\"]]}"],["{\"selector\":\"[href=\\\"/about#support\\\"]\",\"tasks\":[[\"upward\",2]]}"],["{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"DisableDevtool\"]]}"],["{\"selector\":\".item.sidebar.reader-comp.main-gray-bg\",\"tasks\":[[\"has\",{\"selector\":\"a[href=\\\"/tilaa-moottorin-uutiskirje/\\\"]\"}]]}"],["{\"selector\":\"[class^=\\\"ArchonLayout_containerSidebar\\\"]\",\"tasks\":[[\"has\",{\"selector\":\"> [class^=\\\"Advertisements\\\"]\"}]]}"],["{\"selector\":\".loading-text\",\"action\":[\"remove-class\",\"loading-text\"]}"],["{\"selector\":\"body\",\"action\":[\"remove-attr\",\"oncontextmenu\"]}"],["{\"selector\":\"body > div:nth-of-type(1) > div\",\"tasks\":[[\"has-text\",\"adblocker\"]]}"],["{\"selector\":\".around-desktop-ad\",\"tasks\":[[\"upward\",1]]}"],["{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"window.carbonLoaded\"]]}"],["{\"selector\":\".adbanner\",\"action\":[\"remove\",\"\"]}"],["{\"selector\":\"#side > ins.adsbygoogle\",\"tasks\":[[\"upward\",1]]}"],["{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"document.onkeydown\"]]}"],["{\"selector\":\".modal-content\",\"tasks\":[[\"has\",{\"selector\":\".text > b\",\"tasks\":[[\"has-text\",\"Privacy Policy\"]]}]]}"],["{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"/oncontextmenu|devtools|stateObject|debugger/\"]]}"],["{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"/contextmenu|devtool/\"]]}"],["{\"selector\":\".elementor-top-column h6\",\"tasks\":[[\"has-text\",\"advertisement\"],[\"upward\",\".elementor-top-column\"]]}"],["{\"selector\":\".notificationsContainer\",\"tasks\":[[\"has-text\",\"whitelisten of beleef Tweakers\"]]}"],["{\"selector\":\"\",\"tasks\":[[\"xpath\",\"//*[contains(text(),\\\"AdB\\\")]\"]]}"],["{\"selector\":\"style\",\"action\":[\"remove\",\"\"],\"tasks\":[[\"has-text\",\"/user-select|::selection/\"]]}"],["{\"selector\":\"p\",\"tasks\":[[\"has-text\",\"Adblock\"]]}"],["{\"selector\":\"\",\"tasks\":[[\"xpath\",\"//*[contains(text(),\\\"Adblock\\\")]\"]]}"],["{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"checkAdblockBait\"]]}"],["{\"selector\":\"html\",\"action\":[\"remove-class\",\"modal-open\"],\"tasks\":[[\"watch-attr\",[\"class\"]]]}"],["{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"nocontextmenu\"]]}"],["{\"selector\":\"\",\"tasks\":[[\"xpath\",\"//*[contains(text(),\\\"blocker\\\")]\"]]}"],["{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"We think our Android\"]]}"],["{\"selector\":\"body[oncontextmenu=\\\"return false\\\"]\",\"action\":[\"remove-attr\",\"oncontextmenu\"]}","{\"selector\":\"script\",\"tasks\":[[\"has-text\",\"_0x\"]]}"]];

const hostnamesMap = new Map([["ferroviando.com.br",[1,7]],["jornaljoca.com.br",1],["visse.com.br",1],["javsubtitle.co",[1,10]],["afrikmag.com",1],["alphagirlreviews.com",1],["aprendeinglessila.com",1],["arcanescans.com",1],["bigdatauni.com",1],["bingotingo.com",1],["clockks.com",1],["codedosa.com",1],["counciloflove.com",[1,7]],["cracksone.com",1],["drkrok.com",1],["filmzone.com",1],["flashdumpfiles.com",1],["formatatmak.com",1],["getective.com",1],["globaldefensecorp.com",1],["gossipnextdoor.com",1],["guidingliterature.com",1],["hayatbilgileri.com",1],["hellokpop.com",1],["hiraethtranslation.com",1],["ieltsliz.com",1],["immobiliaremia.com",1],["infokik.com",[1,7]],["iptv4best.com",1],["jafekri.com",[1,7]],["jbjbgame.com",1],["joysound.com",1],["kapitalis.com",1],["kitchennovel.com",1],["koalasplayground.com",1],["learninsta.com",1],["liveyourmaths.com",1],["moneyexcel.com",1],["ncert-solutions.com",1],["home.novel-gate.com",1],["placementstore.com",1],["poolpiscina.com",1],["riwyat.com",1],["samsungtechwin.com",1],["selfstudyanthro.com",1],["selfstudyhistory.com",1],["tech-recipes.com",1],["tempatwisataseru.com",1],["theaircurrent.com",1],["tipssehatcantik.com",1],["truyenbanquyen.com",[1,7]],["viatasisanatate.com",1],["wikiofcelebs.com",1],["winmeen.com",1],["neuroteam-metz.de",1],["velicu.eu",1],["newspao.gr",1],["ncertsolutions.guru",1],["tiempo.hn",1],["rukim.id",1],["ibps.in",1],["colegiosconcertados.info",1],["coffeeapps.ir",1],["infodifesa.it",1],["gakki.me",1],["tunegate.me",1],["mediahiburan.my",1],["cours-de-droit.net",1],["ezmanga.net",[1,7]],["nocturnetls.net",1],["programasvirtualespc.net",1],["onlineonderdelenshop.nl",1],["day-hoc.org",1],["licensekeys.org",1],["sertracen.com.pa",1],["kulinarnastronamocy.pl",[1,7]],["blogvisaodemercado.pt",1],["ananda-yoga.ro",1],["anascrie.ro",1],["cabinetexpert.ro",1],["pitesti24.ro",1],["visefierbinti.ro",1],["voxvalachorum.ro",1],["ziarulargesul.ro",1],["kaystls.site",1],["kicknews.today",1],["primicia.com.ve",1],["maduras.vip",1],["media.framu.world",1],["animesaga.in",3],["fritz.ai",4],["blog.inkdrop.app",4],["blog.dp6.com.br",4],["uxdesign.cc",4],["atrium.co",4],["newco.co",4],["thecontrol.co",4],["unpatent.co",4],["backstage.1blocker.com",4],["500ish.com",4],["tech.ahrefs.com",4],["artplusmarketing.com",4],["backchannel.com",4],["badootech.badoo.com",4],["baharudinyusuf.com",4],["bitcointechtalk.com",4],["bitwarden.com",4],["bluerockpublicradio.com",4],["boomsupersonic.com",4],["bradfieldcs.com",4],["brightthemag.com",4],["tech.buzzfeed.com",4],["blog.canopas.com",4],["blog.coinbase.com",4],["blog.confiant.com",4],["dave-bailey.com",4],["discordapp.com",4],["doist.com",4],["doit-intl.com",4],["doublepulsar.com",4],["economist.com",4],["electricliterature.com",4],["elidourado.com",4],["getadblock.com",4],["levelup.gitconnected.com",4],["greylock.com",4],["blog.growthhackers.com",4],["headmelted.com",4],["helium.com",4],["blog.hiri.com",4],["howwegettonext.com",4],["iheart.com",4],["injusticetoday.com",4],["insightdatascience.com",4],["itsyourturnblog.com",4],["kiwi.com",4],["learngoprogramming.com",4],["learningbyshipping.com",4],["ledwards.com",4],["legalist.com",4],["broadcast.listennotes.com",4],["logrocket.com",4],["blog.ltse.com",4],["mapbox.com",4],["medium.com",4],["melmagazine.com",4],["mondaynote.com",4],["open.nytimes.com",4],["nyulocal.com",4],["ofdollarsanddata.com",4],["postlight.com",4],["proandroiddev.com",4],["signalvnoise.com",4],["slackhq.com",4],["news.smugmug.com",4],["springboard.com",4],["startupsventurecapital.com",4],["theawl.com",4],["thebigroundtable.com",4],["thebillfold.com",4],["thebolditalic.com",4],["theringer.com",4],["thriveglobal.com",4],["timeline.com",4],["towardsdatascience.com",4],["udacity.com",4],["usejournal.com",4],["warisboring.com",4],["wearemel.com",4],["whatahowler.com",4],["writingcooperative.com",4],["x.company",4],["slack.engineering",4],["blog.angular.io",4],["blog.bitsrc.io",4],["bolt.io",4],["codeburst.io",4],["fossa.io",4],["itnext.io",4],["okmeter.io",4],["javascript.plainenglish.io",4],["prototypr.io",4],["rainway.io",4],["stoplight.io",4],["theabacus.io",4],["blog.waffle.io",4],["coach.me",4],["citizen428.net",4],["dotandline.net",4],["keepingstock.net",4],["esciencecenter.nl",4],["thetaoist.online",4],["checkio.org",4],["blog.devcolor.org",4],["freecodecamp.org",4],["iota.org",4],["jupyter.org",4],["sagefy.org",4],["standardnotes.org",4],["blog.statebox.org",4],["thinkprogress.org",4],["uxplanet.org",4],["faun.pub",4],["blog.twitch.tv",4],["appd.at",5],["themosvagas.com.br",5],["hitproversion.com",5],["operatorsekolahdbn.com",5],["techsini.com",5],["9now.com.au",6],["lapresse.ca",8],["eplayer.click",9],["streamservicehd.click",9],["kooora4livs.com",[9,41]],["olacast.live",9],["kooora4lives.net",[9,41]],["librospreuniversitariospdf.blogspot.com",10],["lvturbo.com",10],["sbbrisk.com",10],["sbface.com",10],["sbspeed.com",10],["camcaps.io",10],["streamsb.net",10],["vtplayer.net",10],["weakstream.org",10],["camcaps.to",10],["apps.jeurissen.co",11],["1fichier.com",12],["8muses.com",13],["androidauthority.com",14],["apk1s.com",15],["dreamsfriend.com",15],["mercenaryenrollment.com",15],["xossipy.com",15],["appimagehub.com",16],["linux-apps.com",16],["pling.com",16],["gnome-look.org",16],["store.kde.org",16],["opendesktop.org",16],["xfce-look.org",16],["askubuntu.com",17],["serverfault.com",17],["stackapps.com",17],["stackexchange.com",17],["superuser.com",17],["mathoverflow.net",17],["canalnatelinhaonline.blogspot.com",18],["bloombergquint.com",19],["cultofmac.com",20],["deezer.com",21],["diffnow.com",22],["duolingo.com",23],["elektrikmen.com",24],["embibe.com",25],["discussion.evernote.com",26],["prestashop.com",26],["expquebec.com",27],["facebook.com",28],["facebookcorewwwi.onion",28],["facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion",28],["b-m.facebook.com",29],["iphone.beta.facebook.com",29],["m.beta.facebook.com",29],["mtouch.beta.facebook.com",29],["touch.beta.facebook.com",29],["x.beta.facebook.com",29],["iphone.facebook.com",29],["m.facebook.com",29],["mobile.facebook.com",29],["mtouch.facebook.com",29],["touch.facebook.com",29],["x.facebook.com",29],["b-m.facebookcorewwwi.onion",29],["touch.beta.facebookcorewwwi.onion",29],["iphone.facebookcorewwwi.onion",29],["m.facebookcorewwwi.onion",29],["mobile.facebookcorewwwi.onion",29],["mtouch.facebookcorewwwi.onion",29],["touch.facebookcorewwwi.onion",29],["x.facebookcorewwwi.onion",29],["b-m.facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion",29],["touch.beta.facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion",29],["iphone.facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion",29],["m.facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion",29],["mobile.facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion",29],["mtouch.facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion",29],["touch.facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion",29],["x.facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion",29],["faloo.com",30],["financasdeouro.com",31],["verfutebol.net",31],["foxnews.com",32],["gdrivedescarga.com",33],["hket.com",34],["hotcleaner.com",35],["indeed.com",36],["indiewire.com",37],["instagram.com",38],["ipphone-warehouse.com",39],["jpost.com",40],["launer.com",42],["lazytranslations.com",43],["lightnovelpub.com",44],["outlook.live.com",45],["lokercirebon.com",46],["loginhit.com.ng",46],["marinetraffic.com",47],["naaree.com",48],["newsrade.com",49],["nytimes.com",50],["online2pdf.com",51],["pendulumedu.com",52],["photopea.com",53],["quora.com",54],["reddit.com",55],["embed.reddit.com",56],["forum.release-apk.com",57],["safirsoft.com",58],["forum.sbenny.com",59],["seriesperu.com",60],["shortform.com",61],["skidrowreloaded.com",62],["web.skype.com",63],["snbc13.com",64],["watchmdh.to",64],["spanishdict.com",65],["studiestoday.com",66],["swiggy.com",67],["teachoo.com",68],["th-world.com",69],["themeslide.com",70],["warungkomik.com",70],["tunein.com",71],["turkbettv154.com",72],["twitter.com",[73,74]],["x.com",[73,74]],["twitter3e4tixl4xyajtrzo62zg5vztmjuricljdp2c5kshju4avyoid.onion",74],["webnovel.com",75],["airbnb.de",76],["yoututosjeff.es",77],["gridcoinstats.eu",78],["jpopsingles.eu",79],["adslink.pw",79],["moottori.fi",80],["archon.gg",81],["techcrunch-com.translate.goog",82],["ncrtsolutions.in",83],["hardware.info",84],["tarnkappe.info",85],["cssreference.io",86],["tileman.io",87],["bwitter.me",88],["allcryptoz.net",89],["crewbase.net",89],["crewus.net",89],["shinbhu.net",89],["shinchu.net",89],["thumb8.net",89],["thumb9.net",89],["topcryptoz.net",89],["ultraten.net",89],["uniqueten.net",89],["myanimelist.net",90],["phimlongtieng.net",91],["playertv.net",92],["streambuddy.net",93],["tweakers.net",94],["wotlabs.net",95],["janvissersweer.nl",96],["nusantararom.org",97],["sythe.org",98],["mgsm.pl",99],["surreyhillsgrocer.sg",100],["teamkong.tk",101],["mail.tm",102],["dailymail.co.uk",103],["ntuplay.xyz",104]]);

const entitiesMap = new Map([["extreme-down",0],["fmovies",1],["pinterest",2],["vidmoly",3]]);

const exceptionsMap = new Map(undefined);

self.proceduralImports = self.proceduralImports || [];
self.proceduralImports.push({ argsList, hostnamesMap, entitiesMap, exceptionsMap });

/******************************************************************************/

})();

/******************************************************************************/
