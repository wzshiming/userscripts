// ==UserScript==
// @name        Github Clear Date
// @namespace   https://github.com/wzshiming/userscripts
// @version     0.2
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
        let text = item.shadowRoot.innerHTML;
        if (text.length == 0 || text.indexOf("(") >= 0) {
            return
        }
        let date = item.datetime.split("T")[0].replaceAll("-", "/")
        if (date.length < 8) {
            return
        }

        if (date[0] == "2" && date[1] == "0") {
            date = date.substr(2);
        }
        item.shadowRoot.innerHTML += "(" + date + ")";
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
        elem.querySelectorAll('relative-time').forEach(formatTime);
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
