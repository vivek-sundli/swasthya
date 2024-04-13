let activeTimers = {};
let startTime = {};

chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, tab => {
        if (tab.url) {
            const domain = new URL(tab.url).hostname;
            startTimer(domain);
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        const domain = new URL(changeInfo.url).hostname;
        startTimer(domain);
    }
});

chrome.tabs.onRemoved.addListener(tabId => {
    stopTimerForTab(tabId);
});

function startTimer(domain) {
    if (activeTimers[domain]) {
        stopTimer(domain);
    }
    startTime[domain] = Date.now();
    activeTimers[domain] = setInterval(() => {
        if (!websiteTimers[domain]) websiteTimers[domain] = { totalTime: 0 };
        websiteTimers[domain].totalTime += 1000;
    }, 1000);
}

function stopTimer(domain) {
    clearInterval(activeTimers[domain]);
    delete activeTimers[domain];
}

function stopTimerForTab(tabId) {
    chrome.tabs.get(tabId, tab => {
        const domain = new URL(tab.url).hostname;
        stopTimer(domain);
    });
}
