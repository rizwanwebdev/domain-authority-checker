document.addEventListener("DOMContentLoaded", async () => {
  const currentDomainEl = document.getElementById("current-domain");
  const metricsGridEl = document.getElementById("metrics-grid");
  const refreshBtn = document.getElementById("refresh");

  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab && tab.url) {
    const domain = extractDomain(tab.url);
    currentDomainEl.textContent = domain;
    loadMetrics(domain);
  }

  // Refresh button
  refreshBtn.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (tab && tab.url) {
      const domain = extractDomain(tab.url);
      // Ask background to clear cache for this domain
      await new Promise(resolve => {
        chrome.runtime.sendMessage({ action: "clearDomainCache", domain }, resolve);
      });
      loadMetrics(domain);
    }
  });

  async function loadMetrics(domain) {
    try {
      metricsGridEl.innerHTML = '<div class="loading">Fetching metrics...</div>';
      chrome.runtime.sendMessage({ action: "getMetrics", domain }, (response) => {
        if (response && response.success && response.data) {
          displayMetrics(response.data);
        } else {
          metricsGridEl.innerHTML = '<div class="loading">Vist a valid domain URL</div>';
        }
      });
    } catch (error) {
      metricsGridEl.innerHTML = '<div class="loading">Error loading metrics</div>';
    }
  }

  function displayMetrics(data) {
    const da = data.moz_domain_authority;
    const spam = data.moz_spam_score;
    metricsGridEl.innerHTML = `
      <div class="metric-card">
        <div class="metric-label">Domain Authority</div>
        <div class="metric-value ${getDAClass(da)}">${da !== null && da !== undefined ? da : "NaN"}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Spam Score</div>
        <div class="metric-value ${getSpamClass(spam)}">${spam !== null && spam !== undefined ? spam : "NaN"}</div>
      </div>
    `;
  }

  function getDAClass(da) {
    if (da === null || da === undefined) return "good";
    if (da >= 50) return "good";
    if (da >= 0) return "good";
    return "bad";
  }

  function getSpamClass(spam) {
    if (spam === null || spam === undefined) return "good";
    if (spam <= 10) return "good";
    if (spam <= 20) return "warning";
    return "bad";
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
});
