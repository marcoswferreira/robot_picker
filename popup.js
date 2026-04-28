document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('picker-toggle');
    const bulkToggle = document.getElementById('bulk-toggle');
    const statusText = document.getElementById('status-text');
    const bulkStatusText = document.getElementById('bulk-status-text');
    const hintBox = document.getElementById('hint-box');
    const bulkHintBox = document.getElementById('bulk-hint-box');

    // Carregar estado atual
    chrome.storage.local.get(['pickerActive', 'bulkMode'], (result) => {
        toggle.checked = result.pickerActive || false;
        bulkToggle.checked = result.bulkMode || false;
        updateUI(toggle.checked, bulkToggle.checked);
    });

    // Ouvir mudanças nos toggles
    toggle.addEventListener('change', () => saveState());
    bulkToggle.addEventListener('change', () => saveState());

    function saveState() {
        const active = toggle.checked;
        const bulk = bulkToggle.checked;
        chrome.storage.local.set({ pickerActive: active, bulkMode: bulk }, () => {
            updateUI(active, bulk);
            notifyTabs(active, bulk);
        });
    }

    function notifyTabs(active, bulk) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { 
                    action: 'togglePicker', 
                    active: active,
                    bulk: bulk 
                });
            }
        });
    }

    function updateUI(active, bulk) {
        statusText.textContent = active ? 'Ativado' : 'Desativado';
        statusText.style.color = active ? '#34c759' : '#86868b';
        bulkStatusText.textContent = bulk ? 'Ativado' : 'Desativado';
        bulkStatusText.style.color = bulk ? '#03a9f4' : '#86868b';
        
        hintBox.style.display = active && !bulk ? 'block' : 'none';
        bulkHintBox.style.display = bulk ? 'block' : 'none';
    }
});
