# AERO - Glossário de Domínio (Glossary)

Definições claras da hierarquia e nomenclatura do sistema para garantir consistência entre Design e Engenharia.

---

## 1. Estrutura Hierárquica (Core Hierarchy)

### **1. Workspace** (Espaço de Trabalho)
-   **Definição:** O container raiz de tudo. Geralmente representa uma Empresa ou Organização.
-   **Relação:** 1 Workspace contém N Projetos e N Membros.
-   **Exemplo:** "Acme Corp", "Startup do Lucas".

### **2. Project** (Projeto)
-   **Definição:** Um fluxo de trabalho específico ou produto.
-   **Relação:** 1 Projeto contém N Issues, N Módulos e N Sprints.
-   **Exemplo:** "App iOS", "Website Marketing", "Backend API".

### **3. Module** (Módulo)
-   **Definição:** Um agrupamento lógico ou temático de funcionalidades dentro de um projeto. Ajuda a organizar backlogs gigantes.
-   **Sinônimos:** Epic, Feature Set.
-   **Exemplo:** "Módulo de Autenticação", "Módulo de Pagamentos".

### **4. Sprint** (Ciclo)
-   **Definição:** Um período de tempo (Timebox) focado em entregar um conjunto de issues.
-   **Relação:** Issues são atribuídas a Sprints.
-   **Exemplo:** "Sprint 24 (Dezembro)", "Semana 42".

### **5. Issue** (Tarefa / Item)
-   **Definição:** A unidade atômica de trabalho. Tudo que precisa ser feito.
-   **Atributos Chave:** Identificador (PROJ-12), Status, Assignee e Prioridade.
-   **Exemplo:** "Corrigir bug no login", "Escrever PRD".

---

## 2. Termos de Interface

-   **Board:** Visualização Kanban (colunas) das issues.
-   **Backlog:** Lista de issues que ainda não estão em uma Sprint ativa.
-   **Draft:** Uma issue ou documento que foi criado, mas ainda não "publicado" ou está incompleto.
-   **Sticky:** Nota rápida e efêmera, não é uma issue formal.
-   **Wiki:** A base de conhecimento do projeto. Pode conter documentos aninhados infinitamente.

---

## 3. Conceitos de Automação

-   **Workflow:** O conjunto de estados que uma issue percorre (Backlog -> Todo -> In Progress -> Done).
-   **Rollover:** Ação de mover issues não terminadas de uma Sprint para a próxima automaticamente.
