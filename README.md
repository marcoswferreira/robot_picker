# 🤖 Robot Framework Variable Extractor

![Version](https://img.shields.io/badge/version-1.1-blue)
![Platform](https://img.shields.io/badge/platform-Chrome%20|%20Edge-lightgrey)
![License](https://img.shields.io/badge/license-MIT-green)

Uma extensão leve e poderosa para o Google Chrome desenhada para acelerar a criação de scripts de automação no **Robot Framework**. Extraia variáveis, seletores e valores diretamente do browser com um clique.

---

## ✨ Funcionalidades

- **🎯 Modo de Seleção Inteligente:** Ative ou desative a captura pelo popup para navegar normalmente sem interrupções.
- **🔍 Geração de Locators:** Gera automaticamente o melhor seletor disponível (`id`, `name`, `css` ou `xpath`).
- **📝 Formatação Automática:** Copia para o clipboard no formato padrão do Robot: `${var_name}    locator    valor`.
- **💡 Sugestão de Nomes:** Sugere nomes de variáveis baseados no ID, Name ou Placeholder do elemento.
- **⚡ Feedback Visual:** Highlight azul moderno e notificações (Toasts) não intrusivas ao capturar dados.

---

## 🚀 Como Instalar

Siga estes passos simples para começar:

1. **Descarregue o Projeto:** Faça o download ou clone este repositório para a sua máquina local.
2. **Abra as Extensões:** No Chrome, aceda a `chrome://extensions/`.
3. **Ative o Modo de Programador:** No canto superior direito, ligue o interruptor **Modo de programador**.
4. **Carregue a Extensão:** Clique em **Carregar expandida** (Load unpacked) e selecione a pasta onde descarregou os ficheiros.
5. **Fixe a Extensão:** Para acesso rápido, clique no ícone do puzzle no Chrome e fixe o **Robot Picker**.

---

## 🛠️ Como Usar

1. Navegue até à página web onde deseja extrair dados.
2. Clique no ícone da extensão e ative o **Modo de Seleção**.
3. Passe o rato sobre os elementos para ver o destaque azul.
4. **Clique** no elemento desejado.
5. Um balão no canto inferior direito confirmará a captura.
6. **Cole (Ctrl+V)** diretamente no seu ficheiro `.robot`.

### Exemplo de Saída:
```robotframework
${input_username}    id=user-name    standard_user
```

---

## 📁 Estrutura do Projeto

- `manifest.json`: Configurações da extensão (Manifest V3).
- `content.js`: Lógica de interceção, geração de seletores e UI.
- `popup.html/js`: Interface de controlo para ativar/desativar a ferramenta.
- `GEMINI.md`: Notas de desenvolvimento e especificações técnicas.

---

## 📝 Contribuição

Sinta-se à vontade para abrir issues ou enviar pull requests com melhorias, especialmente em algoritmos de geração de XPath ou novos formatos de saída!

---
*Desenvolvido para facilitar a vida de QA Engineers e Automatizadores.*
