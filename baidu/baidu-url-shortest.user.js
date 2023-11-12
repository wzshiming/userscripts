// ==UserScript==
// @name        Baidu URL Shorten
// @namespace   https://github.com/wzshiming/userscripts
// @version     0.1.2
// @description Mark Baidu URL Shortest.
// @author      wzshiming
// @match       *://*.baidu.com/*
// @grant       none
// @icon        https://www.baidu.com/favicon.ico
// @updateURL   https://github.com/wzshiming/userscripts/raw/master/baidu/baidu-url-shortest.user.js
// @downloadURL https://github.com/wzshiming/userscripts/raw/master/baidu/baidu-url-shortest.user.js
// @supportURL  https://github.com/wzshiming/userscripts/issues
// @license     MIT License
// ==/UserScript==

(function () {
    'use strict';
    sturl();
    window.addEventListener('locationchange', function () {
        sturl();
    })
})();

function sturl() {
    var url = window.location.href;
    var nurl = window.location.href;
    var qs = [
        'rsv_spt', 'rsv_iqid', 'issp', 'f', 'rsv_bp', 'rsv_idx', 'ie', 'tn', 'rsv_enter', 'rsv_dl', 'rsv_sug3', 'rsv_sug1', 'rsv_sug7', 'rsv_sug2', 'rsv_btype', 'inputT', 'rsv_sug4', 'rsv_sug',
        'base_query', 'oq', 'usm', 'rsv_pq', 'rsv_t',
        'prefixsug', 'rsp', 'rqlang',
        'bs',
    ];
    nurl = rmqs(nurl, qs);

    var qseq = [['pn', '0'], ['rn', '50']];
    nurl = rmqseq(nurl, qseq);

    if (url == nurl) {
        return false;
    }

    window.history.replaceState(null, null, nurl);
}

function rmqs(url, qs) {
    url = new URL(url);
    qs.forEach(function (i) {
        url.searchParams.delete(i);
    });
    return url.toString();
}

function rmqseq(url, qseq) {
    url = new URL(url);
    qseq.forEach(function (i) {
        if (url.searchParams.get(i[0]) == i[1]) {
            url.searchParams.delete(i[0]);
        }
    });
    return url.toString();
}

/*----force listen to locationchange work start----*/
history.pushState = (f => function pushState() {
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('pushstate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.pushState);

history.replaceState = (f => function replaceState() {
    var ret = f.apply(this, arguments);
    window.dispatchEvent(new Event('replacestate'));
    window.dispatchEvent(new Event('locationchange'));
    return ret;
})(history.replaceState);

window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('locationchange'))
});
/*----force listen to locationchange work end----*/
