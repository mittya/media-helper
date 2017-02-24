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
  var _box = document.querySelector('._qj7yb');

  // Logged in
  if (_box) {
    findMedia(_box);
  }
} else if (window.location.pathname.match('/p/')) {
  // Detail page
  var _box = document.querySelector('article._j5hrx');

  findMedia(_box);
}


function findMedia(box) {
  var _box = box;
  var _parent, _url, _filename;

  _box.addEventListener('mouseover', function(event) {
    if (event.target.className === '_icyx7') {
      _parent = event.target.parentNode;
      _url = event.target.src;
      _filename = _parent.parents('article._j5hrx')[0].querySelector('._4zhc5').title;

      addBtn(_parent, _url, _filename);
    }

    if (event.target.className === '_c2kdw') {
      _parent = event.target.parentNode;
      _url = _parent.querySelector('._c8hkj').src;
      _filename = _parent.parents('article._j5hrx')[0].querySelector('._4zhc5').title;

      addBtn(_parent, _url, _filename);
    }
  });
}

function addBtn(parent, url, filename) {
  var _parent = parent;
  var _url = url;
  var _filename = filename;
  _filename = _filename + '_' + _url.substring(_url.lastIndexOf('/') + 1, _url.length);

  if (_parent.querySelector('.downloadBtn')) {
    _parent.removeChild(_parent.querySelector('.downloadBtn'));
  }

  var _btn = document.createElement('button');
  _btn.className = 'downloadBtn';

  _btn.addEventListener('click', function(e) {
    e.stopPropagation();

    // Download
    chrome.runtime.sendMessage({
      msg: 'DL',
      url: url,
      filename: _filename
    });
  }, false);

  _parent.appendChild(_btn);
}
