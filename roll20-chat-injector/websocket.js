const WS_URL = 'ws://localhost:3000';

let ws;

function connect() {
  chrome.storage.sync.get('enabled', ({ enabled }) => {
    console.log('[Roll20 Chat Injector] Content script enabled value:', enabled);
  });
  console.log('[Roll20 Chat Injector] Connecting to WebSocket...');
  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log('[Roll20 Chat Injector] Connected to server');
  };

  ws.onmessage = (event) => {
    console.log('[Roll20 Chat Injector] Received:', event.data);
    try {
      const { message } = JSON.parse(event.data);
      if (message) injectChatMessage("/me выбросил " + message);
    } catch (e) {
      console.error('Error parsing message:', e);
    }
  };


  ws.onerror = (err) => {
    console.error('[Roll20 Chat Injector] WebSocket error:', err);
  };

  ws.onclose = () => {
    ws = null;
    console.warn('[Roll20 Chat Injector] WebSocket closed');
    chrome.storage.sync.get('enabled', ({ enabled }) => {
      if (enabled) {
        console.warn('[Roll20 Chat Injector] Reconnecting in 3 seconds...');
        setTimeout(() => {
          chrome.storage.sync.get('enabled', ({ enabled }) => {

            if (enabled) connect();
          });
        }, 3000);
      }
    });
  };
}

function injectChatMessage(msg) {
  // Find the textarea inside #textchat-input div
  const container = document.querySelector('#textchat-input');
  if (!container) {
    console.warn('Could not find #textchat-input container');
    return;
  }

  // Find the textarea inside container
  const input = container.querySelector('textarea');
  if (!input) {
    console.warn('Could not find textarea inside #textchat-input');
    return;
  }

  console.log('[Roll20 Chat Injector] Injecting message:', msg);

  input.value = msg;
  input.dispatchEvent(new Event('input', { bubbles: true }));

  ['keydown', 'keyup'].forEach(type => {
    input.dispatchEvent(new KeyboardEvent(type, {
      bubbles: true,
      cancelable: true,
      key: 'Enter',
      code: 'Enter',
      keyCode: 13
    }));
  });
}

// Listen for toggle changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.enabled) {
    console.log("[Roll20 Chat Injector] Toggle button debug:", changes.enabled);

    if (changes.enabled.newValue) {
      connect();
    } else {
      if (ws) {
        ws.close();
        ws = null;
        console.log('[Roll20 Chat Injector] WebSocket disconnected');
      }
    }
  }
});

// Initial state on load
chrome.storage.sync.get('enabled', ({ enabled }) => {
  console.log("[Roll20 Chat Injector] Toggle button debug:", enabled);
  if (enabled) connect();
});