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
  var _box_home = document.querySelector('#react-root > section > main > section');

  // Logged in
  if (_box_home) {
    findMedia(_box_home);
  } else {
    setTimeout(function() {
      _box_home = document.querySelector('#react-root > section > main > section');
      findMedia(_box_home);
    }, 1000);
  }
}

/*  Detail page */
if (window.location.pathname.match('/p/') || window.location.pathname.match('/tv/')) {
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

  }
}

/*  Stories page */
if (window.location.pathname.match('/stories/')) {
  setTimeout(function() {
    var _box_story = document.querySelector('#react-root > section div.Cd8X1');

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

        // title class: sqdOP
        if (_parent.parents('article')[0].querySelector('.sqdOP')) {
          _username = _parent.parents('article')[0].querySelector('.sqdOP').text;
        }

        addBtn(_parent, _url, _username);
      }

    }

    /*
      Video

      video class: tWeCl / Q9bIO
      video play button class: fXIG0
    */
    if (event.target.className.indexOf('fXIG0') >= 0) {
      _parent = event.target.parentNode;
      _url = _parent.querySelector('.Q9bIO') ? _parent.querySelector('.Q9bIO').src
                                             : _parent.querySelector('.tWeCl').src;
      _username = '';

      // title class: sqdOP
      if (_parent.parents('article')[0].querySelector('.sqdOP')) {
        _username = _parent.parents('article')[0].querySelector('.sqdOP').text;
      }

      addBtn(_parent, _url, _username);
    }

    /*
      IG TV
    */
    if (event.target.className.indexOf('tWeCl') >= 0 || event.target.className.indexOf('Q9bIO') >= 0) {
      _parent = event.target.parentNode;
      _url = _parent.querySelector('.Q9bIO') ? _parent.querySelector('.Q9bIO').src
                                             : _parent.querySelector('.tWeCl').src;
      _username = '';

      // title class: sqdOP
      if (_parent.parents('article')[0].querySelector('.sqdOP')) {
        _username = _parent.parents('article')[0].querySelector('.sqdOP').text;
      }

      addBtn(_parent, _url, _username);
    }

    /*
      Stories Picture & Video

      szopg: #react-root > div > div > section.szopg
      B20bj parent: cover box (when autoplay videos disable, user click the cover box to play the video)

      Debug: click more button stop auto video
    */
    if (event.target.className.indexOf('B20bj') >= 0 && _way === 'stories') {

      var _current_target = document.querySelector('.B20bj').parentNode;
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
        var _tmp = _parent.querySelector('img').srcset.split(',')[0];
        _tmp.substring(0, _tmp.indexOf(' '));
        _url = _tmp.substring(0, _tmp.indexOf(' '));
        _username = _parent.parents('section')[0].querySelector('.FPmhX').title;

        addBtn(_parent, _url, _username);

        return false;
      }

    }

  });
}

function addBtn(parent, url, username) {
  /* Bad Code */

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
    getBlobVideo(_parent, function(oUrl) {
      _url = oUrl;

      _url_param = _url.indexOf('?') >= 0 ? _url.substring(0, _url.indexOf('?')) : _url;
      _filename = username + '_' + _url_param.substring(_url_param.lastIndexOf('/') + 1, _url_param.length);

      _btn.setAttribute('data-url', _url);

      _parent.appendChild(_btn);
    });
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

    // Download
    chrome.runtime.sendMessage({
      msg: 'DL',
      url: _url,
      filename: _filename
    });
  }, false);
}


function getBlobVideo(nodeParent, callback) {
  var _parent = nodeParent;
  var _poster = _parent.querySelector('video').getAttribute('poster').match(/\/([^\/?]*)\?/)[1];
  var _wrap = nodeParent.parents('article')[0];
  var _times = _wrap.querySelectorAll('time');
  var _url = _times[_times.length - 1].parentNode.href;
  var regx = new RegExp(`${_poster}.*?video_url":("[^"]*")`, 's');

  fetch(_url).then(response => response.text()).then(restext => {
    _url = restext.match(regx)[1].replace(/\\u0026/g, '&');
    _url = _url.substring(1, _url.length - 1);

    callback(_url);
  });
}
