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
  var _parent, _url;

  _box.addEventListener('mouseover', function(event) {
    if (event.target.className === '_icyx7') {
      _parent = event.target.parentNode;
      _url = event.target.src;

      addBtn(_parent, _url);
    }

    if (event.target.className === '_c2kdw') {
      _parent = event.target.parentNode;
      _url = _parent.querySelector('._c8hkj').src;

      addBtn(_parent, _url);
    }
  });
}

function addBtn(parent, url) {
  var _parent = parent;
  var _url = url;

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
      url: url
    });
  }, false);

  _parent.appendChild(_btn);
}
