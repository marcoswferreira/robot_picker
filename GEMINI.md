# Robot Framework Element Picker - Project Status

Este documento descreve a evolução técnica e o estado atual da extensão **Robot Framework Element Picker**, focada em alta produtividade para automação de sistemas complexos (UNIVWEB / PrimeNG).

## 🚀 Estado Atual das Funcionalidades

### 1. Modos de Operação
- **Modo Individual:** Captura um único elemento com clique, gerando a variável Robot instantaneamente.
- **Modo Lote (Bulk Mode):** Captura todos os elementos interativos de um container (Tabelas, Accordions, Diálogos) com um único clique.

### 2. Inteligência de Localização (Locators)
- **Prioridade Máxima:** Atributos estáveis como `id` e `formcontrolname`.
- **Seletores CSS Dinâmicos:** Gera seletores do tipo `css=p-dialog p-inputmask[formcontrolname='...'] input` para máxima estabilidade em Angular.
- **XPaths Semânticos:** Quando IDs não existem, utiliza ancoragem por labels visuais, tooltips ou contexto de linha (ex: `xpath=//tr[.//td[contains(., 'DIREITO')]]//button`).
- **Isolamento de Modais:** Bloqueia interações com elementos de fundo quando um diálogo está aberto.

### 3. Convenção de Nomenclatura (Variables)
Segue o padrão: `PREFIXO_CONTAINER_NOME`
- **PREFIXO:** `INPUT`, `BTN`, `SELECT`, `LINK` ou `MODAL` (para diálogos).
- **CONTAINER:** Nome do Accordion, Título do Modal ou Identificador da Linha da Tabela.
- **NOME:** Nome do campo ou valor do tooltip.
- *Exemplo:* `${MODAL_DEPENDENTES_CPF}` ou `${INPUT_ENDERECO_CEP}`.

### 4. Suporte a Frameworks
- **PrimeNG/Angular:** Otimizado para componentes `p-select`, `p-datepicker`, `p-autocomplete`, `p-table`, `p-accordion`, etc.
- **Exclusão de Ruído:** Ignora automaticamente elementos de paginação e ícones decorativos durante a captura em lote.

## 🛠 Arquitetura de Arquivos
- `content.js`: Motor principal de detecção, geração de locators e lógica de contextos.
- `popup.html/js`: Interface de controle para alternar modos (Seleção/Lote).
- `manifest.json`: Configuração Manifest V3 com permissões de storage.
- `README.md`: Guia de uso em Inglês.
- `LICENSE`: Licença CC BY-NC-SA 4.0 (Uso não comercial).

## 📄 Notas de Versão
A extensão agora está pronta para uso profissional em larga escala, permitindo mapear telas inteiras do UNIVWEB em segundos com seletores prontos para uso no Robot Framework sem necessidade de refatoração manual.

---
*Atualizado em: 28 de Abril de 2026*