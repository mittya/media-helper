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
  var _box_home = document.querySelector('body section > main .xw7yly9');

  if (_box_home) {
    findMedia(_box_home);
  }

  setTimeout(function() {
    _box_home = document.querySelector('body section > main .xw7yly9');

    if (_box_home) {
      findMedia(_box_home);
    }
  }, 1000);
}

/*  Detail page */
if (window.location.pathname.match('/p/') || window.location.pathname.match('/tv/')) {
  var _box_detail = '';

  detailBox();

  if (document.querySelector('article[role="presentation"]') == null) {
    setTimeout(function() {
      detailBox();
    }, 1000);
  }
}

/*  Stories page */
if (window.location.pathname.match('/stories/')) {
  setTimeout(function() {
    var _box_story = document.querySelector('section._ac0a > div._ac0b');

    if (_box_story) {
      findMedia(_box_story, 'stories');
    }
  }, 50);
}


function detailBox() {
  /*
    Dialog
  */
  if (document.querySelector('div[role="dialog"]')) {
    if (document.querySelector('div[role="dialog"]').querySelector('article')) {
      _box_detail = document.querySelector('div[role="dialog"]').querySelector('article');
      findMedia(_box_detail);
    } else {
      var _config = { childList: true, subtree: true };
      var _callback = function() {
        _box_detail = document.querySelector('div[role="dialog"]').querySelector('article');
        findMedia(_box_detail);
        _observer.disconnect();
      };
      var _observer = new MutationObserver(_callback);

      _observer.observe(document.querySelector('div[role="dialog"]'), _config);
    }
  }

  /*
    Absolute
  */
  else {
    _box_detail = document.querySelector('div[role="presentation"]');
    findMedia(_box_detail);
  }
}

function findMedia(box, way) {
  var _box = box, _way = way;
  var _parent, _url, _username;

  _box.addEventListener('mouseover', function(event) {

    /*
      Picture

      img class: x5yr21d xu96u03 x10l6tqk x13vifvy x87ps6o xh8yej3
    */
    if (event.target.className === 'x5yr21d xu96u03 x10l6tqk x13vifvy x87ps6o xh8yej3') {

      // disabled on the thumbnail page
      if (event.target.width > 300) {
        _parent = event.target.parentNode;
        _url = event.target.src;
        _username = '';

        articles = _parent.parents('article').concat(_parent.parents('main'));
        if (articles[0].querySelector('.x1lliihq a[role="link"].notranslate')) {
          _username = articles[0].querySelector('.x1lliihq a[role="link"].notranslate').text;
        }
        else if (articles[0].querySelector('._aaqt a[role="link"]')) {
          _username = articles[0].querySelector('._aaqt a[role="link"]').text;
        }

        addBtn(_parent, _url, _username);
      }

    }

    /*
      Video & IG TV

      video class: _ab1d
      video play cover class: _aakl
    */
    if (event.target.className === '_aakl') {

      _parent = event.target.parentNode;
      _url = _parent.querySelector('._ab1d').src;
      _username = '';

      if (_parent.parents('article')[0].querySelector('._aaqt a[role="link"]')) {
        _username = _parent.parents('article')[0].querySelector('._aaqt a[role="link"]').text;
      }

      addBtn(_parent, _url, _username);

    }

    /*
      Stories Picture & Video

      _ac0y parent: cover box (when autoplay videos disable, user click the cover box to play the video)

      Debug: click more button stop auto video
    */
    if (event.target.className === '_ac0y' && _way === 'stories') {

      var _parent = document.querySelector('._ac0y').parents('._ac0b')[0];
      _username = _parent.querySelector('a._ac0s').text;

      // Stories Video: video 'if' in front of the image
      if (_parent.querySelector('video')) {
        _url = _parent.querySelector('video').src;

        addBtn(_parent, _url, _username);

        return false;
      }

      // Stories Picture
      if (_parent.querySelector('img')) {

        _url = _parent.querySelector('img').src;

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
  var _flag = true;

  if (_parent.querySelector('.downloadBtn')) {
    if (_parent.querySelector('.downloadBtn').getAttribute('data-url')) {
      _flag = false;
    } else {
      _parent.removeChild(_parent.querySelector('.downloadBtn'));
    }
  }

  var _btn = document.createElement('button');
  _btn.type = 'button';
  _btn.className = window.location.pathname.match('/stories/') ? 'downloadBtn inStories' : _btn.className = 'downloadBtn';

  // Video & No Button
  if (_url.indexOf('blob') >= 0 && _flag) {
    console.log('Media Helper: Sorry, This version cannot download videos.');
    return false;
  }

  // Has Button
  if (!_flag) {
    _url = _parent.querySelector('.downloadBtn').getAttribute('data-url');
    _url_param = _url.indexOf('?') >= 0 ? _url.substring(0, _url.indexOf('?')) : _url;
    _filename = username + '_' + _url_param.substring(_url_param.lastIndexOf('/') + 1, _url_param.length);
  } else {
    setTimeout(function() {
      _parent.appendChild(_btn);
    }, 100);
  }


  _btn.addEventListener('click', function(event) {
    event.stopPropagation();

    browser.runtime.sendMessage({
      msg: 'DL',
      url: _url,
      filename: _filename
    });
  }, false);
}
