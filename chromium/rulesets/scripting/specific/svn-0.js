/*******************************************************************************

    uBlock Origin - a browser extension to block requests.
    Copyright (C) 2019-present Raymond Hill

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

// ruleset: svn-0

/******************************************************************************/

// Important!
// Isolate from global scope
(function uBOL_cssSpecificImports() {

/******************************************************************************/

const argsList = ["onl-article-connected,\nonl-banner",".ng-star-inserted.banner",".banner","onl-magick-box",".outbrain","onl-eurojackpot-teaser",".grid--ads,\n.ng-star-inserted > .ng-star-inserted > .sidebar__box,\n.ng-star-inserted.background > .ng-star-inserted > .adplayer,\n.sidebar__box--banner,\nonl-last-article,\nonl-pr-articles,\nonl-voyo.sidebar__box","#Banner300R",".widget-ad-bottom-banner",".td-a-rec",".shop__card.noPaddingAlways.col-md-12,\n.topBanner,\n.topBannerLanding","#coloumnAd,\n#newsOfTheDay,\n#servicesToItems,\n.Banner--adsenseForSearch,\n.BannerAlignment,\n.BannerBillboard,\n.EntityList--ListItemFeaturedStore,\n.EntityList--ListItemVauVauAd,\n.HeaderSpotlight.Attention,\n.HeaderSpotlight:has(a[href^=\"https://bit.ly\"]),\n.TitlePage-bannerWrapper,\n.TitlePage-block.Headline,\n.trakica_container","#block-block-35,\n#left_click_div,\n#right_click_div,\n.featurebar_right,\n.front_topgames_footer","#sp-pasice,\n#sp-pasice3,\n#sp-user2,\n.bannergroup,\n.editoriali,\n.matej-carousell-left,\n.matej-carousell-right","#html_javascript_adder-2",".addthis_toolbox,\n.widget_subscribe_widget","aside.ad",".ad","#contentLeft,\n#contentRight > .leaderboard,\n#playzone > .leaderboard,\n#userGenGames",".banner-inner",".grid1.rectangle",".desktopAd","blockquote",".microsite-article",".microsite-section",".banner-wr,\n.box-shadow",".sideBoxBanner",".td-post-sharing-top",".td-header-rec-wrap","#nestandard-holder,\n.ban_item,\n.do-space,\n.header-blocks-aspace","[id^=\"pons-ad\"]","#banner","#single_post > .banner,\n.content > .banner,\n.img-ad,\n.partners",".osrednji_del > .poravnajgor:nth-of-type(1),\ntd > table > tbody > tr > td > .poravnajgor > tbody > tr:nth-of-type(1)",".re-cta-advertisement","#panels > aside > div:nth-of-type(3),\n#panels > aside > div:nth-of-type(4)",".lwdgt",".after-nav-ads","div.job-item.ad-wrapper",".iAdserver","#biscuitFormDiv","#bannerC1_728,\n#bannerC2,\n.bannerR2","#header-right-section,\n#heateor_ss_browser_popup_bg",".custom-html-widget,\n.g-single,\n.widget-10.widget-last.widget-even",".banners-box",".BannerBox972,\n.GO-banner-Billboard,\n.Oblika3Container","#desnistolpec,\n#oglas",".banner2,\n.banner_cont","#ad-detail,\n#ad-ribbon,\n#top_wrap,\n.ad-container",".category > .col-md-3","#lnl-footer,\n.category-banner-desktop,\n.feedo,\n.widget_oglas_widget",".livenetlife_links",".roglas_lista:nth-of-type(2),\n.roglas_listaBanner","#newsletterFrame,\n.bannerInText,\n.h-banner",".bsaProItems","#itisAdPromo,\n#yodaarticle,\n.card--ts_storitva,\n.fold__homepage_banner,\n.grid-12.grid-md-3,\n.grid-12.grid-md-8.grid-lg-3,\n.marketing,\n.neo-image,\n.spored_widget--special > .no-gutter,\n.ts_storitve,\n.widgetWrap",".widget-footer",".sponzorirani,\n[id^=\"ad\"]","#banner_side_layer,\n.banner_footer",".mosaicflow__column:nth-of-type(4)",".img-responsive,\n.oglas2",".background_link",".banner-app-article",".livenetlife_linkswidget_logo","#baner,\n#banners,\n.uvodna_bottomBaners",".xl\\:h-250.h-470",".banner-970,\n.td-zsd",".td-is-sticky.tdc-column",".thumb-list--article","onl-microsite",".floatingProductContainer,\n.hero-main,\n.top-brands,\na[href^=\"https://www.ceneje.si/Redirect/Deeplink\"] > .productBoxGrid",".sfsi_outr_div","div[class^=\"banner-square-\"]","#banner-seminarji",".ekosistem,\n.read-also-block","#gkSidebar > .nomargin.box","#app-messages,\n.article-related:nth-of-type(2)",".opened","#topBanner",".lokalnoBox",".lg\\:mb-0",".module.banner",".pattern > .span2,\n.span2:nth-of-type(3) > div","#top_banner",".bs-irp-thumbnail-3-full","#article_bottom_author_butterfly,\n#bart_banner,\n#hbr,\n#siteHeaderPanorama,\n.adbox,\n.kos_semitrans,\n.taxo_block","#adtopart,\n#article_social_top,\n#top > .nbs-flexisel-container","#bannerFooter_wrap,\n.verde_wrap",".advertisement",".outFrameRight",".banner-top-wrap,\n.banner1","#promo","#fan-exit,\n#fanback",".ads",".hidden-sm,\n.signad,\n.sticky-position",".other",".ekode-content-dno",".banner--wrapper,\n.content--cta,\n.exposed__banner,\n.region--cta","#doyoulikeus,\n.portus-video-slider-min","#billboard_outstream,\n#inline1,\n#inline2,\n#inline3-end,\n#mplayvideo,\n.adsbygoogle,\n.hidden-mobile",".banner-scroller,\n.headbanner,\na[target=\"_blank\"][href^=\"http://www.mlacom.si/iskalnik\"]",".fancybox-overlay,\n.info-box > .social",".style-buttons.before_content","#banner05,\n#skytower,\n.navigatortop,\n.titlered:nth-of-type(4)",".nativendo-container,\n.prNews",".nat-content",".widget-wrapper:nth-of-type(5),\n.widget-wrapper:nth-of-type(6),\n[href=\"https://samopostrezna.com/\"]",".obcni-contentexchange,\n.obcni-widget",".td-main-sidebar",".banner-promotion,\n.banner-wrapper,\n.in-post-related-news,\n.third-party-menu-container",".main-first.main > .index_right",".sticky-wrapper",".widget_custom_html",".bannerbox,\n.box2,\n.dadbot,\n.dadmid,\n.dadtop,\n.rightb300600,\n.top728,\n[src=\"https://www.partis.si/img/pixel.gif\"]","#startPageRightLabel,\n#startPageRightResults",".reklame-na-sredi,\n[id^=\"reklama\"]","#izpostavljeni,\n#show > .ban_item,\n#show > div > div > .ban_item,\n.image_carousel_post > [href^=\"/show//\"],\n.lightface,\n.widget-shop","#maincontent > .nospace > tbody > tr > td > .moduletable",".external_wall_right_wrapper","#divBannerjiDesnoZunaj > .reklamaDesnoZunaj,\n.reklamaDesnoZunaj > .presledek,\n.teloCenter > * > div:nth-of-type(12)","#krka_bottom_billboard,\n#krka_top_billboard,\n.banner-box,\n.mb-g-20,\n[src^=\"//tdn.media24.si\"]",".divider-news,\n.h2501","#DivShowBanners,\n#DivShowBannersForFrontPage,\n#bglink","#newsletter-popup-unsigned,\n.billboard-advert-item,\n.dynamic-advert-article-inside,\n.exposed-article,\n.inArticle,\n.inverted-colors.teal.emphasis,\n.iprom-background-placement",".monadplug-native-main-wrapper",".moduletable_pasica",".embed_article,\n.group_a__box7,\n.group_a__pos_banner_440,\n.group_a_category__box7,\n.pos-banner__article,\n.store_links",".central_banner_inner_container,\n.news-banner,\ndiv > .side-banner",".side_json_banners_1","#banner_landscape,\n.containerinside,\n.partner-wrap","#odkrito_bottom_billboard,\n#odkrito_bottom_kocka,\n#odkrito_middle_billboard,\n#odkrito_top_billboard,\n#odkrito_top_kocka,\n.bg-najnakupi-blue-light,\n.content > ul,\n.h-80,\n.justify-center.flex.container,\n.najnakupi,\n.najnakupi-news,\n.overflow-x-hidden,\n.promo-box,\n.right-sticky,\n.shadow-md.w-tk,\n.xl\\:container > .flex.justify-center,\n[id^=\"firstSiteBanner\"]",".main-left > .fpNews-title,\n.my-4 > .flex-wrap","#mc4wp-form-1,\n.ai_widget,\n.widget_mt_latestposts_widget","#exitpopup-modal,\n.display-posts-listing,\n.display-posts-title",".td-post-sharing-classic,\n.wallpaper--active",".ai-viewport-1,\n[id^=\"pukka-ad-widget-\"]","#banner_container,\n.baner","[id^=\"oglasi\"]",".border-grey-light.sidebar > .border-grey-light","#banner45,\n#facebook,\n#facebook-like,\n#header-banner,\n#wrapper > a[href^=\"http://www.volan.si/admin/upload/ads\"],\na[href^=\"https://www.volan.si/admin/upload/ads/generator.php\"]","#bgbanner","[id^=\"post\"] > .article-content > .mashsb-main.mashsb-container",".hupso-share-buttons",".widget_ads_big.widget",".article__aditionl_content,\n.related_article","#RightBanner"];

const hostnamesMap = new Map([["24ur.com",[0,1,2,3,4,5,6]],["moskisvet.com",[0,3,4,23,24,25]],["okusno.je",[0,23,24]],["bibaleze.si",[0,23,24,65]],["cekin.si",[0,2,3,4,5,23,69]],["dominvrt.si",[0,23,65,80]],["vizita.si",[0,23,24,138]],["zadovoljna.si",[0,2,3,23,24]],["caszazemljo.si",[1,68]],["vreme.24ur.com",2],["napovednik.com",2],["strojnistvo.com",2],["studentarija.net",[2,58]],["mojaleta.si",[2,104]],["sta.si",2],["svet24.si",[2,36,130]],["tehnik.telekom.si",2],["avtomanija.com",7],["avtomanija.si",7],["avtomobilizem.com",8],["avtonasveti.com",9],["mojprihranek.si",[9,107]],["bicikel.com",10],["naprostem.si",10],["tekac.si",10],["bolha.com",11],["bringler.com",12],["dnevne-novice.com",13],["dne.enaa.com",14],["lifestyle.enaa.com",15],["hudo.com",[16,17]],["mladina.si",[17,101]],["vreme.zurnal24.si",17],["igrice.hudo.com",18],["mojepotovanje.hudo.com",[19,20]],["moski.hudo.com",[20,21]],["zenska.hudo.com",[21,22]],["med.over.net",[22,36,50,51]],["nogomania.com",26],["planet-lepote.com",[27,28]],["pravljicna.si",27],["utrinek.si",27],["zdravje.si",27],["tocnoto.si",[28,51,133]],["tvambienti.si",[28,134]],["pomurec.com",29],["pons.com",30],["poraba.com",31],["slo-tech.com",[31,35]],["racunalniske-novice.com",32],["racunovodja.com",33],["nepremicnine.si21.com",34],["sobotainfo.com",[36,37]],["metropolitan.si",[36,99]],["n1info.si",[36,109]],["t3tech.si",36],["studentski-servis.com",38],["vecer.com",39],["slovnica.slovenscina.eu",40],["avto.info",41],["celje.info",42],["kozjansko.info",43],["adomnia.net",44],["avto.net",45],["hribi.net",46],["mediaspeed.net",47],["nepremicnine.net",48],["obala.net",49],["porscheinterauto.net",52],["ringaraja.net",53],["sentjur.net",54],["siol.net",55],["tv-spored.siol.net",56],["slonep.net",57],["tekaskiforum.net",59],["instore.rs",60],["instore.si",60],["1nadan.si",61],["aktivni.si",[62,63]],["slovenskenovice.si",[63,126]],["avto-fokus.si",64],["bizi.si",66],["bodieko.si",67],["ceneje.si",70],["ciklon.si",71],["citymagazine.si",72],["data.si",73],["delo.si",74],["demokracija.si",75],["dnevnik.si",76],["dobrakarma.si",[77,78]],["podarimo.si",[78,114]],["dolenjskilist.si",79],["druzina.si",81],["e-mesto.si",82],["enajdi.si",83],["explicit.si",84],["finance.si",85],["izvozniki.finance.si",86],["gohome.si",87],["golfportal.si",88],["regionalobala.si",[88,121]],["informiran.si",89],["kajkupiti.si",90],["kolosej.si",91],["kosmika.si",92],["lepdan.si",93],["vsikuponi.si",[93,140]],["letakonosa.si",94],["lokalno.si",95],["lupa-portal.si",96],["marketingmagazin.si",97],["megasvet.si",98],["mlacom.si",100],["mladipodjetnik.si",102],["mobile.si",103],["mojaobcina.si",105],["mojblink.si",106],["motiviran.si",108],["najdi.si",110],["namen.si",111],["novice.si",112],["partis.si",113],["podjetnik.si",115],["pokukaj.si",116],["preberi.si",117],["publishwall.si",118],["radio1.si",119],["radiokrka.si",120],["rfantasy.si",122],["rtvslo.si",123],["skandal24.si",124],["slo-android.si",125],["stajerskival.si",127],["stop-neplacniki.si",128],["stud-serv-mb.si",129],["ekipa.svet24.si",131],["tehnozvezdje.si",132],["vandraj.si",135],["varcevanje-energije.si",136],["vemkajjem.si",137],["volan.si",139],["zastarse.si",141],["zdravi-recepti.si",142],["zenskisvet.si",143],["zurnal24.si",144],["spored.tv",145]]);

const entitiesMap = new Map(undefined);

const exceptionsMap = new Map(undefined);

self.specificImports = self.specificImports || [];
self.specificImports.push({ argsList, hostnamesMap, entitiesMap, exceptionsMap });

/******************************************************************************/

})();

/******************************************************************************/
