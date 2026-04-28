let isPickerActive = false;
let isBulkMode = false;
let hoveredElement = null;

// Inicializar estado
chrome.storage.local.get(['pickerActive', 'bulkMode'], (result) => {
    isPickerActive = result.pickerActive || false;
    isBulkMode = result.bulkMode || false;
});

// Ouvir mensagens do popup
chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'togglePicker') {
        isPickerActive = request.active;
        isBulkMode = request.bulk;
        if (!isPickerActive && hoveredElement) {
            hoveredElement.style.outline = '';
        }
    }
});

// --- Lógica de UI (Highlight) ---

document.addEventListener('mouseover', (e) => {
    if (!isPickerActive) return;
    if (hoveredElement) hoveredElement.style.outline = '';
    
    if (isBulkMode) {
        hoveredElement = findBulkContainer(e.target);
    } 
    
    if (!hoveredElement) hoveredElement = e.target;

    const color = isBulkMode ? '#03a9f4' : '#007AFF';
    hoveredElement.style.outline = `2px solid ${color}`;
    hoveredElement.style.outlineOffset = "-2px";
    hoveredElement.style.cursor = 'crosshair';
});

document.addEventListener('mouseout', (e) => {
    if (!isPickerActive) return;
    if (hoveredElement) {
        hoveredElement.style.outline = '';
        hoveredElement.style.cursor = '';
        hoveredElement = null;
    }
});

// --- Lógica Principal (Click) ---

document.addEventListener('click', (e) => {
    if (!isPickerActive) return;

    e.preventDefault();
    e.stopPropagation();

    if (isBulkMode) {
        const container = findBulkContainer(e.target);
        if (container) {
            captureBulk(container);
            return;
        }
    }
    
    handleSingleClick(e.target);

}, { capture: true });

function findBulkContainer(el) {
    const bulkSelectors = ['p-table', '.p-datatable', 'p-accordion-panel', 'p-dialog', '.card', 'p-card', 'form', 'fieldset'];
    for (const selector of bulkSelectors) {
        const container = el.closest(selector);
        if (container) return container;
    }
    return null;
}

function handleSingleClick(element) {
    const targetElement = element.closest('button, a, input, select, textarea, p-autocomplete, p-dropdown, p-select, p-datepicker, [role="button"], .p-button') || element;
    
    const rowContext = findTableRowContext(targetElement);
    const containerContext = findContext(targetElement);
    
    const locator = generateSemanticLocator(targetElement, containerContext, rowContext);
    const varName = suggestSemanticVarName(targetElement, containerContext, rowContext);

    copyToClipboard(`\${${varName}}    ${locator}`);
    showToast(`Copiado: \${${varName}}`);
}

function findTableRowContext(el) {
    const tr = el.closest('tr');
    if (!tr) return null;

    // Tenta encontrar uma célula que pareça um identificador (não a primeira necessariamente)
    const cells = Array.from(tr.querySelectorAll('td'));
    // Ignora a última (geralmente ações) e a primeira (geralmente status/tipo) se houver mais
    let anchorCell = cells[0];
    if (cells.length > 2) anchorCell = cells[2] || cells[1]; // Prioriza coluna 3 ou 2 (Curso/Instituição)

    const text = anchorCell ? anchorCell.innerText.trim().split('\n')[0] : "";
    return text ? { anchorText: text } : null;
}

function captureBulk(container) {
    const isTable = container.tagName === 'P-TABLE' || container.classList.contains('p-datatable');
    let output = "";
    let count = 0;

    if (isTable) {
        output = captureTableActions(container);
        count = output ? output.trim().split('\n').length : 0;
    } else {
        const context = findContext(container);
        // Filtra para não pegar elementos de paginação no bulk
        const query = 'button:not(.p-paginator-page):not(.p-paginator-next):not(.p-paginator-prev):not(.p-paginator-first):not(.p-paginator-last), a, input, select, textarea, p-autocomplete, p-dropdown, p-select, p-datepicker, [role="button"], .p-button:not(.p-paginator-element)';
        const elements = Array.from(container.querySelectorAll(query));
        const seenLocators = new Set();

        elements.forEach(el => {
            if (el.offsetWidth > 0 || el.offsetHeight > 0) {
                // Evitar capturar containers como elementos clicáveis no bulk
                if (el.classList.contains('p-accordion-header') || el.classList.contains('p-dialog-header')) return;

                const locator = generateSemanticLocator(el, context, null);
                const varName = suggestSemanticVarName(el, context, null);
                if (!seenLocators.has(locator)) {
                    output += `\${${varName}}    ${locator}\n`;
                    seenLocators.add(locator);
                    count++;
                }
            }
        });
    }

    if (count > 0 && output) {
        copyToClipboard(output.trim());
        showToast(`Lote: ${count} variáveis copiadas!`, '#03a9f4');
    }
}

function captureTableActions(table) {
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    let bulkOutput = "";

    rows.forEach((row, index) => {
        const rowCtx = findTableRowContext(row) || { anchorText: `ROW_${index + 1}` };
        
        // Foca nos botões de ação (dentro de divs de ações ou última coluna)
        const actionButtons = row.querySelectorAll('button, .p-button, [role="button"]');
        actionButtons.forEach(btn => {
            if (btn.offsetWidth > 0 || btn.offsetHeight > 0) {
                const locator = generateSemanticLocator(btn, null, rowCtx);
                const varName = suggestSemanticVarName(btn, null, rowCtx);
                bulkOutput += `\${${varName}}    ${locator}\n`;
            }
        });
    });

    return bulkOutput;
}

