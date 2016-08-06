if (window.location.pathname === '/') {

  // 首页信息流页

  var _box = document.querySelector('._qj7yb');
  var _parent, _url, _text;

  _box.addEventListener('mouseover', function(event) {

    if (event.target.className === '_icyx7') {
      _parent = event.target.parentNode;
      _url = event.target.src;
      _text = '图片';

      addBtn(_parent, _url, _text);
    } else if (event.target.className === '_c2kdw') {
      _parent = event.target.parentNode;
      _url = _parent.querySelector('._c8hkj').src;
      _text = '视频';

      addBtn(_parent, _url, _text);
    }

  });

} else if (window.location.pathname.match('/p/')) {

  // 详细页

  var _box = document.querySelector('article._j5hrx');
  var _parent, _url, _text;

  // 图片
  if (_box.querySelector('._jjzlb')) {
    _parent = _box.querySelector('._jjzlb');
    _url = _parent.querySelector('._icyx7').src;
    _text = '图片';
  }

  // 视频
  if (_box.querySelector('._q3gpi')) {
    _parent = _box.querySelector('._q3gpi');
    _url = _parent.querySelector('._c8hkj').src;
    _text = '视频';
  }

  addBtn(_parent, _url, _text);

} else {

  // 用户页

}

function addBtn(parent, url, text) {

  if (!parent.querySelector('.downloadBtn')) {
    var _parent = parent;
    var _url = url;
    var _text = text;
    var _btn = document.createElement('button');

    _btn.className = 'downloadBtn';
    _btn.innerHTML = '下载' + _text;

    _btn.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();

      // 下载
      chrome.runtime.sendMessage({
        msg: 'DL',
        url: _url
      });

    }, false);

    _parent.appendChild(_btn);
  }

}
