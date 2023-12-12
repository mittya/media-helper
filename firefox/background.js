browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    if (tab.url.match('^https?://(www\.)?instagram.com*')) {
      browser.scripting.executeScript({target: { tabId: tab.id }, files: ['script.js'] });
    }
  }
});

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if ((request.msg).search('DL') != -1) {

    fetch(request.url).then(response => response.blob()).then(blob => {
      var _url = window.URL.createObjectURL(blob);

      browser.downloads.download({
        url: _url,
        filename: request.filename,
        headers: [
          {
            name: 'Referer',
            value: 'instagram.com'
          }
        ]
      });
    });

  }
});
