if (window.location.pathname === '/') {

  // 首页信息流页

  var _box = document.querySelector('._qj7yb');
  var _parent, _url;

  // 已登录
  if (_box) {
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

} else if (window.location.pathname.match('/p/')) {

  // 详细页

  var _box = document.querySelector('article._j5hrx');
  var _parent, _url;

  if (_box.querySelector('._jjzlb')) {
    _parent = _box.querySelector('._jjzlb');
    _url = _parent.querySelector('._icyx7').src;
  }

  if (_box.querySelector('._q3gpi')) {
    _parent = _box.querySelector('._q3gpi');
    _url = _parent.querySelector('._c8hkj').src;
  }

  addBtn(_parent, _url);

} else {

  // 用户页

}

function addBtn(parent, url) {

  if (!parent.querySelector('.downloadBtn')) {
    var _parent = parent;
    var _url = url;
    var _btn = document.createElement('button');

    _btn.className = 'downloadBtn';

    _btn.addEventListener('click', function(e) {
      e.stopPropagation();

      // 下载
      chrome.runtime.sendMessage({
        msg: 'DL',
        url: _url
      });

    }, false);

    _parent.appendChild(_btn);
  }

}
