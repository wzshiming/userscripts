// ==UserScript==
// @name        GitHub Releases Download Counter
// @namespace   https://github.com/wzshiming/userscripts
// @version     0.0.1
// @description Displays the number of downloads for GitHub Releases assets
// @author      wzshiming
// @match       *://github.com/*/*/releases
// @match       *://github.com/*/*/releases/tag/*
// @grant       GM_xmlhttpRequest
// @icon        https://github.githubassets.com/pinned-octocat.svg
// @updateURL   https://github.com/wzshiming/userscripts/raw/master/github/github-releases-download-counter.user.js
// @downloadURL https://github.com/wzshiming/userscripts/raw/master/github/github-releases-download-counter.user.js
// @supportURL  https://github.com/wzshiming/userscripts/issues
// @license     MIT License
// ==/UserScript==

(function () {
    'use strict';
    main();
})();

async function fetchAllReleases(owner, repo) {
    const TOKEN = '';
    const API_BASE = 'https://api.github.com/repos';
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${API_BASE}/${owner}/${repo}/releases`,
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                ...(TOKEN && { 'Authorization': `token ${TOKEN}` })
            },
            onload: (res) => {
                if (res.status === 200) {
                    resolve(JSON.parse(res.responseText));
                } else {
                    reject(`API request failed: ${res.status}`);
                }
            },
            onerror: reject
        });
    });
}

async function fetchReleaseByTag(owner, repo, tag) {
    const TOKEN = '';
    const API_BASE = 'https://api.github.com/repos';
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `${API_BASE}/${owner}/${repo}/releases/tags/${tag}`,
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                ...(TOKEN && { 'Authorization': `token ${TOKEN}` })
            },
            onload: (res) => {
                if (res.status === 200) {
                    resolve(JSON.parse(res.responseText));
                } else {
                    reject(`API request failed: ${res.status}`);
                }
            },
            onerror: reject
        });
    });
}

function createDownloadCountBadge(count) {
    const badge = document.createElement('span');
    badge.className = 'color-fg-muted text-right flex-shrink-0 flex-grow-0 ml-3 download-counter-badge';
    badge.textContent = `${count} downloads`;
    return badge;
}

function processAssets(assetsData) {
    document.querySelectorAll('ul>li>div>a').forEach(container => {
        const href = container.href;
        const parent = container.parentNode;
        if (parent.querySelector('.download-counter-badge')) return;

        const asset = assetsData.find(a => a.browser_download_url === href);
        if (asset) {
            parent.appendChild(createDownloadCountBadge(asset.download_count));
        }
    });
}

async function main() {
    const path = window.location.pathname.split('/');
    const [owner, repo] = path.slice(1, 3);
    const isTagPage = path[3] === 'releases' && path[4] === 'tag' && path[5];

    try {
        let assetsData;
        if (isTagPage) {
            const tag = decodeURIComponent(path[5]);
            const release = await fetchReleaseByTag(owner, repo, tag);
            assetsData = release.assets;
        } else {
            const releases = await fetchAllReleases(owner, repo);
            assetsData = releases.flatMap(release => release.assets);
        }

        processAssets(assetsData);
        new MutationObserver(() => processAssets(assetsData))
            .observe(document.body, { subtree: true, childList: true });
    } catch (err) {
        console.error('[GitHub Download Counter]', err);
    }
}