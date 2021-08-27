// ==UserScript==
// @name        Github Clear Date
// @namespace   https://github.com/wzshiming/userscripts
// @version     0.1
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

    let formatTime = function (item) {
        let text = item.innerText;
        if (text.length == 0 || text.indexOf("(") >= 0) {
            return
        }
        let tmp = text.toLowerCase();
        if (tmp.indexOf("day") >= 0 || tmp.indexOf("month") >= 0 || tmp.indexOf("year") >= 0) {
            item.innerText = item.date.toISOString().split("T")[0].replaceAll("-", "/") + "(" + text + ")";
        }
    }

    let mutation = function (mutationsList, observer) {
        setTimeout(function () {
            for (let mutation of mutationsList) {
                mutate(mutation.target.parentNode);
            }
        }, Math.round(Math.random() * 1000));
    }
    let mutate = function (elem) {
        if (!elem) {
            return
        }
        elem.querySelectorAll("[datetime]").forEach(formatTime);
    }
    let config = { childList: true, subtree: true, characterData: true };
    let ids = ["dashboard", "js-repo-pjax-container", "js-pjax-container"]
    for (let id of ids) {
        let elem = document.getElementById(id);
        if (!elem) {
            continue
        }
        let observer = new MutationObserver(mutation);
        observer.observe(elem, config);
        break
    }

    mutate(document);
})();
