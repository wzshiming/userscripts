// ==UserScript==
// @name        Github Clear Date
// @namespace   https://github.com/wzshiming/userscripts
// @version     0.3.1
// @description Add a clear date to the relative time in Github
// @author      wzshiming
// @match       *://github.com/*
// @grant       none
// @icon        https://github.githubassets.com/pinned-octocat.svg
// @updateURL   https://github.com/wzshiming/userscripts/raw/master/github/github-clear-date.user.js
// @downloadURL https://github.com/wzshiming/userscripts/raw/master/github/github-clear-date.user.js
// @supportURL  https://github.com/wzshiming/userscripts/issues
// @license     MIT License
// ==/UserScript==

(function () {
    'use strict';

    let MutationObserver = window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;

    let config = {
        childList: true,
        subtree: true,
        attributes: true,
    };
    let observer = new MutationObserver(mutation);
    observer.observe(document.body, config);
    mutate(document.body);
})();

function mutate(elem) {
    elem.querySelectorAll('relative-time').forEach(formatTime);
}

function mutation(mutationsList) {
    for (let mutation of mutationsList) {
        mutate(mutation.target.parentNode);
    }
}

function formatTime(item) {
    let text = item.shadowRoot.innerHTML;
    if (text.length == 0 || text.indexOf("(") >= 0) {
        return
    }
    let date = item.datetime.split("T")[0].replaceAll("-", "/")
    if (date.length < 8) {
        return
    }

    let now = new Date();
    let year = now.getFullYear();
    if (date.indexOf(year) == 0) {
        date = date.substr(5);
    } else if (date[0] == "2" && date[1] == "0") {
        date = date.substr(2);
    }

    item.shadowRoot.innerHTML += "(" + date + ")";
}
