window.onload = function() {
  if (navigator.language) {
    if (navigator.language.indexOf('zh') > -1) {
      document.querySelector('.j-donate').innerHTML = '赞赏一下';
    }
  }
};
