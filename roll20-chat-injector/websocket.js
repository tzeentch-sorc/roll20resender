const WS_URL = 'ws://localhost:3000';

let ws;

function connect() {
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
    console.warn('[Roll20 Chat Injector] WebSocket closed, retrying in 3s...');
    setTimeout(connect, 3000);
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

connect();
