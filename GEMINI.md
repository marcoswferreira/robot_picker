# Robot Framework Element Picker Extension

Este projeto é uma extensão para Google Chrome desenhada para agilizar o processo de criação de scripts no **Robot Framework**.

## 🛠️ Funcionalidades

- **Seleção Inteligente (On/Off):** Ative ou desative o modo de captura através do popup para não interferir com a navegação normal.
- **Hover Highlight:** Identifica visualmente o elemento sob o cursor com uma borda azul moderna.
- **Geração de Locators:** Gera automaticamente o melhor seletor (ID, Name, CSS ou XPath) para o elemento.
- **Auto-Format & Sugestão:** Converte o conteúdo no formato `${var_name}    locator    valor`, sugerindo nomes de variáveis baseados em atributos do elemento.
- **Toast Notifications:** Feedback visual imediato via notificações não intrusivas ao copiar.

## 📁 Estrutura de Arquivos

1.  **`manifest.json`**: Configuração V3 com permissões de `storage`.
2.  **`content.js`**: Lógica de captura, geração de locators e UI de feedback (Toast).
3.  **`popup.html` / `popup.js`**: Interface de controlo para ativar/desativar a ferramenta.

## 🚀 Como Utilizar

1. Clone ou descarregue os ficheiros do projeto.
2. Abra `chrome://extensions/` no seu browser.
3. Ative o **Modo de programador**.
4. Clique em **Carregar expandida** e selecione a pasta do projeto.
5. Navegue até à página pretendida, clique num elemento e cole o resultado no seu ficheiro `.robot`.

## 📝 Notas de Implementação

O script atual captura o `innerText` ou `value`. Para automação de UI mais complexa, considere expandir o `content.js` para gerar XPaths únicos para cada elemento clicado.

## 📄 License

This work is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/).