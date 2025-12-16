# MAPA FUNCIONAL COMPLETO - PLANE.SO REPLICA

## 1. AUTENTICAÇÃO E ONBOARDING

### 1.1 SIGN UP (Cadastro)
**URL:** `/signup` ou `/join`

**Elementos da Página:**
- Header com logo Plane.so
- Título: "Create your account"
- Subtítulo: "Start organizing your work in minutes"
- Formulário de cadastro:
  - Campo: Full Name (placeholder: "Enter your full name")
  - Campo: Email (placeholder: "Enter your email address") 
  - Campo: Password (placeholder: "Create a strong password", com toggle de visibilidade)
  - Campo: Confirm Password (placeholder: "Confirm your password")
- Checkbox: "I agree to the Terms of Service and Privacy Policy"
- Botão: "Create account" (estado: loading quando clicado)
- Link: "Already have an account? Sign in"

**Fluxo de Interação:**
1. Usuário preenche nome completo
2. Usuário preenche email (validação em tempo real: formato de email)
3. Usuário cria senha (validação: mínimo 8 caracteres, 1 letra maiúscula, 1 número)
4. Usuário confirma senha (validação: senhas coincidem)
5. Usuário marca checkbox de termos
6. Botão "Create account" fica habilitado
7. **Clique no botão "Create account"**
8. Loading spinner aparece no botão
9. Redirecionamento para página de verificação de email

### 1.2 EMAIL VERIFICATION
**URL:** `/verify-email`

**Elementos:**
- Ícone de envelope animado
- Título: "Check your email"
- Mensagem: "We've sent a verification link to [user@email.com]"
- Botão: "Resend verification email" (com countdown de 60 segundos)
- Link: "Change email address"
- Link: "Back to sign in"

**Fluxo:**
1. Usuário abre email recebido
2. **Clique no link de verificação no email**
3. Redirecionamento automático para `/setup-workspace`

### 1.3 SIGN IN (Login)
**URL:** `/signin` ou `/login`

**Elementos:**
- Header com logo
- Título: "Welcome back"
- Formulário:
  - Campo: Email (placeholder: "Enter your email")
  - Campo: Password (placeholder: "Enter your password", com toggle)
  - Checkbox: "Remember me"
  - Link: "Forgot your password?"
- Botão: "Sign in"
- Link: "Don't have an account? Sign up"

**Opções de Login Social:**
- Botão: "Continue with Google"
- Botão: "Continue with GitHub"
- Botão: "Continue with Slack"

**Fluxo:**
1. Usuário preenne email
2. Usuário preenche senha
3. **Clique em "Sign in"**
4. Validação no backend
5. Redirecionamento para dashboard ou workspace anterior

### 1.4 FORGOT PASSWORD
**URL:** `/forgot-password`

**Elementos:**
- Título: "Reset your password"
- Subtítulo: "Enter your email address and we'll send you a link to reset your password"
- Campo: Email
- Botão: "Send reset link"
- Link: "Back to sign in"

**Fluxo:**
1. Usuário insere email
2. **Clique em "Send reset link"**
3. Mensagem de sucesso: "Check your email for reset instructions"
4. Email enviado com link de reset

### 1.5 WORKSPACE SETUP (Onboarding)
**URL:** `/setup-workspace`

**Passo 1: Informações do Workspace**
- Título: "Let's set up your workspace"
- Campo: Workspace name (placeholder: "Acme Corp")
- Campo: Workspace URL (placeholder: "acme-corp", com sufixo `.plane.so`)
- Botão: "Continue"

**Passo 2: Convidar Membros (Opcional)**
- Título: "Invite your team"
- Campo: Email addresses (separados por vírgula)
- Textarea: Personal message (opcional)
- Botão: "Skip for now"
- Botão: "Send invitations"

**Passo 3: Criar Primeiro Projeto**
- Título: "Create your first project"
- Campo: Project name
- Campo: Project description (opcional)
- Select: Project template (Blank, Software Development, Marketing, Design, etc.)
- Botão: "Create project"

**Fluxo Completo:**
1. **Clique em "Continue"** no passo 1
2. Validação do nome e URL
3. **Clique em "Continue"** ou "Skip for now" no passo 2
4. **Clique em "Create project"** no passo 3
5. Loading animation
6. Redirecionamento para `/projects/[project-id]`

## 2. DASHBOARD PRINCIPAL

### 2.1 LAYOUT GERAL
**URL:** `/` ou `/dashboard`

