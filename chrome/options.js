function save_options() {
  var isHide = document.getElementById('AlwaysHide').checked;

  chrome.storage.sync.set({
    isHide: isHide
  }, function() {
    var status = document.getElementById('Status');
    status.textContent = 'Saved';

    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  chrome.storage.sync.get({
    isHide: false
  }, function(items) {
    document.getElementById('AlwaysHide').checked = items.isHide;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('AlwaysHide').addEventListener('click', save_options);
