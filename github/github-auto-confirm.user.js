// ==UserScript==
// @name        Github Auto Confirm
// @namespace   https://github.com/wzshiming/userscripts
// @version     0.1
// @description Automatically enter confirmation text in Github
// @author      wzshiming
// @match       *://github.com/*
// @grant       none
// @icon        https://github.githubassets.com/pinned-octocat.svg
// @updateURL   https://github.com/wzshiming/userscripts/raw/master/github/github-auto-confirm.user.js
// @downloadURL https://github.com/wzshiming/userscripts/raw/master/github/github-auto-confirm.user.js
// @supportURL  https://github.com/wzshiming/userscripts/issues
// @license     MIT License
// ==/UserScript==

(function () {
    'use strict';

    var items = document.getElementsByTagName("button");
    for (var i in items) {
        let item = items[i]
        if (item && item.hasAttribute && item.hasAttribute("data-disable-invalid") && item.hasAttribute("disabled") &&
            item.previousElementSibling && item.previousElementSibling.children &&
            item.parentElement && item.parentElement.previousElementSibling && item.parentElement.previousElementSibling.children) {
            item.removeAttribute("disabled");
            item.previousElementSibling.children[0].value = item.parentElement.previousElementSibling.children[0].innerText;
        }
    }
})();
