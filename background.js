let activeTabId = null;
let websiteTimers = {};

// Listen for tab changes
chrome.tabs.onActivated.addListener(activeInfo => {
    if (activeTabId !== null) {
        updateTimer(activeTabId, false); // Stop timer for previous tab
    }
    activeTabId = activeInfo.tabId;
    updateTimer(activeTabId, true); // Start timer for new active tab
});

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener(windowId => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        updateTimer(activeTabId, false); // Stop timer if Chrome loses focus
    } else {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
            if (tabs.length > 0) {
                activeTabId = tabs[0].id;
                updateTimer(activeTabId, true); // Start timer if Chrome regains focus
            }
        });
    }
});
chrome.tabs.onRemoved.addListener(tabId => {
    if (activeTabId === tabId) {
        updateTimer(tabId, false); // Stop timer for the closed tab
        activeTabId = null;
    }
});
// Function to start or stop timer based on tab status
function updateTimer(tabId, isActive) {
    if (tabId === null) {
        return; // Exit if tabId is null
    }
    chrome.tabs.get(tabId, tab => {
        if (chrome.runtime.lastError || !tab || !tab.url) {
            console.log(chrome.runtime.lastError || "Tab not accessible.");
            return;
        }

        const domain = new URL(tab.url).hostname;
        if (isActive) {
            if (!websiteTimers[domain]) {
                websiteTimers[domain] = { totalTime: 0, startTime: Date.now() };
            } else if (!websiteTimers[domain].startTime) {
                websiteTimers[domain].startTime = Date.now();
            }
        } else if (websiteTimers[domain] && websiteTimers[domain].startTime) {
            const endTime = Date.now();
            const elapsed = endTime - websiteTimers[domain].startTime;
            websiteTimers[domain].totalTime += elapsed;
            delete websiteTimers[domain].startTime; // Stop timing
        }
    });
}

// Respond to popup requests for data
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received', request);
    if (request.cmd === "getTimeData") {
        sendResponse({ data: websiteTimers });
    }
    return true;
});
console.log(websiteTimers);
function stopTimerForTab(tabId) {
    if (!websiteTimers || !tabId) {
        return; // Exit if there are no timers or tabId is not valid
    }

    chrome.tabs.get(tabId, function(tab) {
        if (chrome.runtime.lastError || !tab || !tab.url) {
            // Tab doesn't exist, so just clear the timer
            Object.keys(websiteTimers).forEach(domain => {
                clearInterval(websiteTimers[domain].intervalId);
            });
            return;
        }
        // Rest of the logic to stop the timer...
    });
}