export const sendRNEvent = `
(function() {
  globalThis.sendRNEvent = function(eventName, payload) {
    // Check if the event name is valid
    if (typeof eventName !== 'string' || !eventName) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: "InvalidEventName",
        payload: {
          error: 'Event name must be a non-empty string',
          received: typeof eventName,
        },
      }));
      return;
    }

    // Check if the payload is an object
    if (typeof payload !== 'object' || payload === null) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
      type: "InvalidPayload",
      payload: {
        error: 'Payload must be a non-null object',
        received: typeof payload,
        eventName: eventName,
      },
    }));
      return;
    }

    // Send the event to the native side
    window.ReactNativeWebView.postMessage(JSON.stringify({
      type: eventName,
      payload: payload,
    }));
  };
})();
`;