// --- Funções de Geração ---

function findContext(el) {
    const containers = [
        { selector: 'p-accordion-panel', titleSelector: 'p-accordion-header, .p-accordion-header-text' },
        { selector: 'p-panel', titleSelector: '.p-panel-title, .p-panel-header' },
        { selector: 'p-dialog', titleSelector: '.p-dialog-title' },
        { selector: '.card, p-card', titleSelector: '.card-header, .card-title, .p-card-title' }
    ];

    for (const config of containers) {
        const parent = el.closest(config.selector);
        if (parent) {
            const titleEl = parent.querySelector(config.titleSelector);
            if (titleEl) return { containerTag: config.selector, title: titleEl.innerText.trim() };
        }
    }
    return null;
}

function generateSemanticLocator(el, context, rowContext) {
    const tagName = el.tagName.toLowerCase();
    const component = el.closest('p-select, p-dropdown, p-autocomplete, p-datepicker, p-calendar, p-inputmask') || el;
    const formControl = component.getAttribute('formcontrolname');

    let elPart = "";

    // 1. formcontrolname
    if (formControl) {
        const compTag = component.tagName.toLowerCase();
        if (['p-autocomplete', 'p-datepicker', 'p-calendar', 'p-inputmask'].includes(compTag)) {
            elPart = `css=${compTag}[formcontrolname='${formControl}'] input`;
        } else {
            elPart = `css=${compTag}[formcontrolname='${formControl}']`;
        }
        return elPart; // Retorna direto pois formcontrolname é globalmente estável
    }

    // 2. Tooltip / Icon-button
    const tooltip = el.getAttribute('ptooltip') || el.title;
    if (tooltip && (tagName === 'button' || el.classList.contains('p-button'))) {
        elPart = `//button[@ptooltip='${tooltip}']`;
    }

    // 3. Labels
    if (!elPart && ['input', 'textarea'].includes(tagName)) {
        const labelInfo = findLabelInfo(el);
        if (labelInfo) {
            elPart = `//label[normalize-space()='${labelInfo.text}:']/parent::div/following-sibling::div//${tagName}`;
        }
    }

    // 4. Texto
    if (!elPart) {
        const text = el.innerText.trim().split('\n')[0].slice(0, 30);
        if (text) {
            if (tagName === 'button' || el.closest('button')) {
                elPart = `//button[.//span[contains(text(), '${text}')]]`;
            } else {
                elPart = `//${tagName}[contains(normalize-space(), '${text}')]`;
            }
        } else {
            elPart = `//${tagName}`;
        }
    }

    // Aplicação de Contexto
    if (rowContext) {
        const relPath = elPart.startsWith('//') ? elPart.substring(2) : elPart;
        return `xpath=//tr[.//td[contains(normalize-space(), "${rowContext.anchorText}")]]//${relPath}`;
    }

    if (context) {
        const relPath = elPart.startsWith('//') ? elPart.substring(2) : elPart;
        if (context.containerTag === 'p-accordion-panel') {
            return `xpath=//p-accordion-panel[.//p-accordion-header[contains(normalize-space(), '${context.title}')]]//${relPath}`;
        }
        if (context.containerTag === 'p-dialog') {
            return `xpath=//p-dialog//${relPath}`;
        }
    }

    return elPart.startsWith('css=') ? elPart : `xpath=${elPart}`;
}

function findLabelInfo(el) {
    const parentDiv = el.closest('div');
    if (parentDiv && parentDiv.previousElementSibling) {
        const labelDiv = parentDiv.previousElementSibling;
        const label = labelDiv.querySelector('label');
        if (label) return { text: label.innerText.replace(':', '').trim() };
    }
    return null;
}

function suggestSemanticVarName(el, context, rowContext) {
    const component = el.closest('p-select, p-dropdown, p-autocomplete, p-datepicker, p-calendar, p-inputmask') || el;
    const formControl = component.getAttribute('formcontrolname');
    
    const tagMap = { 
        'button': 'BTN', 'a': 'LINK', 'input': 'INPUT', 'select': 'SELECT', 
        'textarea': 'TEXTAREA', 'p-select': 'SELECT', 'p-dropdown': 'SELECT',
        'p-datepicker': 'INPUT', 'p-calendar': 'INPUT'
    };
    
    const prefix = tagMap[component.tagName.toLowerCase()] || 'VAR';
    
    let baseName = formControl || el.getAttribute('ptooltip') || el.placeholder || el.innerText?.trim() || "ELEMENT";
    baseName = baseName.split('\n')[0].trim().toUpperCase().replace(/[^A-Z0-9]/g, '_');

    const isModal = el.closest('p-dialog, [role="dialog"]');
    const modalPrefix = isModal ? "MODAL_" : "";

    let suffix = "";
    if (rowContext) suffix = `_${rowContext.anchorText.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;
    else if (context) suffix = `_${context.title.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`;

    return `${modalPrefix}${prefix}_${baseName}${suffix}`.replace(/__+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60);
}

// --- Helpers ---

function copyToClipboard(text) {
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
}

function showToast(message, bgColor = '#1d1d1f') {
    const existing = document.getElementById('robot-picker-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'robot-picker-toast';
    toast.innerHTML = `<div style="color: white; font-weight: 600;">${message}</div>`;
    Object.assign(toast.style, {
        position: 'fixed', bottom: '20px', right: '20px', backgroundColor: bgColor,
        color: 'white', padding: '12px 20px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        zIndex: '999999', fontFamily: 'Inter, sans-serif', fontSize: '13px', transition: 'all 0.3s ease'
    });
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}