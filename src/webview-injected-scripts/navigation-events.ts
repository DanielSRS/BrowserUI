export const listenForNavigationChanges = `
  (function() {
    function sendUrlChange() {
      globalThis.sendRNEvent('navigation', {
        url: location.href,
        title: document.title,
        canGoBack: window.history.length > 1,
      });
    }
    let lastUrl = location.href;
  let lastTitle = document.title;

  // MutationObserver for DOM changes (title, etc)
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl || document.title !== lastTitle) {
      lastUrl = location.href;
      lastTitle = document.title;
      sendUrlChange();
    }
  });

  observer.observe(document, { subtree: true, childList: true });
  })();
`;
