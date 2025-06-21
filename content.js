// Content script for URL change detection
let isBarVisible = false;

// Immediately notify background script of current URL when content script loads
chrome.runtime.sendMessage({ action: "urlChanged", url: location.href });

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleBar") {
    toggleSeoBar();
    sendResponse({ success: true });
  } else if (request.action === "getMetrics") {
    getCurrentDomainMetrics().then(sendResponse);
    return true; // Keep message channel open for async response
  }
});

function toggleSeoBar() {
  if (isBarVisible) {
    hideSeoBar();
  } else {
    showSeoBar();
  }
}

async function showSeoBar() {
  // Placeholder for future implementation
  isBarVisible = true;
}

function hideSeoBar() {
  isBarVisible = false;
}

function extractDomain(url) {
  try {
    let domain = url.replace(/^(https?:\/\/)/i, "");
    domain = domain.replace(/^(w{2,}\d?\.)/i, "");
    return domain.split("/")[0].split("?")[0];
  } catch (e) {
    return url;
  }
}

async function getCurrentDomainMetrics() {
  const domain = extractDomain(window.location.href);
  const result = await chrome.storage.local.get(domain);
  return {
    domain: domain,
    metrics: result[domain] || null,
  };
}

// URL change detection for SPAs
let lastUrl = location.href;
new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    chrome.runtime.sendMessage({ action: "urlChanged", url: currentUrl });
  }
}).observe(document, { subtree: true, childList: true });
