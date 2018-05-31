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
  var _box_home = document.querySelector('#react-root > section > main > section > div > div > div');

  // Logged in
  if (_box_home) {
    findMedia(_box_home);
  }
} else if (window.location.pathname.match('/p/')) {
  // Detail page

  var _box_detail = '';

  setTimeout(function() {
    // first click is absolute，second is dialog
    if (document.querySelector('div[role="dialog"]')) {
      // djalog
      _box_detail = document.querySelector('div[role="dialog"]').querySelector('article');
      findMedia(_box_detail);
    } else {
      // absolute
      _box_detail = document.querySelector('#react-root > section > main article');
      findMedia(_box_detail);
    }
  }, 1000); // TODO: 初次点击缩略图不能捕捉 dialog，这里临时用 setTimeout 修复

} else if (window.location.pathname.match('/stories/')) {
  // Stories page

  // TODO: remove setTimeout
  setTimeout(function() {
    var _box_story = document.querySelector('#react-root > section div.yS4wN');

    if (_box_story) {
      findMedia(_box_story, 'stories');
    }
  }, 50);

}


function findMedia(box, way) {
  var _box = box, _way = way;
  var _parent, _url, _username;

  _box.addEventListener('mouseover', function(event) {

    // img class: FFVAD
    if (event.target.className === 'FFVAD') {

      // disabled on the thumbnail page
      if (event.target.width > 300) {
        _parent = event.target.parentNode;
        _url = event.target.src;
        _username = '';

        // title class: FPmhX
        if (_parent.parents('article')[0].querySelector('.FPmhX')) {
          _username = _parent.parents('article')[0].querySelector('.FPmhX').title;
        }

        addBtn(_parent, _url, _username);
      }

    }

    // video parents class: OAXCp
    // video class: tWeCl
    if (event.target.className === 'QvAa1') {
      _parent = event.target.parentNode;
      _url = _parent.querySelector('.tWeCl').src;
      _username = '';

      // title class: FPmhX
      if (_parent.parents('article')[0].querySelector('.FPmhX')) {
        _username = _parent.parents('article')[0].querySelector('.FPmhX').title;
      }

      addBtn(_parent, _url, _username);
    }

    // Stories Video & Picture
    // #react-root > div > div > section._8XqED
    // z6Odz: cover box (when autoplay videos disabled, user click the cover box to play the video)
    // Debug Stories: click more button stop auto video
    if (_way === 'stories' && event.target.className.indexOf('_8XqED') >= 0) {
      var _current_target = document.querySelector('.z6Odz').previousSibling;
      _parent = _current_target.parentNode;

      if (_parent.querySelector('video')) {
        _url = _parent.querySelector('video > source').src;
        _username = _parent.parents('section')[0].querySelector('.FPmhX').title;

        addBtn(_parent, _url, _username);

        return false;
      }

      if (_parent.querySelector('img')) {
        _url = _parent.querySelector('img').src;
        _username = _parent.parents('section')[0].querySelector('.FPmhX').title;

        addBtn(_parent, _url, _username);

        return false;
      }

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
  _btn.type = 'button';

  if (window.location.pathname.match('/stories/')) {
    _btn.className = 'downloadBtn inStories';
  } else {
    _btn.className = 'downloadBtn';
  }

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
