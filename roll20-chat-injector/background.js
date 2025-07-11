chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'sendChatMessage') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: injectChatMessage,
        args: [message.message]
      });
    });
  }
});

function injectChatMessage(msg) {
  const input = document.querySelector('#textchat-input');
  if (!input) {
    console.warn('Roll20 chat input not found!');
    return;
  }

  input.value = msg;

  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    key: 'Enter',
    code: 'Enter',
    keyCode: 13
  });

  input.dispatchEvent(event);
}