**Header Superior:**
- Logo Plane.so (clicável → dashboard)
- Search bar global (placeholder: "Search issues, projects, cycles...")
- Ícone de Notificações (com badge de contagem)
- Avatar do usuário (dropdown menu)
- Botão "Quick add" (+)

**Sidebar Esquerda:**
- Workspace name (com dropdown)
- **Seção Favorites**
  - Ícone estrela
  - Lista de projetos favoritos (drag & drop para reordenar)
- **Seção Projects**
  - Ícone de folder
  - Lista de todos os projetos
  - Botão "New project" (+)
- **Seção Views**
  - Ícone de eye
  - Views globais salvas
- **Seção Labels**
  - Ícone de tag
  - Labels globais
- **Seção Members**
  - Ícone de users
  - Lista de membros do workspace

**Área Principal:**
- Grid de projetos cards
- Seção "Recent projects"
- Seção "Your assigned issues"
- Seção "Recent activity"

### 2.2 PROJECT CARD
**Elementos de cada card de projeto:**
- Avatar/icon do projeto
- Nome do projeto
- Descrição (se houver)
- Contadores: Issues, Cycles, Members
- Progress bar de completion
- Menu de ações (3 dots):
  - Edit project
  - Add to favorites
  - Archive project
  - Delete project

**Interactions:**
1. **Hover no card** → elevação e sombra
2. **Clique no card** → navega para `/projects/[id]`
3. **Clique no menu de ações** → dropdown com opções
4. **Drag & drop** → reordenar projetos

## 3. GESTÃO DE PROJETOS

### 3.1 PÁGINA DO PROJETO
**URL:** `/projects/[project-id]`

**Header do Projeto:**
- Avatar/icon do projeto (clicável para editar)
- Nome do projeto (editável inline)
- Descrição (editável inline)
- Botão "Star" (favoritar)
- Botão "Share" (convidar membros)
- Botão "More options" (menu dropdown)

**Abas de Navegação:**
- **Issues** (padrão)
- **Cycles**
- **Modules**
- **Views**
- **Settings**

### 3.2 CRIAÇÃO DE PROJETO
**Trigger:** Botão "New project" na sidebar ou "Quick add"

**Modal de Criação:**
- Campo: Name (obrigatório)
- Campo: Description (opcional)
- Upload: Icon/Avatar (opcional)
- Select: Project lead (dropdown com membros)
- Select: Default view (List, Board, Calendar, Gantt)
- Toggle: Make public
- Botões: "Cancel", "Create project"

**Fluxo:**
1. **Clique em "New project"**
2. Modal abre
3. Preenchimento dos campos
4. **Clique em "Create project"**
5. Loading no botão
6. Modal fecha
7. Redirecionamento para novo projeto
8. Toast notification: "Project created successfully"

### 3.3 CONFIGURAÇÕES DO PROJETO
**URL:** `/projects/[project-id]/settings`

**Abas:**
- **General**
  - Nome e descrição
  - Avatar/icon
  - Project lead
  - Archive/Delete project
- **Members**
  - Lista de membros
  - Roles (Admin, Member, Viewer)
  - Botão "Invite members"
- **Labels**
  - Criar/editar labels
  - Cores customizadas
  - Delete labels
- **Estimates**
  - Enable/disable estimates
  - Point values
- **Automation**
  - Regras de automação
  - Webhooks

## 4. SISTEMA DE ISSUES (TAREFAS)

### 4.1 LISTA DE ISSUES
**Layout:**
- Barra de ferramentas superior:
  - View switcher (List/Board/Calendar/Gantt)
  - Filter button (com contagem de filtros ativos)
  - Sort dropdown (Created, Updated, Priority, etc.)
  - Density toggle (Comfortable/Compact)
  - Display options (colunas visíveis)
- Search bar (placeholder: "Search issues")
- Lista de issues com colunas configuráveis

**Colunas Disponíveis:**
- Checkbox (seleção)
- ID (ex: PROJ-123)
- Priority (High/Medium/Low/Urgent)
- State (Todo/In Progress/Done/Cancelled)
- Assignee(s)
- Labels
- Created Date
- Updated Date
- Due Date
- Estimate
- Created By

### 4.2 CRIAÇÃO DE ISSUE
**Triggers:**
- Botão "Add issue" (+)
- Atalho: `Ctrl/Cmd + I`
- Clique em linha vazia na lista

