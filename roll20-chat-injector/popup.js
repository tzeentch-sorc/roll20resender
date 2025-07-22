document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggle-ext');
  chrome.storage.sync.get('enabled', ({ enabled }) => {
    toggle.checked = !!enabled;
  });
  toggle.onchange = () => {
    chrome.storage.sync.set({ enabled: toggle.checked }, () => {
      console.log('Popup set enabled:', toggle.checked);
    });
  };
});