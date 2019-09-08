function save_options() {
  var isHide = document.getElementById('AlwaysHide').checked;

  browser.storage.sync.set({
    isHide: isHide
  }).then(function() {
    var status = document.getElementById('Status');
    status.textContent = 'Saved';

    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  browser.storage.sync.get('isHide').then(function(items) {
    document.getElementById('AlwaysHide').checked = items.isHide;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('AlwaysHide').addEventListener('click', save_options);
