Element.prototype.parents = function(selector) {
  // Vanilla JS jQuery.parents() realisation
  // https://gist.github.com/ziggi/2f15832b57398649ee9b

  var elements = [];
  var elem = this;
  var ishaveselector = selector !== undefined;

  while ((elem = elem.parentElement) !== null) {
    if (elem.nodeType !== Node.ELEMENT_NODE) {
      continue;
    }

    if (!ishaveselector || elem.matches(selector)) {
      elements.push(elem);
    }
  }

  return elements;
};


/*
  Main
*/
if (window.location.pathname === '/') {
  //  Home page
  var _box = document.querySelector('#react-root > section > main > section > div > div > div');

  // Logged in
  if (_box) {
    findMedia(_box);
  }
} else if (window.location.pathname.match('/p/')) {
  // Detail page

  // TODO: 内页有时获取不到 djalog
  setTimeout(function() {
    var _box = '';

    if (document.querySelector('div[role="dialog"]')) {
      // djalog
      _box = document.querySelector('div[role="dialog"]').querySelector('article');
    } else {
      // absolute
      _box = document.querySelector('#react-root > section > main article');
    }

    findMedia(_box);
  }, 1000);

}


function findMedia(box) {
  var _box = box;
  var _parent, _url, _username;

  _box.addEventListener('mouseover', function(event) {

    // img class: _2di5p
    if (event.target.className === '_2di5p') {

      if (event.target.width < 300) {
        // thumb
        return;
      }

      _parent = event.target.parentNode;
      _url = event.target.src;
      _url = _url.replace(/[a-zA-Z][0-9]+x[0-9]+\//, '');
      _username = '';
      if (_parent.parents('article')[0].querySelector('._2g7d5')) {
        _username = _parent.parents('article')[0].querySelector('._2g7d5').title;
      }

      addBtn(_parent, _url, _username);
    }

    // video parents class: _7thjo
    // video class: _l6uaz
    if (event.target.className === '_7thjo') {
      _parent = event.target.parentNode;
      _url = _parent.querySelector('._l6uaz').src;
      _url = _url.replace(/[a-zA-Z][0-9]+x[0-9]+\//, '');
      _username = '';
      if (_parent.parents('article')[0].querySelector('._2g7d5')) {
        _username = _parent.parents('article')[0].querySelector('._2g7d5').title;
      }

      addBtn(_parent, _url, _username);
    }
  });
}

function addBtn(parent, url, username) {
  var _parent = parent;
  var _url = url;
  var _filename = username + '_' + _url.substring(_url.lastIndexOf('/') + 1, _url.length);

  if (_parent.querySelector('.downloadBtn')) {
    _parent.removeChild(_parent.querySelector('.downloadBtn'));
  }

  var _btn = document.createElement('button');
  _btn.className = 'downloadBtn';

  _btn.addEventListener('click', function(event) {
    event.stopPropagation();

    // Download
    chrome.runtime.sendMessage({
      msg: 'DL',
      url: _url,
      filename: _filename
    });
  }, false);

  _parent.appendChild(_btn);
}
