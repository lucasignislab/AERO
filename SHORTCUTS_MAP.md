# AERO - Mapa de Atalhos de Teclado (Keyboard Shortcuts)

O AERO é projetado para ser "Keyboard-First". Este mapa deve guiar o design de *tooltips*, legendas em menus e "Empty States" que ensinam o usuário.

## 1. Global (Disponíveis em qualquer lugar)

| Atalho | Ação | Contexto de Design |
| :--- | :--- | :--- |
| `Cmd + K` | **Command Menu** (Abrir navegação) | Deve ser exaltado na "Search Bar" do topo. |
| `C` | **Create Issue** (Quick Capture) | Botão "+" na Sidebar deve ter tooltip "Press C". |
| `?` | **Ajuda / Lista de Atalhos** | Link discreto no rodapé ou menu de usuário. |
| `Esc` | **Fechar Modais / Cancelar** | Padrão universal. |
| `/` | **Focar na Busca** | Input de busca deve destacar a tecla "/" quando vazio. |

## 2. Editor de Texto (Wiki & Descrições)

Baseado no Tiptap. Segue o padrão Notion/Google Docs.

### Formatação
| Atalho | Ação |
| :--- | :--- |
| `Cmd + B` | **Negrito** |
| `Cmd + I` | *Itálico* |
| `Cmd + U` | <u>Sublinhado</u> |
| `Cmd + Shift + X` | ~~Tachado~~ |
| `Cmd + E` | `Código Inline` |
| `Cmd + K` | Inserir Link (Contextual ao Editor) |

### Blocos e Estrutura
| Atalho | Ação |
| :--- | :--- |
| `/` | **Slash Menu** (Abre menu de blocos) |
| `#` + `Space` | Título 1 (H1) |
| `##` + `Space` | Título 2 (H2) |
| `###` + `Space` | Título 3 (H3) |
| `-` + `Space` | Lista com marcadores |
| `1.` + `Space` | Lista numerada |
| `[]` + `Space` | Checkbox (Todo list) |
| `>` + `Space` | Citação (Blockquote) |
| `---` | Divisor Horizontal |

## 3. Navegação em Listas e Boards
*Ainda a implementar no código, mas essenciais para o Design prever focos.*

| Atalho | Ação |
| :--- | :--- |
| `J` / `K` | Mover foco para próximo/anterior item (Gmail style). |
| `Enter` | Abrir item focado. |
| `Space` | Atribuir a mim (Assign to Self) no item focado. |

---

## **Diretrizes para o Designer**

1.  **Descoberta Progressiva:** Não sobrecarregue o usuário. Mostre atalhos contextualmente.
    *   *Ex:* Ao passar o mouse sobre o botão "Salvar", o tooltip deve dizer "Salvar (Cmd+S)".
2.  **Visualização de Teclas:** Use o componente `<Kbd>Cmd</Kbd>` + `<Kbd>K</Kbd>` estilizado (borda sutil, fonte mono, fundo leve) para representar atalhos na UI.
