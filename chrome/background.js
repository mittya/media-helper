chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    if (tab.url.match('^https?://(www\.)?instagram.com*')) {
      chrome.scripting.executeScript({target: { tabId: tab.id }, files: ['script.js'] });
    }
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if ((request.msg).search('DL') != -1) {

    chrome.downloads.download({
      url: request.url,
      filename: request.filename
    });

    /* fetch(request.url).then(response => response.blob()).then(blob => {
      var _url = window.URL.createObjectURL(blob);

      chrome.downloads.download({
        url: _url,
        filename: request.filename
      });
    }); */

  }
});
