export const listenForMediaPlay = `
(function() {
  function notifyStatus(status, el) {
    // Replace this with your bridge to native code, e.g., window.Android.onMediaStatus(status)
    console.log('Media status:', status, el);
  }

  function addListeners(el) {
    el.addEventListener('play', function() { notifyStatus('play', el); });
    el.addEventListener('playing', function() { notifyStatus('playing', el); });
    el.addEventListener('pause', function() { notifyStatus('pause', el); });
    el.addEventListener('ended', function() { notifyStatus('ended', el); });
  }

  var mediaElements = document.querySelectorAll('audio, video');
  mediaElements.forEach(addListeners);

  // Listen for dynamically added media elements
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.tagName && (node.tagName.toLowerCase() === 'audio' || node.tagName.toLowerCase() === 'video')) {
          addListeners(node);
        }
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();`;
