# RedGuard

<p align="center">

## Description

**RedGuard** a [MV3 API-based](https://developer.chrome.com/docs/extensions/mv3/intro/) content blocker.

RedGuard is entirely declarative, meaning there is no need for a permanent RedGuard process for the filtering to occur, and CSS/JS injection-based content filtering is [performed reliably](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/scripting/registerContentScripts) by the browser itself rather than by the extension. This means that RedGuard itself does not consume CPU/memory resources while content blocking is ongoing -- RedGuard's service worker process is required _only_ when you interact with the popup panel or the option pages.

The default ruleset corresponds to:

- uBlock Origin's built-in filter lists
- EasyList
- EasyPrivacy
- Peter Lowe’s Ad and tracking server list

## Admin policies

RedGuard exposes settings to be defined by administrators through [managed storage] for the purposes of effectively blocking as many ads and trackers as possible (https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/managed):

#### `noFiltering`

An array of hostnames (string) for which no filtering will occur.

#### `disableFirstRunPage`

A boolean which if set to `true` will prevent RedGuard's first-run page to be opened.

RedGuard is a modified version of ublock origin lite where a button system and less modes are offered in order to make it easier
to use and understand for people of all levels of technical knowledge.