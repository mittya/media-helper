/*
  Common function
*/
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
/*  Home page */
if (window.location.pathname === '/') {
  var _box_home = document.querySelector('#react-root > section > main > section > div > div > div');

  // Logged in
  if (_box_home) {
    findMedia(_box_home);
  }
}

/*  Detail page */
if (window.location.pathname.match('/p/')) {
  var _box_detail = '';

  /*
    Absolute

    box class: QBXjJ
  */
  if (document.querySelector('article.QBXjJ')) {
    _box_detail = document.querySelector('article.QBXjJ');
    findMedia(_box_detail);
  }
  /*
    Dialog
  */
  else {
    setTimeout(function() {
      if (document.querySelector('div[role="dialog"]').querySelector('article')) {
        _box_detail = document.querySelector('div[role="dialog"]').querySelector('article');
        findMedia(_box_detail);
      } else {
        console.error('IG Helper: Not found anything now. I will Fix it.');
      }
    }, 1000); // TODO: first click can't find dialog
  }
}

/*  Stories page */
if (window.location.pathname.match('/stories/')) {
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

    /*
      Picture

      img class: FFVAD
    */
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

    /*
      Video

      video class: tWeCl
      video play button class: QvAa1
    */
    if (event.target.className.indexOf('QvAa1') >= 0) {
      _parent = event.target.parentNode;
      _url = _parent.querySelector('.tWeCl').src;
      _username = '';

      // title class: FPmhX
      if (_parent.parents('article')[0].querySelector('.FPmhX')) {
        _username = _parent.parents('article')[0].querySelector('.FPmhX').title;
      }

      addBtn(_parent, _url, _username);
    }

    /*
      Stories Picture & Video

      _8XqED: #react-root > div > div > section._8XqED
      z6Odz: cover box (when autoplay videos disable, user click the cover box to play the video)

      Debug: click more button stop auto video
    */
    if (event.target.className.indexOf('_8XqED') >= 0 && _way === 'stories') {

      var _current_target = document.querySelector('.z6Odz').previousSibling;
      _parent = _current_target.parentNode.parentNode;

      // Stories Video: video 'if' in front of the image
      if (_parent.querySelector('video')) {
        _url = _parent.querySelector('video > source').src;
        _username = _parent.parents('section')[0].querySelector('.FPmhX').title;

        addBtn(_parent, _url, _username);

        return false;
      }

      // Stories Picture
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
  var _url_param = url.indexOf('?') >= 0 ? url.substring(0, url.indexOf('?')) : url;
  var _filename = username + '_' + _url_param.substring(_url_param.lastIndexOf('/') + 1, _url_param.length);

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

  // Show stories btn
  if (document.querySelector('.z6Odz')) {
    document.querySelector('.z6Odz').addEventListener('mouseover', function(event) {
      event.stopPropagation();

      document.querySelector('.downloadBtn').style.opacity = '1';
    }, false);
  }
}
