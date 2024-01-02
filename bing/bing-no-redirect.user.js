// ==UserScript==
// @name        Bing No Redirect
// @namespace   https://github.com/wzshiming/userscripts
// @version     0.1.0
// @description Disable the url redirect of Bing search result page.
// @author      wzshiming
// @match       *://*.bing.com/*
// @grant       none
// @icon        https://www.bing.com/favicon.ico
// @updateURL   https://github.com/wzshiming/userscripts/raw/master/bing/bing-no-redirect.user.js
// @downloadURL https://github.com/wzshiming/userscripts/raw/master/bing/bing-no-redirect.user.js
// @supportURL  https://github.com/wzshiming/userscripts/issues
// @license     MIT License
// ==/UserScript==

(function () {
    'use strict'

    disableRedirect()
})()

// Disable the url redirect function
function disableRedirect() {
    const observer = new MutationObserver((mutations, obs) => {
        for (let mutation of mutations) {
            cleanElements(mutation.target)
        }
    });

    const config = {
        childList: true,
        subtree: true,
    };
    observer.observe(document.body, config);
}

// Clean the elements
function cleanElements(element) {
    element.querySelectorAll('[href^="https://www.bing.com/ck/a"]').
        forEach(cleanLink);
}

// Clean the link
function cleanLink(a) {
    const match = a.href.match(/&u=([^&]+)/);
    const encodedUrl = match[1].slice(2);
    if (match && /^[A-Za-z0-9=_-]+$/.test(encodedUrl)) {
        try {
            const decodedUrl = atob(encodedUrl.replace(/_/g, "/").replace(/-/g, "+")); // a1 + Base64 encoded URL
            a.href = decodedUrl;
        } catch (e) {
            console.info('Bing URL Decode Error:', encodedUrl);
        }
    }
}
