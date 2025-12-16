# AERO - Product Requirements Document (PRD)

## Histórico de Revisões
| Versão | Data       | Autor         | Descrição das Alterações                               |
| :----- | :--------- | :------------ | :----------------------------------------------------- |
| 1.1    | 2025-12-09 | Antigravity   | Expansão completa para guiar Design de UX/UI. Detalhamento de Wiki, Stickies e fluxos. |
| 1.0    | 2025-12-02 | Gemini-2.5-Pro | Criação inicial. |

---

## 1. Introdução e Visão do Produto

**Produto:** AERO  
**Slogan:** "Planeje na velocidade do pensamento."  
**Visão:** O AERO não é apenas mais uma ferramenta de gestão; é um sistema operacional para equipes de software de alta performance. O foco é eliminar o atrito (friction) entre a ideia e a execução. Cada milissegundo conta.

**Diferenciais Competitivos:**
1.  **Keyboard-First:** 99% das ações devem ser realizáveis sem tirar a mão do teclado. (Atalhos globais, Command Menu `Cmd+K`).
2.  **Performance Instantânea:** A interface deve responder em <100ms. Optimistic UI updates em tudo.
3.  **Design Minimalista & Focado:** "Dark mode by default", reduzindo a fadiga visual e destacando o que importa: o trabalho.

---

## 2. Personas e Públicos-Alvo

1.  **O Desenvolvedor (Dev):** Quer saber o que fazer agora. Odeia formulários longos. Ama Markdown e atalhos. Quer ver código e integrações (GitHub/GitLab).
2.  **O Gerente de Produto (PM):** Quer visão macro. Precisa gerenciar Sprints, Roadmaps e escrever especificações/docs (Wiki) ricos. Precisa de Analytics para medir velocidade.
3.  **O Designer:** Precisa anexar arquivos (Figma), colaborar em especificações e visualizar tarefas visualmente (Kanban).

---

## 3. Escopo Funcional (Feature Set)

### 3.1. Núcleo (Core)
- **Workspaces:** O container raiz. Suporte a múltiplos workspaces por usuário.
- **Command K (`Cmd+K`):** O centro de navegação. Permite pular para projetos, issues, páginas ou executar ações (ex: "Criar Issue").

### 3.2. Gerenciamento de Projetos & Issues
- **Projetos:** Containers de trabalho.
  - *Views:* Kanban (Board), Lista, Calendário, Timeline (Gantt - Futuro).
  - *Estados:* Workflow personalizável (Backlog, Todo, In Progress, Done, Canceled).
- **Issues (Tarefas):** Unidade atômica de trabalho.
  - *Propriedades:* Título, Descrição (Rich Text), Prioridade, Estimativa, Assignees, Labels.
  - *Relações:* Bloqueia/Bloqueado por, Parente/Filho.
  - *Identificadores:* IDs únicos curtos (ex: `PROJ-123`).
- **Sprints (Cycles):** Agrupamento temporal de issues (ex: Semanal, Quinzenal).
  - Capacidade de "Rollover" (mover itens incompletos para o próximo ciclo).
- **Módulos:** Agrupamento lógico/temático de issues (ex: "Feature de Autenticação").

### 3.3. Gestão de Conhecimento (Wiki & Docs)
*Status: Implementado com Tiptap. Funcionalidade robusta.*
- **Documentos Aninhados:** Estrutura de árvore para páginas e sub-páginas.
- **Editor Rico (Notion-like):**
  - **Slash Commands (`/`):** Acesso rápido a blocos (H1-H3, Listas, Tabelas, Citações, Divisores, Código).
  - **Bubble Menu:** Menu flutuante context-sensitive na seleção de texto (Negrito, Itálico, Link, Code, Cores).
  - **Embeds:** Suporte a YouTube, Loom, Figma via URL.
  - **Mentions:** Menção de membros (`@user`) e datas.
  - **Mídia:** Upload de imagens e arquivos via drag & drop.
  - **Tabelas:** Edição completa de tabelas (Add/Remove rows/cols).

### 3.4. Produtividade Pessoal
- **Your Work (Meu Trabalho):** Dashboard pessoal filtrando tudo assinado para o usuário logado.
- **Stickies (Notas Rápidas):** Um espaço "scratchpad" para anotações rápidas e temporárias, acessível globalmente.
- **Drafts:** Issues e documentos criados mas não publicados.

### 3.5. Analytics & Insights
- **Overview do Projeto:** Gráficos de velocidade, burn-down e distribuição de tarefas por estado/membro.
- **Eficiência:** Tempo médio para fechar tarefas.

---

## 4. Requisitos de Experiência do Usuário (UX/UI)

### 4.1. Navegação e Arquitetura de Informação
*O Designer deve criar um Sitemap detalhado baseado nisso:*

1.  **Sidebar Lateral (Colapsável):**
    -   *Topo:* Seletor de Workspace, Notificações, Busca, "New Issue".
    -   *Seção Pessoal:* My Issues, Stickies.
    -   *Favoritos:* Projetos ou Páginas "estreladas".
    -   *Seção Projetos:* Lista de projetos recentes ou todos.
2.  **Breadcrumbs:** Essencial para navegação profunda na Wiki e Projetos.

### 4.2. Interações Críticas (Key User Flows)
O Designer deve mapear e wireframing os seguintes fluxos:

1.  **"Criação Rápida" (The Quick Capture Flow):**
    -   Usuário abre o app -> Pressiona `C` -> Modal abre -> Digita título -> `Enter` salva e fecha.
    -   *Desafio UX:* Como adicionar metadados (tags, assignee) sem usar o mouse? (Sugestão: Parsers inteligentes ou inputs tabuláveis).
2.  **"O Estado de Fluxo" (Writing Mode):**
    -   Escrevendo na Wiki -> Digita `/` -> Menu aparece -> Seleciona "Image" -> Cola URL ou upload -> Continua escrevendo. Sem fricção.
3.  **"Triagem Diária":**
    -   Gerente abre o Board -> Arrastar card de "Backlog" para "Sprint Atual" -> Visualizar impacto na carga de trabalho (Analytics instantâneo).

### 4.3. Design System & Visual (Diretrizes para o Designer)
Consultar `DESIGN_SYSTEM.md` para tokens exatos, mas as diretrizes de UX são:
-   **Densidade de Informação:** Alta, mas legível. Evitar espaços em branco excessivos (padding gigante) comum em sites de marketing. Isso é uma ferramenta de trabalho.
-   **Feedback Visual:**
    -   *Hover:* Tudo clicável deve ter hover state sutil.
    -   *Active:* Feedback imediato ao clique.
    -   *Loading:* Skeleton screens preferíveis a spinners gigantes.
-   **Cores Semânticas:** Usar cores (Verde, Vermelho, Amarelo) apenas para *status* e *alertas*. A interface estrutural deve ser monocromática (Tons de Cinza/Slate).

---

## 5. Requisitos Não-Funcionais para Design
-   **Responsividade:** O foco é Desktop/Laptop, mas deve ser funcional em Tablet. Mobile é secundário (apenas visualização/triage rápida).
-   **Acessibilidade (a11y):**
    -   Contraste mínimo AA.
    -   Foco visível (Focus Ring) obrigatório para navegação via teclado.

---

## 6. Próximos Passos para o Design (Entregáveis Esperados)
1.  **User Flows:** Mapear o fluxo de "Onboarding de Novo Membro" e "Criação de Sprint".
2.  **Wireframes:** Validar a densidade de informação do Kanban Board (quantos cards cabem na tela?).
3.  **High-Fidelity:** Prototipar o comportamento do "Bubble Menu" no editor de texto.
