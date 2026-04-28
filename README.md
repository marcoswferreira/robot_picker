# Robot Framework Element Picker

A high-productivity Chrome extension designed to rapidly extract UI element variables for Robot Framework. Optimized for complex enterprise applications built with **Angular** and **PrimeNG**.

## 🚀 Features

- **Toggleable Selection Mode:** Enable or disable the element picker at any time via the popup menu.
- **Bulk Capture Mode:** One-click extraction of all interactive elements within containers (Accordions, Dialogs, Tables, Cards).
- **Semantic Locators:** Automatically generates robust XPaths and CSS selectors, prioritizing `formcontrolname`, Labels, and Tooltips over fragile dynamic IDs.
- **Smart Naming Convention:** Automatically suggests variable names in `SNAKE_UPPER_CASE` based on element type, text, and context (e.g., `${BTN_SAVE_DADOS_PESSOAIS}`).
- **Modal Awareness:** Intelligently handles Dialogs, ensuring locators are anchored to the active modal and background elements are ignored.
- **Table/Grid Optimization:** Captures action buttons in table rows, automatically anchoring locators to a unique identifier in the row (e.g., a Name or ID column).
- **Toast Notifications:** Visual feedback directly on the page whenever a variable is copied to the clipboard.

## 🛠 Installation

1. **Clone or Download** this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **"Developer mode"** (toggle in the top-right corner).
4. Click **"Load unpacked"**.
5. Select the folder containing the extension files.

## 📖 How to Use

### Single Element Capture
1. Open the extension popup and turn on **Selection Mode**.
2. Hover over any element on the page (it will be highlighted with a blue border).
3. **Click** the element.
4. The variable line will be copied to your clipboard (e.g., `${INPUT_FIRST_NAME}    css=input[formcontrolname='firstName']`).

### Bulk Capture (Grids, Forms, Accordions)
1. In the popup, enable both **Selection Mode** and **Bulk Mode**.
2. Hover over a container (e.g., a Table or an Accordion header). The entire container will be highlighted in light blue.
3. **Click** the container.
4. All interactive fields inside will be copied as a block of variables to your clipboard.

## 🤖 Naming & Locator Patterns

The extension follows professional Robot Framework best practices:

- **Modals:** `${MODAL_TITLE_FIELD_NAME}` -> `xpath=//div[@role="dialog"]//input[@formcontrolname='...']`
- **Accordions:** `${BTN_ACTION_TITLE}` -> `xpath=//p-accordion-panel[...]//button[...]`
- **Tables:** `${BTN_EDIT_ROW_TEXT}` -> `xpath=//tr[.//td[contains(., 'Text')]]//button[...]`
- **Standard Inputs:** Uses `formcontrolname` (CSS) or Label-to-Input mapping (XPath).

## 📄 License

This work is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/).
