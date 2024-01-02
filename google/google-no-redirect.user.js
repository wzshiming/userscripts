// ==UserScript==
// @name        Google No Redirect
// @namespace   https://github.com/wzshiming/userscripts
// @version     0.1.0
// @description Disable the url redirect of Google search result page.
// @author      wzshiming
// @match       *://*.google.com/*
// @grant       none
// @icon        https://www.google.com/favicon.ico
// @updateURL   https://github.com/wzshiming/userscripts/raw/master/google/google-no-redirect.user.js
// @downloadURL https://github.com/wzshiming/userscripts/raw/master/google/google-no-redirect.user.js
// @supportURL  https://github.com/wzshiming/userscripts/issues
// @license     MIT License
// ==/UserScript==

(function () {
    'use strict'

    disableRedirect()
})()

// Disable the url redirect function
function disableRedirect() {
    Object.defineProperty(window, 'rwt', {
        value: () => { true },
        writable: false, // set the property to read-only
        configurable: false
    })
    document.addEventListener('mouseover', (event) => {
        var a = event.target, depth = 1

        while (a && a.tagName != 'A' && depth-- > 0)
            a = a.parentNode

        if (a && a.tagName == 'A')
            cleanLink(a)
    }, true)
}

// Clean the link
function cleanLink(a) {
    var val = a.getAttribute('onmousedown') || ''

    if (val.indexOf('return rwt(') == -1) {
        return
    }
    a.removeAttribute('onmousedown')
    a.parentNode.replaceChild(a.cloneNode(true), a)
}
