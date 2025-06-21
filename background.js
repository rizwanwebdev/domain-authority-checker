// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log("SEO Metrics extension installed");
});

// Cache for storing metrics with timestamps
let metricsCache = {};

// Clear cache periodically (every 12 hours)
setInterval(() => {
  metricsCache = {};
}, 12 * 60 * 60 * 1000);

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "urlChanged" && sender.tab) {
    updateIconBadge(message.url, sender.tab.id);
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getMetrics") {
    getMetrics(request.domain)
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Required for async response
  }
  
  if (request.action === "clearDomainCache") {
    delete metricsCache[request.domain];
    sendResponse({ success: true });
    return true;
  }
});

// Function to get metrics (DA and Spam Score)
async function getMetrics(domain) {
  // Check cache first
  const cached = metricsCache[domain];
  const now = Date.now();
  if (cached && cached.timestamp && (now - cached.timestamp < 24 * 60 * 60 * 1000)) {
    return cached.data;
  }

  try {
    const payload = {
      domains: [domain],
      country: "us",
      version: "11.30",
      num: 1, // Reduced to 1 since we only need DA and Spam Score
      api_key: "your-api-key-here"
    };

    const headers = {
      Accept: "application/x.seometrics.v4+json",
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    };

    const response = await fetch(
      "https://data.keywordseverywhere.com/service/get-domain-link-metrics",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.length > 0) {
      const metrics = {
        moz_domain_authority: data[0].data.moz_domain_authority || null,
        moz_spam_score: data[0].data.moz_spam_score || null
      };
      
      // Cache the results with timestamp
      metricsCache[domain] = { data: metrics, timestamp: now };
      return metrics;
    }
    return null;
  } catch (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }
}

// Update icon badge when tab is updated
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    updateIconBadge(tab.url, tabId);
  }
});

// Update icon badge when tab is activated
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url) {
    updateIconBadge(tab.url, activeInfo.tabId);
  }
});

// Function to update icon badge
async function updateIconBadge(url, tabId) {
  try {
    // Show loading state
    chrome.action.setBadgeText({ text: '...', tabId });

    // const frames = ['.', '..', '...'];
    // let i = 0;
    // setInterval(() => {
    //   chrome.action.setBadgeText({ text: frames[i % frames.length], tabId });
    //   i++;
    // }, 500);
    chrome.action.setBadgeBackgroundColor({ color: '#87c86b', tabId });

    const domain = extractDomain(url);
    const metrics = await getMetrics(domain);
    
    if (metrics && metrics.moz_domain_authority !== undefined && metrics.moz_domain_authority !== null) {
      chrome.action.setBadgeText({ 
        text: metrics.moz_domain_authority.toString(),
        tabId
      });
      chrome.action.setBadgeBackgroundColor({ color: '#87c86b', tabId });
    } else {
      // chrome.action.setIcon({ path: "icons/chnage-icon-32.png", tabId });
      chrome.action.setBadgeText({ text: '!', tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#87c86b', tabId });
    }
  } catch (error) {
    console.error('Error updating badge:', error);
    chrome.action.setBadgeText({ text: '', tabId });
  }
}

// Helper function to extract domain from URL
function extractDomain(url) {
  try {
    let domain = url.replace(/^(https?:\/\/)/i, "");
    domain = domain.replace(/^(w{2,}\d?\.)/i, "");
    return domain.split("/")[0].split("?")[0];
  } catch (e) {
    return url;
  }
}
