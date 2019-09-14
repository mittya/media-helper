// ==UserScript==
// @name               IG Helper: download Instagram pic & vids
// @name:zh-CN         IG Helper: 下载 Instagram 图片和视频
// @version            1.9.8
// @namespace          InstagramHelper
// @homepage           https://github.com/mittya/instagram-helper
// @description        Easily download Instagram pictures and videos.
// @description:zh-cn  轻松下载 Instagram 的图片和视频。
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

  var GM_download_extra = function(url, name) {
    // https://gist.github.com/ccloli/832a8350b822f3ff5094

    if (url == null) return;

    var data = {
      method: 'GET',
      responseType: 'arraybuffer',

      onload: function(res) {
        var blob = new Blob([res.response], {
          type: 'application/octet-stream'
        });
        var url = URL.createObjectURL(blob); // blob url

        var a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', data.name != null ? data.name : 'filename');
        document.documentElement.appendChild(a);

        // call download
        // a.click() or CLICK the download link can't modify filename in Firefox (why?)
        // Solution from FileSaver.js, https://github.com/eligrey/FileSaver.js/
        var e = new MouseEvent('click');
        a.dispatchEvent(e);

        document.documentElement.removeChild(a);

        setTimeout(function() {
          // reduce memory usage
          URL.revokeObjectURL(url);
          if ('close' in blob) blob.close(); // File Blob.close() API, not supported by all the browser right now
          blob = undefined;
        }, 1000);

        if (typeof data.onafterload === 'function') data.onafterload(); // call onload function
      }

      // error object of onerror function is not supported right now
    };

    if (typeof url === 'string') {
      data.url = url;
      data.name = name;
    } else {
      if (url instanceof Object === false) return;

      // as documentation, you can only use [url, name, headers, saveAs, onload, onerror] function, but we won't check them
      // Notice: saveAs is not supported
      if (url.url == null) return;

      for (var i in url) {
        if (i === 'onload') data.onafterload = url.onload; // onload function support
        else data[i] = url[i];
      }
    }

    // it returns this GM_xhr, thought not mentioned in documentation
    return GM_xmlhttpRequest(data);
  };

  var GM_download_extra_img = function(src, title) {
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

  var GM_download_extra_video = function(src, title) {
    window.open(src);

    // TODO
    /* fetch(src).then(function(res) {

      res.blob().then(function(blob) {
        var _link = document.createElement('a');
        _link.download = title;
        _link.style.display = 'none';

        var _blob = new Blob([blob]);
        _link.href = URL.createObjectURL(_blob);

        document.body.appendChild(_link);
        _link.click();
        document.body.removeChild(_link);
      });

    }); */
  };

  var GM_addStyle_extra = function(css) {
    var _head = document.getElementsByTagName('head')[0];
    if (_head) {
      var _style = document.createElement('style');
      _style.setAttribute('type', 'text/css');
      _style.textContent = css;
      _head.appendChild(_style);
      return _style;
    }
    return null;
  };

  var ig_helper_style = '.downloadBtn {' +
    'position:absolute; width:46px; height:28px; opacity:0; right:25px; top:25px; z-index:1; text-align:center;' +
    'font-size:14px; line-height:26px; padding:0 8px; font-weight:600; color:#fff; white-space:nowrap; outline:0;' +
    'cursor:pointer; -webkit-user-select:none; -moz-user-select:none; user-select:none;' +
    'transition:opacity .2s ease-out; transition-delay:.1s; border-radius:3px; border:1px solid #db2d74;' +
    'background-color:#db2d74; background-size:22px; background-position:center; background-repeat:no-repeat;' +
    'background-image:url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWw6c3BhY2U9InByZXNlcnZlIiBzdHlsZT0iZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEuNDE0MjE7Ij48dXNlIGlkPSJpY29uIC8gZG93bmxvYWQiIHhsaW5rOmhyZWY9IiNfSW1hZ2UxIiB4PSIxNC4wMDkiIHk9IjMzIiB3aWR0aD0iMjI3LjQ5MXB4IiBoZWlnaHQ9IjE5MC40OTdweCIvPjxkZWZzPjxpbWFnZSBpZD0iX0ltYWdlMSIgd2lkdGg9IjIyOHB4IiBoZWlnaHQ9IjE5MXB4IiB4bGluazpocmVmPSJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQU9RQUFBQy9DQVlBQUFEdUhuQzVBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBSm8wbEVRVlI0bk8yZDJhN2pLaEFBbStqKy95LzdQaVRPT0Q3ZXNPa05xcVNSUnJPY3hOQkZOeGpqTWsyVFFEZzJPK1ZPWDVWU2R2K3Erb2VCT2dVaDNmbDJnRWRmTElSRjBBQWdwRDJ1QXA2eHlxaElhZ3hDMmpDSnhCVHdEREtvTFFpcFIxb0o5MEJPZlJDeVBWUHZiWXFZZWlCa0c3ckxobGRCenJZZzVETzZ6NFpYUWN3MklPUTloczJJWjN6RVJNcWJJR1E5Wk1VTElPWTlFUEk2aUhnRHhLd0RJYzlCeEljd3Y3d09RdTdEUExFeFpNdHpFSElic3FJaWlMblB5L3NMQkFRWmxmbTBMNDI4QVVMK1l4SmtOQU1wdDZGa2ZZT0lUckRnOHd0Q0ltTUltRmUrR2Ixa1JjWWdVTUsrR1ZsSVpBd0dVbzVic3FhUmNlTk1uSnF5THZUcEJIdU1YTDZPS0dSWUdZMk96MGdoNmFoU2ppWmtPQm1EckRLRzNKVTBvcFFqQ1JsR3hpQVM3aEZLenRHa0hFVklkeG1EUzdoRkdERkhrbklFSVYxbFRDamlGbEVHdE14dGVJbmVoWXdnWTA5QlJIc3EwN09RYnNFelFPRFF0a3IwS3FSTHdQUWVMQnZRem8zcGNhZU9lWkNVVXJvT2tnUEt3Y3Q4NEFZOUNtbktRc1JSSTdOOE1QdkFucmZZOVNha2FYWWNOQ3Z1Z1pRTjZHa09hU1lqSXA1aTJSZGQ5VU0zR1JJWlEySHBTVGNaUmFRZklVMDZCUm1yTUpHeXQ5SzFCeUZOeWlOa3ZBVlNWcEplU0dRTVQyL1RQRld5QzZsdUl6STJRVjNLWHJKa2FpRzFzeU15Tm9WTWVZSE1RcXJhaUl3cXFFclpRNWJNS3FUcVFnNHlxbUloWlZxeUNxa0dNcHFnWGI2bXRUS2prR3JaRVJuN0lIT1d6Q2lrSnNob0IxbHlnMnhDYW1kSHNFVk55cXhaTXBPUWxLcDlvdGJ1bjRDWmY2VWcrdE1lSmllZmNZUE1IY3Z0anlLQkI5OW9RcG9mUFVoMkRJUExTUS96YjAwLytJRC92TC9BQjg1bWdTTEdwZVVpNXFZb3NlQXRwUHQ1bnhDSFVvcmJZc3k4eThkYlRLK1MxVjFFNzRhSFhkeGpROFF2UHF3elpJakcvb0NNc0l0WHhyUVNNcEtJM0hPTWpmbGM4Z2hyTVMzdVE0YVNFZUlUY2NDMGVwSkVXOGh3TWpKM1RFSEkvckdRVXF0a0RTY2k1TUp6eGZVSTdSSldJME9HbFpIc21JclEvYVNWTFZzS09VbGdHU0VmRWVlU1N6U2tiQ1hrTkUxVHlCSmpSZXdlaG5TMGxyS0ZrQ215WXZUUkZqWkowV2t0cGN6MCtCVU1TSmFCdEpXVVQ0Vk1rUjAvNU9oWlNFc0xLWjhJbVViR0xLTXNiSktxODU1S2VWZklOREpDZnJJTnFFK2t2UE8wUjFnWkR6b3VWNC9DbXNPQUN4NlBWYkZYSzJRSUdWZmlJUnNzK2ZmVWNaeFl2UnlqTlVLNnloanh1QVZJZ2ZteE1HdHFwUFErTWVBVXRydkJROTRCOUk2akVCWGVFVmN6cE5jQlJJZ0lHb1NONXl0Q21uNTVTbE13SXVRSmg2ZENXdHBJVnF6aVQwQ3gySFVMNjRUelNFakxBMndKb0d0YzdoUGF0WW9Rc1g2ME1TREVGNFFmcXZxa2h4ZVlHbUp5Z1AxWm43aHVMa2ZHS200TmtFaFpoZnRiSlhhRk5IaWZoZ2d5WHVWUnRZS1VWYWhMZWRTWGUwS3FkaDR5MXRGaWNJeCsveTBZRnBseXMwTTJoZFRzUEdTc3BtVm5ZT1YxVktYY2MyeExTTFZPUTBaSWh2bGJudjhJeVV0UlkwR3A2WTdwVzU3WFF0TDdIWVBjSWZucGxCOGh5WTVEZ0pYMW1HVkpxL3VReUFqWk1ZbmhwWkFxSTZmM2pWYUFWaWpHOHRjOTFReEpxUXFkb1g1Lzhpc2tFMzRBSDVidXpVSTJ0NUhzQ0oyaWxTVW5FVTR1QndpRnBwQmtSK2dWdGRoK2liU2ZQN0t5Q3IzVE9zWm5CMS9DaldLQUtFeGFKU3NwRW5wSEpjWloxQUVJUkhNaG1UL0NLR2pFT2hrU0lCQXZkdWdBeEdDYUpqSWtRQ1EwaEdRU0NhUFFQTmJKa0FDQlFFaUFRQ0FrUUNBUUVpQVFDQWtRQ0lRRUNJU0drT3cwZ0ZGb0h1dGtTSUJBSUNSQUlCQVNJQkF2cmFNSUFIcEg0K2diclF5SmxkQTdLakZPeVFvUUNCVWhLVnVoZDdSaS9DVjZqMHRoSmZTS1ZteVhsd2puNEFCNE16dW9Ob2VrYklWZTBZeHQ3VVVkcklUZVVJM3BXVWlkMS9tOFJ4S2toRjZZRkxOakVWbGtTT2FSQUQ0czNWTy9EMG1XaEU3UXpJNWZsa0tTSWdGOCtMcjNreUcxeWxheUpDUkhMVHV1blRQYk9vZVVrQlNUVW5WbUxhUnEyWXFVa0F3TEdYK2MrNU1odFZkYjJUQUFXZENPMVMzWHRrcFdpOFVkcklUb1dNVG9IOWYrMi94WHBhaU9EblBwK2hraFdOMkZTSmpNR2ZjcTBiMUZuV0t4VVlBNUpRVERVc1pOd2R3ZlVFWktDSUxwYXVvZVIwS2FaRWtScEFSM3pHUThtNlp0emlFOVlGNEpEb1RJaWt2T1NsYXpMRG16eUpheFdncDZZaElIR2E4a216QVpjc25jVUtXVVNjaVcwSlp3V1hISkZTRkxLY1hsSWxabHJBaHl3ajNlZ2VRbzR0V3AyTlVNNlNhbHlFOURJaWRjeFYzQ21acDFrWnFTMVZYS21hV2NJcHMzV0JGMUxINEMwanMrMTlRdVV0Yk9JWXNFVzJ6WjZJRHZINnhrUmRUYy9CdUpnMGwzUWxYY1ZTL3FhRytyYThucWUzSkxKU2Z1VmRsZDd0eWh1TE5UeC94V1NDdW1hWnA3TjJjUGo4WDB3ZnQ3M09MdTRIOTM2MXhhS1VYWUdaU0F0Q0tLM0pkUjVObGUxaDZraEhnTUs2UEk4ODNscWFVVXNpUTBwTVVhUll1ZE9pRnVoOXhobXFZV3U0R09ManoxYUhXQTFqV25qQ09STmpLS3ROczZsMWJLQjF5NTN0NVdkcS9jYk8vdG1rOXBlYjB0bjRkTVdiN2VHRVNxTmlaM3RJQTBmVmFwci94RGtSc1BDR1FjMEZzUFBxMGZVRTRwWlFXWGczTDFuMFJ5UzFsZC9TemFLZk4xSDZKUkNXaWNHRkErS1B6b3ZDUU96dEdtSXFlVVV1Yk0wenpJTlkvdzZFM0t4NEdaVU1vUnIva1E3Zm14OXBrNjVUT2FLSCtNUHEyeVJHOEJlb1VlTXV3aWpsV0QyZUtRcXlLQnhmVDRUa21rOUhxaVBoUXJFZFcvb09XcGMxOHhFOUk4TW9OTHFTRmoxR3ZkeFZMRUdZOWpJRm4wK1JCVXl1RVhjVFFYYmM3d1BKZlZ2WXlOY0FNN21KVGVNcm9PMUZienhDTzhEMHFleTFqemp2QnUrQ1ZCcFBTV2NjWWxGaFlaMFRVbUlwMDZOM2VFK2xrb0VjdmxSdnRxSDN4OENCbS9hRDhJSC9Wc3BraEN6cnhUMTBKT2tYYUNSc3FNYTV5a3RKS3g1cHJtR0dqMjNiSWM1MUtpall3bjNEN1FxTUdJNkhMY2ZPc1BYUTFJN2krWHVVQjF4WlQ1NExPSUdmS0kzMkh1YjhOdjlWcWF6cGd4eXBUaHl0UWRsaFdUU0NkOXZFZTJET21OYVJCcnpLUG13STd5Y2huNHhYdVZOUnVtSzRCYTBqQUl4NFVNZVk4czVaNHJaTWQ2eUpEM1lLZlJDY2g0RDRTOEQxTHVnSXozUWNobklPVUtaSHdHUWo0SEtUOGc0M01Rc2czRFM0bU1iVURJZGd3ckpUSzJBeUhiTXB5VXlOZ1doR3pQTUZJaVkzc1FVb2Z1cFVSR0hSQlNqMjZsUkVZOUVGS1g3cVJFUmwwUVVwOXVwRVJHZlJEU2h2UlNJcU1OQ0dsSFdpbVIwUTZFdENXZGxNaG9DMExhazBaS1pMUUhJWDBJTHlVeStvQ1Fmb1NWRWhuOVFFaGZ3a21Kakw0Z3BEOWhwRVJHZnhBeUJ1NVNJbU1NRURJT2JsSWlZeHdRTWhaRHZ3VU1FRElpWmxJaVl6d1FNaWJxVWlKalRCQXlMbXBTSW1OY0VESTJ6YVZFeHRnZ1pIeWFTWW1NOFVISUhEeVdFaGx6Z0pCNXVDMGxNdVlCSVhOUkxTVXk1b0wzUStaa0V0bC84ZXBDV2tSTXh2OEJ3WXI4Qm1Mcm9RQUFBQUJKUlU1RXJrSmdnZz09Ii8+PC9kZWZzPjwvc3ZnPg==")' +
    '}' +
    '.downloadBtn.inStories {width:28px; top:10px; right:10px; border-radius:50%; font-size:12px; background-size:18px;}' +
    '.KL4Bh:hover .downloadBtn,.OAXCp:hover .downloadBtn, .qbCDp:hover ~ .downloadBtn {opacity:1} ' +
    '._9AhH0 {display:none !important}' +
    '._2us5i:hover .downloadBtn {opacity:1}' +
    '._lz6s {z-index:3 !important}';

  if (typeof GM_addStyle !== 'undefined') {
    GM_addStyle(ig_helper_style);
  } else {
    // Greasemonkey 4.0 remove the GM_addStyle function.
    GM_addStyle_extra(ig_helper_style);
  }


  /*
    Main
  */
  var observer = new MutationObserver(init);
  var config = {
    'childList': true,
    'subtree': true
  };
  observer.observe(document.body, config);

  function init() {

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
          if (document.querySelector('div[role="dialog"]')) {
            if (document.querySelector('div[role="dialog"]').querySelector('article')) {
              _box_detail = document.querySelector('div[role="dialog"]').querySelector('article');
              findMedia(_box_detail);
            }
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

  }

  function findMedia(box, way) {
    var _box = box, _way = way;
    var _parent, _url, _username, _title;

    _box.addEventListener('mouseover', function(event) {
      event.stopPropagation();

      /*
        Picture

        img class: FFVAD
      */
      if (event.target.className === 'FFVAD') {
        _parent = event.target.parentNode;
        _url = event.target.src;
        _title = _url.match(/[a-zA-Z0-9_]+.jpg/g);
        _username = '';

        // title class: FPmhX
        if (_parent.parents('article')[0].querySelector('.FPmhX')) {
          // TODO: 此内容不应在缩略图页面出现，但不明原因出现了。暂时做判断，如果在缩略图页面时不下载图片。同时避免报错。
          _username = _parent.parents('article')[0].querySelector('.FPmhX').title;
          addBtn(_parent, _url, _username, _title);
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
        _title = _url.match(/[a-zA-Z0-9_]+.mp4/g);
        _username = _parent.parents('article')[0].querySelector('.FPmhX').title;

        addBtn(_parent, _url, _username, _title);
      }

      /*
        Stories Picture & Video

        _8XqED: #react-root > div > div > section._8XqED
        z6Odz parent: cover box (when autoplay videos disable, user click the cover box to play the video)

        Debug: click more button stop auto video
      */
      if (event.target.className.indexOf('_8XqED') >= 0 && _way === 'stories') {
        var _current_target = document.querySelector('.z6Odz').parentNode;
        _parent = _current_target.parentNode.parentNode;

        // Stories Video: video 'if' in front of the image
        if (_parent.querySelector('video')) {
          _url = _parent.querySelector('video > source').src;
          _title = _url.match(/[a-zA-Z0-9_]+.mp4/g);
          _username = _parent.parents('section')[0].querySelector('.FPmhX').title;

          addBtn(_parent, _url, _username, _title);

          return false;
        }

        // Stories Picture
        if (_parent.querySelector('img')) {
          _url = _parent.querySelector('img').src;
          _title = _url.match(/[a-zA-Z0-9_]+.jpg/g);
          _username = _parent.parents('section')[0].querySelector('.FPmhX').title;

          addBtn(_parent, _url, _username, _title);

          return false;
        }

      }

    });
  }

  function addBtn(parent, url, username, title) {

    if (!parent.querySelector('.downloadBtn')) {
      var _parent = parent;
      var _url = url;
      var _url_param = _url.indexOf('?') >= 0 ? _url.substring(0, _url.indexOf('?')) : _url;
      _url_param = _url_param.replace(/\?ig_cache_key=[a-zA-Z0-9%.]+/, '');
      var _title = title[0];
      var _filename = username + '_' + _url_param.substring(_url_param.lastIndexOf('/') + 1, _url_param.length);
      var _btn = document.createElement('button');
      var _ua = navigator.userAgent.toLowerCase();

      var removeBtn = function() {
        if (_parent.querySelector('.downloadBtn')) {
          _parent.removeChild(_parent.querySelector('.downloadBtn'));
        }
      };

      if (window.location.pathname.match('/stories/')) {
        _btn.className = 'downloadBtn inStories';
      } else {
        _btn.className = 'downloadBtn';
      }

      // Download
      _btn.addEventListener('click', function(event) {
        event.stopPropagation();

        // Support DM_download
        if (typeof GM_download !== 'undefined') {

          // Safari GM_download unavailable
          if (_ua.match(/version\/([\d.]+)/)) {
            if (_title.indexOf('.mp4') >= 0) {
              GM_download_extra_video(_url, _filename);
            } else {
              GM_download_extra_img(_url, _filename);
            }
          }

          // Other browser
          else {
            // Chrome
            if (_ua.match(/chrome\/\d./g)) {
              GM_download(_url, _filename);
            }

            // Firefox
            else if (_ua.match(/firefox\/\d./g)) {
              GM_download_extra(_url, _filename);
            }
          }

        }

        // Firefox Greasemonkey not support DM_download
        else {
          if (_title.indexOf('.mp4') >= 0) {
            GM_download_extra_video(_url, _filename);
          } else {
            GM_download_extra_img(_url, _filename);
          }
        }

      }, false);

      _parent.appendChild(_btn);

      // Show stories btn
      if (document.querySelector('.z6Odz')) {
        document.querySelector('.z6Odz').addEventListener('mouseover', function(event) {
          event.stopPropagation();

          document.querySelector('.downloadBtn').style.opacity = '1';
        }, false);

        document.querySelector('.GHEPc').addEventListener('mouseleave', function(event) {
          event.stopPropagation();

          document.querySelector('.downloadBtn').style.opacity = '0';
        }, false);
      }

      // More media on one box, ignore stories page
      if (!window.location.pathname.match('/stories/')) {
        var _left_btn = '._2Igxi';
        var _right_btn = '.Zk-Zb';

        if (_parent.querySelector(_right_btn) || _parent.parents('article')[0].querySelector(_right_btn)) {
          var _btn_right = _parent.querySelector(_right_btn) ? _parent.querySelector(_right_btn) : _parent.parents('article')[0].querySelector(_right_btn);
          _btn_right.addEventListener('click', removeBtn, false);
        }

        if (_parent.querySelector(_left_btn) || _parent.parents('article')[0].querySelector(_left_btn)) {
          var _btn_left = _parent.querySelector(_left_btn) ? _parent.querySelector(_left_btn) : _parent.parents('article')[0].querySelector(_left_btn);
          _btn_left.addEventListener('click', removeBtn, false);
        }
      }
    }

  }

})();
