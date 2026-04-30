# Análise Frontend-Design do Projeto AERO

> **Metodologia:** Análise realizada com base na skill `frontend-design` contida em `.agent/skills/`, utilizando os princípios de UX Psychology, Color System, Typography, Visual Effects, Animation Guide e o script automatizado de UX Audit.
>
> **Data:** 30/04/2026
>
> **Ferramentas utilizadas:** Leitura de código-fonte, documentação do projeto (PRD, Design System), script `ux_audit.py` da skill frontend-design.

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Sistema de Cores](#2-sistema-de-cores--avaliação)
3. [Tipografia](#3-tipografia--avaliação)
4. [Layout e Espaçamento](#4-layout--espaçamento--avaliação)
5. [UX Psychology](#5-ux-psychology--avaliação)
6. [Visual Effects e Animação](#6-visual-effects--animação--avaliação)
7. [Acessibilidade](#7-acessibilidade--avaliação)
8. [Componentes UI](#8-componentes-ui--avaliação)
9. [Resultado do UX Audit Automático](#9-resultado-do-ux-audit-automático)
10. [Veredicto e Recomendações Prioritárias](#10-veredicto--recomendações-prioritárias)

---

## 1. Visão Geral

O **AERO** é um sistema de gestão de projetos estilo Linear/Plane, construído com **Next.js 16 + React 19 + Tailwind CSS 4 + Supabase**. O projeto possui um PRD bem definido, um Design System documentado (`DESIGN_SYSTEM.md`) e uma base de componentes UI consistente.

### Stack Técnica

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Next.js | 16.0.10 | Framework principal (App Router) |
| React | 19.2.1 | UI Library |
| Tailwind CSS | 4.x | Estilização utility-first |
| Supabase | 2.88.0 | Backend (Auth, Database, Storage) |
| Radix UI | múltiplas | Primitivos acessíveis de UI |
| Tiptap | 3.13.0 | Editor rich-text |
| Zustand | 5.0.9 | Gerenciamento de estado |
| TanStack Query | 5.90.20 | Data fetching e cache |
| Lucide React | 0.561.0 | Iconografia |

### Diferenciais do Produto (PRD)

1. **Keyboard-First:** 99% das ações realizáveis sem tirar a mão do teclado.
2. **Performance Instantânea:** Interface responde em <100ms. Optimistic UI updates.
3. **Design Minimalista & Focado:** Dark mode by default.

---

## 2. Sistema de Cores — Avaliação

### 2.1. Pontos Fortes

| Critério | Avaliação |
|----------|-----------|
| **Dark Mode by Default** | Excelente decisão para o público-alvo (devs/PMs). Reduz fadiga visual e destaca conteúdo. |
| **Hierarquia de Elevação** | O sistema `primary → primary-10 → primary-20 → primary-30` cria camadas visuais claras (Sidebar → Cards → Inputs → Sombras). |
| **Cores Semânticas** | Success/Warning/Danger/Info bem definidas com significados claros. |
| **Consistência** | Todas as cores estão tokenizadas em CSS variables e mapeadas no Tailwind via `@theme inline`. |

### 2.2. Paleta Atual

**Cores da Marca e Estrutura:**

| Token | Hex | Uso |
|-------|-----|-----|
| Primary | `#24262F` | Fundo principal |
| Primary 10 | `#1D1F26` | Paineis, Sidebar, Cards |
| Primary 20 | `#17181D` | Inputs, Dropdowns |
| Primary 30 | `#101115` | Sombras, bordas sutis |
| Brand | `#388cfa` | Ações primárias (CTAs, links) |
| Background | `#0e1015` | Fundo profundo |
| Card | `#1a1c23` | Superfícies elevadas |

**Texto e Conteúdo:**

| Token | Hex | Uso |
|-------|-----|-----|
| Neutral | `#ffffff` | Títulos, alto contraste |
| Neutral 10 | `#f5f5f5` | Texto do corpo |
| Neutral 20 | `#d4d4d4` | Legendas, descrições |
| Neutral 30 | `#a3a3a3` | Placeholders, ícones inativos |
| Neutral 40 | `#737373` | Bordas desabilitadas |

**Feedback e Status:**

| Estado | Hex | Significado |
|--------|-----|-------------|
| Success | `#18821C` | Concluído, Seguro, Positivo |
| Warning | `#A35A01` | Atenção, Pendente |
| Danger | `#911756` | Erro, Ação Destrutiva |
| Info | `#008E8E` | Informativo, Neutro |
| Accent | `#535c91` | Destaque secundário |

### 2.3. Problemas Encontrados

| Problema | Severidade | Detalhe |
|----------|------------|---------|
| **Roxo Banido (#8B5CF6)** | 🔴 Crítico | Detectado em `projects-client.tsx` e múltiplas páginas. A skill frontend-design bane explicitamente roxo/violeta por ser um "AI default". Deve ser substituído por Teal/Cyan/Emerald. |
| **Roxo (#DDD6FE)** | 🔴 Crítico | Detectado em `page.tsx` (analytics). Mesma violação. |
| **21 cores distintas** | 🟡 Aviso | O UX Audit detectou 21 cores, o que pode violar a regra 60-30-10. |
| **Cores em Hex ao invés de HSL** | 🟡 Aviso | As variáveis CSS usam hex. A skill recomenda HSL para facilitar ajustes de paleta. |

### 2.4. Recomendação da Skill (Color System)

> **Regra 60-30-10:**
> - **60%** para backgrounds (tons de `primary`)
> - **30%** para superfícies (`primary-10/20`)
> - **10%** para ações (`brand` + cores semânticas)
>
> O AERO está próximo, mas as cores roxas "quebram" a harmonia monocromática.

---

## 3. Tipografia — Avaliação

### 3.1. Pontos Fortes

| Critério | Avaliação |
|----------|-----------|
| **Inter como fonte principal** | Excelente escolha para UI de alta densidade. X-height generosa, legível em tamanhos pequenos. |
| **Geist Mono para código** | Boa complementação para blocos de código e identificadores (`PROJ-123`). |
| **Escala bem definida** | Do Display H1 (36px) ao Tiny/Label (12px), com pesos adequados. |
| **Fonte carregada via next/font** | Otimização automática de performance (FOIT/FOUT eliminados). |

### 3.2. Escala Tipográfica do Design System

| Papel | Tamanho | Peso | Tailwind Class |
|-------|---------|------|----------------|
| Display H1 | 36px (2.25rem) | 700 | `text-4xl font-bold` |
| H1 (Page Title) | 30px (1.875rem) | 600 | `text-3xl font-semibold` |
| H2 (Section) | 24px (1.5rem) | 600 | `text-2xl font-semibold` |
| H3 (Card Title) | 20px (1.25rem) | 600 | `text-xl font-semibold` |
| Body (Default) | 16px (1rem) | 400 | `text-base` |
| Small | 14px (0.875rem) | 400 | `text-sm` |
| Tiny/Label | 12px (0.75rem) | 500 | `text-xs font-medium` |

A escala atual é próxima de **Major Third (1.25)**, adequada para "General web" e interfaces densas.

### 3.3. Problemas Encontrados

| Problema | Severidade | Detalhe |
|----------|------------|---------|
| **Tamanhos fixos sem `clamp()`** | 🟡 Aviso | Textos usam tamanhos fixos (rem/px). A skill recomenda tipografia fluida: `clamp(MIN, PREFERRED, MAX)` para responsividade. |
| **Line-height não explícito em componentes** | 🟡 Aviso | Muitos componentes não definem `line-height`. A skill recomenda: body 1.4-1.6, headings 1.1-1.3. |
| **Line-length sem restrição** | 🟡 Aviso | Ausência de `max-w-prose` ou `max-w-[65ch]` para limitar largura de leitura (ideal: 45-75 caracteres). |

---

## 4. Layout e Espaçamento — Avaliação

### 4.1. Pontos Fortes

| Critério | Avaliação |
|----------|-----------|
| **Sidebar fixa (w-64)** | Segue o padrão Linear/Notion. Consistente com o PRD. |
| **Grid de 4 colunas no Dashboard** | StatCards usam `grid-cols-4` com breakpoints responsivos (`md:grid-cols-2`, `lg:grid-cols-4`). |
| **8-Point Grid** | O espaçamento segue múltiplos de 4 (p-2, p-3, p-4, p-6, gap-2, gap-4). |
| **Hierarquia de navegação** | Sidebar com seções claras (Pessoal → Workspace → Projetos). |
| **Flex layout no dashboard** | `flex h-screen` com sidebar + main content, evitando overflow. |

### 4.2. Arquitetura de Layout

```
┌─────────────────────────────────────────────────┐
│ RootLayout (html.dark)                          │
│ ┌─────────────────────────────────────────────┐ │
│ │ Providers (QueryClientProvider)              │ │
│ │ ┌─────────────────────────────────────────┐ │ │
│ │ │ DashboardLayout                         │ │ │
│ │ │ ┌──────────┬────────────────────────┐   │ │ │
│ │ │ │ Sidebar  │ Header                 │   │ │ │
│ │ │ │ (w-64)   ├────────────────────────┤   │ │ │
│ │ │ │          │ Main Content           │   │ │ │
│ │ │ │          │ (flex-1 overflow-auto) │   │ │ │
│ │ │ └──────────┴────────────────────────┘   │ │ │
│ │ └─────────────────────────────────────────┘ │ │
│ │ CommandPalette (global)                     │ │
│ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### 4.3. Problemas Encontrados

| Problema | Severidade | Detalhe |
|----------|------------|---------|
| **Kanban com largura fixa (350px)** | 🟡 Aviso | Colunas fixas em `w-[350px]` podem não adaptar bem a telas menores. |
| **Layout não colapsável** | 🟡 Aviso | A Sidebar não possui toggle de colapso. O PRD menciona "Sidebar Colapsável" como requisito. |
| **Responsividade limitada** | 🟡 Aviso | O foco declarado é Desktop, mas não há adaptação para Tablet. |

### 4.4. Análise pela Lei de Hick

> A sidebar contém **3 itens pessoais + 5 do workspace + N projetos**. Isso pode exceder o limite de **7±2 itens** (Miller's Law) quando há muitos projetos. Os projetos já possuem colapso individual, o que ajuda. Recomenda-se considerar agrupar workspace items com "Ver todos".

---

## 5. UX Psychology — Avaliação

### 5.1. Aplicação das Leis UX

| Lei | Status | Evidência no AERO |
|-----|--------|-------------------|
| **Hick's Law** | ✅ Parcial | Command Palette agrupa comandos por categoria (Criar, Navegação). Mas a Sidebar pode ter muitos itens. |
| **Fitts' Law** | ✅ Bom | Botões têm `h-10` (40px), próximo do mínimo recomendado (44px). Touch targets adequados. |
| **Miller's Law** | ✅ Bom | Cards do Kanban agrupam info em chunks visuais claros (ID → Título → Badges → Footer). |
| **Von Restorff** | ✅ Bom | O `brand` (#388cfa) se destaca no dark theme monocromático. CTAs são visualmente distintos. |
| **Serial Position** | ✅ Bom | Itens mais importantes (Home, Your Work) no topo da sidebar. Config/Sair no rodapé. |

### 5.2. Design Emocional (Don Norman)

| Nível | Avaliação |
|-------|-----------|
| **Visceral** (primeira impressão) | ✅ Dark theme + azul brand = sensação de "ferramenta profissional, moderna". Primeira impressão forte e coerente com o público dev. |
| **Behavioral** (uso) | ✅ Command Palette (`Cmd+K`) + atalhos = fluxo eficiente. A promessa "velocity" é cumprida na navegação. |
| **Reflective** (memória/identidade) | 🟡 Pendente | Falta brand story, social proof, e elementos de identidade. O UX Audit flagou ausência desses elementos. |

### 5.3. Publico-Alvo vs. Design

O PRD define 3 personas: Desenvolvedor, Gerente de Produto e Designer. A análise pela skill frontend-design indica:

| Persona | Atendimento |
|---------|-------------|
| **Dev** | ✅ Excelente — Keyboard-first, dark mode, Markdown editor, IDs curtos |
| **PM** | ✅ Bom — Kanban, Analytics, Cycles/Sprints, Wiki |
| **Designer** | ✅ Parcial — Kanban visual, mas falta integração Figma e upload de arquivos |

---

## 6. Visual Effects e Animação — Avaliação

### 6.1. Pontos Fortes

| Critério | Avaliação |
|----------|-----------|
| **Aurora Background** | Gradiente animado sutil (`linear-gradient(-45deg, ...)`) com animação lenta (15s). Adequado para estados vazios e áreas de destaque. |
| **Focus Ring** | `outline: 2px solid var(--brand)` com `outline-offset: 2px` — acessível e visível. |
| **Transições nos componentes** | `transition-colors` em botões, links, sidebar items e cards. Consistente. |
| **Animações Radix** | Dialog, Dropdown, Tooltip usam animações de entrada/saída (fade + zoom + slide) via data attributes. |
| **Scrollbar customizada** | Cores e dimensões que não quebram a imersão do dark theme. |

### 6.2. Problemas Encontrados

| Problema | Severidade | Detalhe |
|----------|------------|---------|
| **`@keyframes aurora` sem `prefers-reduced-motion`** | 🔴 Crítico | A animação Aurora roda infinitamente sem respeitar preferência de reduced-motion. Viola acessibilidade. |
| **Animação de propriedades custosas** | 🟡 Aviso | O UX Audit detectou animação de `width/height`. A skill recomenda usar apenas `transform` e `opacity` para performance. |
| **Ausência de Skeleton Screens** | 🟡 Aviso | O PRD menciona "Skeleton screens preferíveis a spinners", mas o Editor usa apenas `animate-pulse` genérico. |
| **Kanban drag sem feedback visual rico** | 🟡 Aviso | Drag apenas aplica `opacity-50`. Poderia ter elevação (shadow + scale) para feedback mais claro. |

### 6.3. Recomendação da Skill (Animation Guide)

> **Duração:** As animações Radix usam `duration-200` (200ms), que está no range recomendado para "Standard transitions" (200-300ms). ✅
>
> **Easing:** `ease-out` para entrada, `ease-in` para saída. As animações do Dialog seguem esse padrão. ✅
>
> **Performance:** Animar apenas `transform` e `opacity`. O Aurora anima `background-position`, que é mais custoso. ⚠️

---

## 7. Acessibilidade — Avaliação

### 7.1. Pontos Fortes

| Critério | Avaliação |
|----------|-----------|
| **Focus Visible** | Todos os componentes interativos têm `focus-visible:ring-2 ring-brand`. Consistente. |
| **Radix Primitives** | Dialog, Dropdown, Tooltip, Checkbox usam Radix UI, que tem acessibilidade built-in (ARIA roles, keyboard navigation). |
| **sr-only no Dialog Close** | `<span className="sr-only">Close</span>` para screen readers. |
| **Keyboard Navigation** | Command Palette com navegação por Arrow keys + Enter. Acessível sem mouse. |
| **HTML lang="pt-BR"** | Idioma definido corretamente no root layout. |

### 7.2. Problemas Encontrados

| Problema | Severidade | Detalhe |
|----------|------------|---------|
| **Inputs sem `<label>`** | 🔴 Crítico | Login form, signup form e inputs gerais não usam `<label>`. Apenas `placeholder`. Viola WCAG 2.1 SC 1.3.1. |
| **Contraste do `neutral-40` (#737373)** | 🟡 Aviso | Texto `neutral-40` em fundo `primary` (#24262F) pode não atingir contraste AA (4.5:1). Razão estimada: ~3.2:1. Precisa verificação. |
| **Kanban drag sem alternativa acessível** | 🟡 Aviso | Drag & drop no Kanban não tem fallback acessível por teclado. |
| **Comandos do Command Palette sem ARIA roles** | 🟡 Aviso | A lista de comandos usa `selectedIndex` manual mas não expõe `aria-activedescendant` ou `role="listbox"`. |

---

## 8. Componentes UI — Avaliação

### 8.1. Inventário de Componentes

| Componente | Arquivo | Variações | Qualidade |
|------------|---------|-----------|-----------|
| **Button** | `components/ui/button.tsx` | 6 variantes × 4 tamanhos | ✅ Excelente |
| **Input** | `components/ui/input.tsx` | Base com focus ring | ✅ Bom |
| **Badge** | `components/ui/badge.tsx` | 6 variantes (default, secondary, destructive, outline, success, warning) | ✅ Excelente |
| **Dialog** | `components/ui/dialog.tsx` | Overlay + Content + Header/Footer/Title/Description | ✅ Bom |
| **Avatar** | `components/ui/avatar.tsx` | Image + Fallback | ✅ Bom |
| **Tooltip** | `components/ui/tooltip.tsx` | Provider + Trigger + Content | ✅ Bom |
| **Dropdown Menu** | `components/ui/dropdown-menu.tsx` | Completo com sub-menus, checkbox, radio, separator, shortcut | ✅ Excelente |
| **Checkbox** | `components/ui/checkbox.tsx` | Com indicator e estados | ✅ Bom |
| **Editor (Tiptap)** | `components/editor/editor.tsx` | Rich text com placeholder, headings, links, underline | ✅ Bom |
| **Kanban Board** | `components/work-items/kanban-board.tsx` | Colunas + drag + items com prioridade/estado/assignees | ✅ Bom |
| **List View** | `components/work-items/list-view.tsx` | Agrupado por estado | ✅ Bom |
| **Table View** | `components/work-items/table-view.tsx` | — | — |
| **Calendar View** | `components/work-items/calendar-view.tsx` | — | — |
| **Timeline View** | `components/work-items/timeline-view.tsx` | — | — |
| **Work Item Modal** | `components/work-items/work-item-modal.tsx` | Criação com título, prioridade, estado, descrição | ✅ Bom |
| **Sidebar** | `components/layout/sidebar.tsx` | Navegação com projetos expandíveis | ✅ Bom |
| **Header** | `components/layout/header.tsx` | Workspace toggle + Search + Actions | ✅ Bom |
| **Command Palette** | `components/layout/command-palette.tsx` | Busca + navegação + atalhos | ✅ Excelente |

### 8.2. Padrão Arquitetural

Todos os componentes seguem o padrão **shadcn/ui**:

- `cva` (class-variance-authority) para variantes
- `cn` (clsx + tailwind-merge) para composição de classes
- `forwardRef` para ref forwarding
- Radix UI primitives para acessibilidade

Isso garante:
- Consistência visual entre componentes
- Composição flexível (asChild pattern)
- Tipagem TypeScript correta
- Manutenibilidade elevada

---

## 9. Resultado do UX Audit Automático

O script `ux_audit.py` da skill frontend-design foi executado e analisou **54 arquivos**.

### 9.1. Resumo

| Categoria | Contagem |
|-----------|----------|
| 🔴 **Issues Críticos** | 9 |
| 🟡 **Warnings** | 352 |
| ✅ **Checks Passados** | 18 |
| **Status Geral** | **FAIL** |

### 9.2. Issues Críticos (9)

| # | Arquivo | Categoria | Descrição |
|---|---------|-----------|-----------|
| 1 | `globals.css` | Cognitive Load | Form inputs without labels. Use `<label>` for accessibility and clarity. |
| 2 | `login-form.tsx` | Cognitive Load | Form inputs without labels. Use `<label>` for accessibility and clarity. |
| 3 | `page.tsx` (analytics) | Color | PURPLE DETECTED (`#DDD6FE`). Banned by Maestro rules. |
| 4 | `projects-client.tsx` | Color | PURPLE DETECTED (`#8B5CF6`). Banned by Maestro rules. |
| 5 | `page.tsx` | Color | PURPLE DETECTED (`#8B5CF6`). Banned by Maestro rules. |
| 6 | `page.tsx` | Color | PURPLE DETECTED (`#8B5CF6`). Banned by Maestro rules. |
| 7 | `page.tsx` | Cognitive Load | Form inputs without labels. Use `<label>` for accessibility and clarity. |
| 8 | `page.tsx` | Cognitive Load | Form inputs without labels. Use `<label>` for accessibility and clarity. |
| 9 | `page.tsx` | Color | PURPLE DETECTED (`#8B5CF6`). Banned by Maestro rules. |

### 9.3. Principais Warnings (352)

| Categoria | Exemplos |
|-----------|----------|
| **Typography** | Texto sem line-height explícito; tamanhos fixos sem `clamp()`; ausência de `max-w-prose` |
| **Trust** | Ausência de social proof, security indicators em forms |
| **Visual** | Design flat sem profundidade em algumas áreas |
| **Animation** | Operações async sem loading indicator; animações sem `prefers-reduced-motion` |
| **Color** | Variáveis de cor em hex ao invés de HSL; 21 cores distintas |
| **Reflective** | Conteúdo sem brand story/values |
| **Persuasion** | Social proof sem números específicos |

---

## 10. Veredicto e Recomendações Prioritárias

### 10.1. O que funciona muito bem

- **Design System documentado e tokenizado** — raro em projetos deste porte
- **Componentes consistentes** seguindo shadcn/ui com Radix primitives
- **Command Palette** — destaque UX, cumpre a promessa "keyboard-first"
- **Dark theme monocromático** — adequado ao público dev, reduz fadiga visual
- **Hierarquia visual** — clara nos cards, badges, navegação e estados
- **Performance setup** — TanStack Query com cache, next/font, dynamic imports

### 10.2. Prioridades de Correção

| # | Ação | Severidade | Impacto |
|---|------|------------|---------|
| 1 | **Remover roxo (#8B5CF6, #DDD6FE)** dos arquivos detectados | 🔴 Crítico | Violação de design + AI default; substituir por Teal/Cyan/Emerald |
| 2 | **Adicionar `<label>` aos inputs** (login, signup, forms gerais) | 🔴 Crítico | Acessibilidade WCAG 2.1 SC 1.3.1 |
| 3 | **Adicionar `prefers-reduced-motion`** na animação Aurora | 🔴 Crítico | Acessibilidade + performance |
| 4 | **Converter cores para HSL** nas CSS variables | 🟡 Aviso | Manutenibilidade da paleta |
| 5 | **Implementar sidebar colapsável** | 🟡 Aviso | Requisito do PRD não implementado |
| 6 | **Adicionar Skeleton Screens** em carregamentos | 🟡 Aviso | Perceived performance |
| 7 | **Verificar contraste AA** em `neutral-30` e `neutral-40` sobre fundos escuros | 🟡 Aviso | Acessibilidade |
| 8 | **Adicionar tipografia fluida com `clamp()`** | 🟡 Aviso | Responsividade |
| 9 | **Adicionar fallback acessível para Kanban drag** | 🟡 Aviso | Acessibilidade motora |
| 10 | **Adicionar ARIA roles no Command Palette** | 🟡 Aviso | Acessibilidade para screen readers |

### 10.3. Score Final

| Dimensão | Nota | Observação |
|----------|------|------------|
| **Cores** | 7/10 | Boa paleta, mas violação de roxo |
| **Tipografia** | 8/10 | Excelente escolha de fontes, falta tipografia fluida |
| **Layout** | 8/10 | Sólido, falta sidebar colapsável |
| **UX Psychology** | 8/10 | Boa aplicação das leis, Command Palette é destaque |
| **Visual Effects** | 7/10 | Animações adequadas, falta reduced-motion |
| **Acessibilidade** | 6/10 | Focus rings bons, mas inputs sem label e contraste duvidoso |
| **Componentes** | 9/10 | Padrão shadcn/ui bem executado |
| **Geral** | **7.6/10** | Base sólida, correções pontuais necessárias |

---

> **Nota:** Esta análise foi gerada utilizando a skill `frontend-design` do diretório `.agent/skills/`, com aplicação dos princípios de UX Psychology, Color System, Typography System, Visual Effects e Animation Guide, complementada pelo script automatizado `ux_audit.py`.
