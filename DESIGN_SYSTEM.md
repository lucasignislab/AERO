# AERO - Design System & Style Guide

Este documento serve como a **Fonte Única de Verdade (SSOT)** para designers e desenvolvedores. Ele mapeia tokens de design para classes utilitárias do Tailwind CSS, garantindo consistência visual e eficiência no desenvolvimento.

---

## 1. Cores (Colors)

Nossa paleta é semântica e adaptável (suporta Dark Mode nativamente).

### 1.1. Cores da Marca e Estrutura

| Token | CSS Variable (Tailwind) | Hex | Uso Recomendado |
| :--- | :--- | :--- | :--- |
| **Primary** | `bg-primary` | `#24262F` | Fundo principal da aplicação (Body). |
| **Primary 10** | `bg-primary-10` | `#1D1F26` | Paineis (Sidebar), Cards primários. |
| **Primary 20** | `bg-primary-20` | `#17181D` | Inputs, Dropdowns. |
| **Primary 30** | `bg-primary-30` | `#101115` | Sombras profundas, bordas sutis. |
| **Brand (Info)**| `text-brand` / `bg-brand` | `#388cfa` | Cor principal de ação (Links, Botões primários). |
| **Background** | `bg-background-dark` | `#0e1015` | Fundo alternativo profundo. |
| **Card** | `bg-background-card` | `#1a1c23` | Superfícies elevadas. |

### 1.2. Texto e Conteúdo (Neutral)

| Token | Class | Hex | Uso |
| :--- | :--- | :--- | :--- |
| **Neutral** | `text-neutral` | `#ffffff` | Títulos, texto de alto contraste. |
| **Neutral 10** | `text-neutral-10` | `#f5f5f5` | Texto do corpo principal. |
| **Neutral 20** | `text-neutral-20` | `#d4d4d4` | Legendas, descrições secundárias. |
| **Neutral 30** | `text-neutral-30` | `#a3a3a3` | Placeholders, ícones inativos. |
| **Neutral 40** | `text-neutral-40` | `#737373` | Bordas desabilitadas. |

### 1.3. Feedback & Status

| Estado | Token | Hex | Significado |
| :--- | :--- | :--- | :--- |
| **Success** | `success-DEFAULT` | `#18821C` | Concluído, Seguro, Positivo. |
| **Warning** | `warning-DEFAULT` | `#A35A01` | Atenção, Pendente, Cuidado. |
| **Danger** | `danger-DEFAULT` | `#911756` | Erro, Falha, Ação Destrutiva. |
| **Info** | `info-DEFAULT` | `#008E8E` | Informativo, Neutro. |
| **Accent** | `accent-DEFAULT` | `#535c91` | Destaque secundário, Badges, Tags. |

---

## 2. Tipografia (Typography)

**Família:** `Inter` (Google Fonts)
**Pesos:** `300` (Light), `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold).

### 2.1. Escala de Tamanhos (Desktop)

| Papel | Tamanho (rem/px) | Peso | Tailwind Class | Linha (Line-height) |
| :--- | :--- | :--- | :--- | :--- |
| **Display H1** | 2.25rem (36px) | 700 | `text-4xl font-bold` | 1.2 |
| **H1 (Page Title)**| 1.875rem (30px)| 600 | `text-3xl font-semibold` | 1.3 |
| **H2 (Section)** | 1.5rem (24px) | 600 | `text-2xl font-semibold` | 1.3 |
| **H3 (Card Title)**| 1.25rem (20px) | 600 | `text-xl font-semibold` | 1.4 |
| **Body (Default)** | 1rem (16px) | 400 | `text-base` | 1.5 |
| **Small** | 0.875rem (14px)| 400 | `text-sm` | 1.5 |
| **Tiny/Label** | 0.75rem (12px) | 500 | `text-xs font-medium` | 1.2 |

---

## 3. Espaçamento (Spacing)

Baseado na escala de 4px do Tailwind. Use **sempre** múltiplos de 4.

| Nome | Tamanho | Class (Padding/Margin) | Uso Comum |
| :--- | :--- | :--- | :--- |
| **2px** | 0.125rem | `p-0.5` | Espaçamento mínimo (ícones). |
| **4px** | 0.25rem | `p-1` | Ajuste fino de alinhamento. |
| **8px** | 0.5rem | `p-2` | Padding interno de botões pequenos. |
| **12px** | 0.75rem | `p-3` | Padding interno de inputs. |
| **16px** | 1rem | `p-4` | Padding padrão de cards. |
| **24px** | 1.5rem | `p-6` | Margem entre seções. |
| **32px** | 2rem | `p-8` | Padding de containers grandes. |
| **64px** | 4rem | `p-16` | Margem de layout macro. |

---

## 4. Bordas e Formas (Borders & Shapes)

### 4.1. Radius (Arredondamento)
O AERO usa formas suavemente arredondadas para contrastar com a densidade de informação.

-   **Pequeno (sm):** `0.125rem` (`rounded-sm`) → Badges, Checkboxes.
-   **Médio (md):** `0.375rem` (`rounded-md`) → Botões, Inputs.
-   **Grande (lg):** `0.5rem` (`rounded-lg`) → Cards, Modais pequenos.
-   **Extra Grande (xl/2xl):** `0.75rem` / `1rem` → Modais principais, Painéis flutuantes.

### 4.2. Bordas (Strokes)
Geralmente sutis, usadas para separar planos sem alto contraste.
-   **Cor Padrão:** `primary-30` (`border-primary-30`) para separadores.
-   **Cor Ativa:** `brand` (`border-brand`) ou `neutral-40` para foco.

---

## 5. Iconografia (Iconography)

**Biblioteca:** [Lucide React](https://lucide.dev/)
**Estilo:** Line (Outline), Stroke `2px` (ou `1.5px` para ícones grandes).

### Guia de Uso
1.  **Tamanho:** Sempre envolva ícones em containers com tamanhos explícitos ou use classes `w-4 h-4` (16px), `w-5 h-5` (20px).
2.  **Cor:** Ícones geralmente herdam a cor do texto (`currentColor`), mas podem ter opacidade reduzida (`text-neutral-30`) quando inativos.
3.  **Significado:**
    -   `Plus` (+): Adicionar/Criar.
    -   `X` (x): Fechar/Remover.
    -   `ChevronDown`: Dropdown/Menu.
    -   `MoreHorizontal`: Menu de contexto (ações secundárias).

---

## 6. Componentes Especiais

### 6.1. Scrollbar
Customizada para não quebrar a imersão do tema escuro.
-   `width: 8px`
-   Track: `#17181D`
-   Thumb: `#2c2f47` (radius 4px)

### 6.2. Aurora Background
Um gradiente sutil para áreas de "vazio" ou destaque.
`background: linear-gradient(-45deg, #24262F, #1D1F26, #14141c, #202231);`

---

## 7. Próximos Passos (Governança)
1.  Qualquer nova cor deve ser adicionada ao `tailwind.config.js` antes de ser usada. Evite valores arbitrários (ex: `bg-[#123456]`).
2.  Use variáveis CSS sempre que possível para facilitar a manutenção de temas futuros.
