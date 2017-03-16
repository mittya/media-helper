// ==UserScript==
// @name               Instagram Helper
// @name:zh-CN         Instagram Helper
// @version            1.5.2
// @namespace          InstagramHelper
// @homepage           https://github.com/mittya/instagram-helper
// @description        Easy to download Instagram pictures and videos.
// @description:zh-cn  方便下载 Instagram 的图片和视频。
// @author             mittya
// @require            https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.3/FileSaver.min.js
// @match              https://www.instagram.com/*
// @match              https://*.cdninstagram.com/*
// @grant              GM_addStyle
// @grant              GM_xmlhttpRequest
// @grant              GM_download
// @license            MIT License
// ==/UserScript==

(function() {
  'use strict';

  GM_addStyle('.downloadBtn{position:absolute;width:56px;height:31px;opacity:0;right:20px;top:20px;z-index:2;text-align:center;font-size:16px;line-height:29px;padding:0 11px;font-weight:600;color:#fff;white-space:nowrap;outline:0;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none;transition:opacity .2s ease-out;transition-delay:.1s;border-radius:3px;border:1px solid #db2d74;background-color:#db2d74;background-size:30px;background-position:center;background-repeat:no-repeat;background-image:url("data:image/png;base64,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")}._jjzlb:hover .downloadBtn,._q3gpi:hover .downloadBtn{opacity:1}._ovg3g{display:none!important}');

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

  var observer = new MutationObserver(init);
  var config = {
    'childList': true,
    'subtree': true
  };
  observer.observe(document.body, config);

  var GM_download_blob = function(src, title) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      var canvas = document.createElement('CANVAS');
      var ctx = canvas.getContext('2d');
      var dataURL;
      canvas.height = this.height;
      canvas.width = this.width;
      ctx.drawImage(this, 0, 0);

      // Save image
      canvas.toBlob(function(blob) {
        saveAs(blob, title);
      }, 'image/jpeg', 0.8);

      canvas = null;
    };

    img.src = src;
    if (img.complete || img.complete === undefined) {
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
      img.src = src;
    }
  };

  /*
      Main
  */
  init();

  function init() {
    if (window.location.pathname === '/') {
      //  Home page
      var _box_home = document.querySelector('._qj7yb');
      if (_box_home) {
        findMedia(_box_home);
      }
    } else if (window.location.pathname.match('/p/')) {
      // Detail page
      var _box_detail = document.querySelector('article._j5hrx');
      findMedia(_box_detail);
    }
  }

  function findMedia(box) {
    var _box = box;
    var _parent, _url, _title, _username;

    _box.addEventListener('mouseover', function(event) {
      event.stopPropagation();

      if (event.target.className === '_icyx7') {
        _parent = event.target.parentNode;
        _url = event.target.src;
        _title = _url.match(/[a-zA-Z0-9_]+.jpg/g);
		_url = _url.replace(/[a-zA-Z][0-9]+x[0-9]+\//, '');
        _username = _parent.parents('article._j5hrx')[0].querySelector('._4zhc5').title;

        addBtn(_parent, _url, _title, _username);
      }

      if (event.target.className === '_c2kdw') {
        _parent = event.target.parentNode;
        _url = _parent.querySelector('._c8hkj').src;
        _title = _url.match(/[a-zA-Z0-9_]+.mp4/g);
		_url = _url.replace(/[a-zA-Z][0-9]+x[0-9]+\//, '');
        _username = _parent.parents('article._j5hrx')[0].querySelector('._4zhc5').title;

        addBtn(_parent, _url, _title, _username);
      }
    });
  }

  function addBtn(parent, url, title, username) {

    if (!parent.querySelector('.downloadBtn')) {
      var _parent = parent;
      var _url = url.replace(/\?ig_cache_key=[a-zA-Z0-9%.]+/, '');
      var _title = title[0];
      var _filename = username + '_' + _url.substring(_url.lastIndexOf('/') + 1, _url.length);
      var _btn = document.createElement('button');
      var _ua = navigator.userAgent.toLowerCase();

      var removeBtn = function() {
        if (_parent.querySelector('.downloadBtn')) {
          _parent.removeChild(_parent.querySelector('.downloadBtn'));
        }
      };

      _btn.className = 'downloadBtn';

      // Download
      _btn.addEventListener('click', function(event) {
        event.stopPropagation();

        if (typeof GM_download !== 'undefined') {
          // Safari
          if (_ua.match(/version\/([\d.]+)/)) {
            window.open(_url);
          } else {
            GM_download(_url, _filename);
          }
        } else {
          // Firefox
          if (_title.indexOf('.mp4') >= 0) {
            window.open(_url);
          } else {
            GM_download_blob(_url, _filename);
          }
        }
      }, false);

      _parent.appendChild(_btn);

      // More media on one box
      if (_parent.querySelector('.coreSpriteRightPaginationArrow') || _parent.parents('article._j5hrx')[0].querySelector('.coreSpriteRightPaginationArrow')) {
        var _btn_right = _parent.querySelector('.coreSpriteRightPaginationArrow') ? _parent.querySelector('.coreSpriteRightPaginationArrow') : _parent.parents('article._j5hrx')[0].querySelector('.coreSpriteRightPaginationArrow');
        _btn_right.addEventListener('click', removeBtn, false);
      }

      if (_parent.querySelector('.coreSpriteLeftPaginationArrow') || _parent.parents('article._j5hrx')[0].querySelector('.coreSpriteLeftPaginationArrow')) {
        var _btn_left = _parent.querySelector('.coreSpriteLeftPaginationArrow') ? _parent.querySelector('.coreSpriteLeftPaginationArrow') : _parent.parents('article._j5hrx')[0].querySelector('.coreSpriteLeftPaginationArrow');
        _btn_left.addEventListener('click', removeBtn, false);
      }
    }

  }

})();
