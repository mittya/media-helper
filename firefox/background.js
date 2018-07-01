chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    if (tab.url.match('^https?://(www\.)?instagram.com*')) {
      chrome.tabs.executeScript(tab.id, { file: 'script.js' });
    }
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if ((request.msg).search('DL') != -1) {
    chrome.downloads.download({
      url: request.url,
      filename: request.filename
    });
  }
});