**Modal/Popover de Criação:**
- Campo: Title (obrigatório, placeholder: "Issue title")
- Campo: Description (rich text editor)
- Select: State (dropdown)
- Select: Assignee(s) (multi-select)
- Select: Labels (multi-select com criação rápida)
- Select: Priority (dropdown)
- Campo: Due date (date picker)
- Campo: Estimate (se habilitado no projeto)
- Select: Parent issue (para sub-issues)
- Toggle: Create another
- Botões: "Cancel", "Create issue"

**Rich Text Editor Features:**
- Bold, Italic, Underline
- Heading levels (H1-H3)
- Lists (ordered/unordered)
- Code blocks
- Links
- Mentions (@member)
- Issue references (#PROJ-123)
- File attachments
- Images

### 4.3 ISSUE DETAIL VIEW
**URL:** `/projects/[project-id]/issues/[issue-id]`

**Layout Principal:**
- **Coluna Esquerda (Metadata):**
  - ID do issue
  - State (dropdown inline)
  - Assignee(s) (multi-select)
  - Priority (dropdown)
  - Labels (multi-select)
  - Due date (date picker)
  - Estimate (se habilitado)
  - Parent issue (link)
  - Sub-issues (expansible)
  - Created/Updated info

- **Área Central:**
  - Title (editável inline)
  - Description (rich text editor)
  - Comments section
  - Activity history

- **Coluna Direita (Actions):**
  - Botão "Copy issue link"
  - Botão "Mark as done"
  - Botão "Delete issue"
  - Botão "Add to cycle"
  - Botão "Add to module"

### 4.4 SUB-ISSUES (MICRO TAREFAS)
**Funcionalidades:**
- Criar sub-issues diretamente da issue parent
- Arrastar issues existentes para virar sub-issues
- Indentação visual na lista
- Progress tracking automático
- Collapse/expand sub-issues

**Fluxo de Criação:**
1. Na issue detail, **clicar em "Add sub-issue"**
2. Modal simplificado de criação
3. **Clique em "Create sub-issue"**
4. Sub-issue aparece na seção de sub-issues
5. Contador de progresso atualiza automaticamente

### 4.5 ISSUE RELATIONSHIPS
**Tipos de Relacionamentos:**
- **Blocks** (este issue bloqueia outro)
- **Blocked by** (este issue é bloqueado por outro)
- **Relates to** (relacionamento simples)
- **Duplicate of** (issue duplicado)

**Como criar:**
1. Na issue detail, **clicar em "Link issues"**
2. Selecionar tipo de relacionamento
3. Buscar e selecionar issue(s) relacionados
4. **Clique em "Link"**
5. Relacionamentos aparecem como badges clicáveis

## 5. CYCLES (SPRINTS)

### 5.1 CYCLE MANAGEMENT
**URL:** `/projects/[project-id]/cycles`

**Layout:**
- Lista de cycles (cards)
- Botão "New cycle" (+)
- Indicador de cycle ativo
- Progress indicators

**Cycle Card:**
- Nome e datas do cycle
- Contador de issues
- Progress bar
- Status (Current/Upcoming/Completed/Draft)
- Menu de ações

### 5.2 CRIAÇÃO DE CYCLE
**Modal:**
- Campo: Name (ex: "Sprint 23")
- Campo: Start date
- Campo: End date
- Textarea: Description (opcional)
- Select: Issues to include (multi-select)
- Toggle: Make favorite
- Botões: "Cancel", "Create cycle"

### 5.3 CYCLE DETAIL VIEW
**Features:**
- Drag & drop de issues para o cycle
- Progress tracking automático
- Burndown chart
- Cycle controls (Start/Pause/Complete)
- Add/remove issues

## 6. MODULES (EPICS)

### 6.1 MODULE MANAGEMENT
**URL:** `/projects/[project-id]/modules`

**Layout similar a Cycles:**
- Lista de modules
- Botão "New module"
- Status indicators
- Progress tracking

### 6.2 MODULE DETAIL VIEW
**Features:**
- Hierarquia de issues
- Progress por módulo
- Distribuição de issues por status
- Add/remove issues
- Module start/end dates

## 7. VIEWS E VISUALIZAÇÕES

### 7.1 LIST VIEW
**Features:**
- Colunas configuráveis
- Sort avançado
- Filters complexos
- Group by options
- Export para CSV

### 7.2 BOARD VIEW (KANBAN)
**Layout:**
- Colunas por State (Todo/In Progress/Done/etc.)
- Drag & drop entre colunas
- Cards com informações resumidas
- Quick edit inline
- Swimlanes (opcional)

**Card Features:**
- Priority indicator
- Assignee avatars
- Label badges
- Due date indicator
- Issue count (para parent issues)

### 7.3 CALENDAR VIEW
**Features:**
- Visualização mensal/semanal/diária
- Issues com due dates
- Drag para alterar datas
- Color coding por labels/assignee
- Quick create em datas específicas

### 7.4 GANTT VIEW
**Features:**
- Timeline visual
- Dependencies entre issues
- Critical path highlighting
- Zoom controls
- Baseline comparison
- Milestone markers

### 7.5 CUSTOM VIEWS
**Criação de Views Personalizadas:**
1. **Clique em "Save view"**
2. Nomear a view
3. Definir filters
4. Configurar sort/group
5. Selecionar colunas
6. Definir compartilhamento
7. **Clique em "Save"**

## 8. COLABORAÇÃO E COMUNICAÇÃO

### 8.1 COMMENTS SYSTEM
**Features:**
- Threaded comments
- @mentions
- Rich text formatting
- File attachments
- Reactions (emojis)
- Edit/delete own comments
- Mark as resolved

**Fluxo:**
1. **Clique no campo "Add comment"**
2. Escrever comentário
3. **Clique em "Comment"** ou `Ctrl/Cmd + Enter`
4. Comentário aparece na timeline
5. Notificações enviadas para mencionados

### 8.2 ACTIVITY FEED
**Features:**
- Timeline completa de mudanças
- Agrupamento por dia
- Filtros por tipo de atividade
- Subscribe to issue notifications
- Email digest settings

### 8.3 NOTIFICATIONS
**Tipos:**
- In-app notifications (bell icon)
- Email notifications
- Push notifications (mobile)
- Slack integration

**Notification Center:**
- Lista de notificações não lidas
- Mark all as read
- Notification settings
- Direct links para issues

## 9. SEARCH E FILTROS

### 9.1 GLOBAL SEARCH
**Features:**
- Search across all projects
- Quick issue creation from search
- Recent searches
- Search operators avançados
- Keyboard shortcuts

**Search Operators:**
- `project:PROJ` - filtrar por projeto
- `assignee:@user` - filtrar por assignee
- `state:todo` - filtrar por estado
- `label:bug` - filtrar por label
- `created:>2024-01-01` - filtro de data
- `priority:urgent` - filtro de prioridade

### 9.2 ADVANCED FILTERS
**Filter Builder:**
- And/Or logic
- Multiple conditions
- Saved filter presets
- Share filters with team
- Apply to views

## 10. AUTOMAÇÃO E INTEGRAÇÕES

### 10.1 AUTOMATION RULES
**Tipos de Triggers:**
- Issue created
- Issue updated
- State changed
- Comment added
- Due date approaching

**Tipos de Actions:**
- Change state
- Add assignee
- Add label
- Send notification
- Create sub-task
- Update custom field

### 10.2 INTEGRAÇÕES
**Available Integrations:**
- GitHub/GitLab (sync issues, PRs)
- Slack (notifications, commands)
- Jira (import/export)
- Zapier (webhooks)
- API access

## 11. CONFIGURAÇÕES DE USUÁRIO

### 11.1 USER PROFILE
**URL:** `/profile`

**Sections:**
- Personal information
- Avatar upload
- Email preferences
- Password change
- API tokens
- Connected accounts

### 11.2 WORKSPACE SETTINGS
**URL:** `/settings/workspace`

**Sections:**
- General settings
- Billing/subscription
- Members management
- Security settings
- Import/Export data
- Workspace analytics

## 12. KEYBOARD SHORTCUTS

### 12.1 GLOBAL SHORTCUTS
- `Ctrl/Cmd + K` - Quick search
- `Ctrl/Cmd + /` - Show shortcuts
- `Ctrl/Cmd + I` - Create issue
- `Ctrl/Cmd + Shift + C` - Create cycle
- `Ctrl/Cmd + Shift + M` - Create module

### 12.2 NAVIGATION SHORTCUTS
- `G + P` - Go to projects
- `G + I` - Go to issues
- `G + C` - Go to cycles
- `G + M` - Go to modules
- `G + S` - Go to settings

### 12.3 ISSUE SHORTCUTS
- `Enter` - Open selected issue
- `Space` - Select/deselect issue
- `E` - Edit issue
- `D` - Delete issue
- `A` - Assign to me
- `L` - Add label

---

Este mapa cobre TODAS as funcionalidades principais do Plane.so com detalhes extremos sobre cada interação, clique, fluxo e elemento da interface. Cada feature foi mapeada com seus triggers, ações, e resultados esperados.