# AERO - Checklist de Estados de Interface (UI States)

Designers tendem a desenhar o "Caminho Feliz" (Happy Path). Este documento lista os estados "invisíveis" que precisam ser desenhados para garantir uma experiência robusta.

---

## 1. Estados Globais

### Loading (Carregamento)
O AERO preza por velocidade. Evite "Telas de Loading" que bloqueiam tudo.
-   **Skeleton UI:** Use blocos cinzas pulsantes (`animate-pulse`) que imitam o layout final (Sidebar + Header + Content).
-   **Optimistic UI:** Ao criar um card, mostre-o imediatamente no board antes mesmo do servidor confirmar. Se falhar, mostre um erro "toast" e reverta.
-   **Spinner:** Use apenas para ações pontuais dentro de botões (ex: "Salvando...").

### Error (Erro)
-   **Toast Notifications:** Para erros transitórios ("Falha ao salvar", "Sem conexão"). Devem ter botão "Tentar Novamente".
-   **Full Page Error:** Apenas para falhas catastróficas (404, 500). Desenho "lúdico" (ilustração) para reduzir a frustração.

---

## 2. Estados Específicos por Componente

### 2.1. Listas e Boards (Kanban/Issues)
-   **Empty State (Zero Data):**
    -   *Cenário:* Projeto novo sem issues.
    -   *Design:* Não deixe em branco. Ilustração sutil + Botão Call-to-Action (CTA) claro: "Criar primeira issue".
    -   *Copy:* "Tudo limpo por aqui. Que tal planejar o próximo passo?"
-   **Partial State:**
    -   *Cenário:* Busca sem resultados.
    -   *Design:* "Nenhuma issue encontrada para 'XYZ'". Sugerir limpar filtros.

### 2.2. Wiki & Editor
-   **Empty Doc:**
    -   *Design:* Deve encorajar a escrita. Mostrar placeholders de título ("Untitled") e corpo ("Pressione '/' para comandos...").
-   **Unsaved Changes:**
    -   *Design:* Indicador sutil no canto superior ("Saving..." -> "Saved").
-   **Lost Connection:**
    -   *Design:* Alerta amarelo não intrusivo: "Offline. Alterações serão salvas quando reconectar."

### 2.3. Modais e Formulários
-   **Validation Error:**
    -   *Design:* Bordas vermelhas nos inputs + Mensagem de texto abaixo do input. Evitar alertas genéricos no topo.
-   **Dirty State:**
    -   *Cenário:* Usuário tenta fechar modal com dados não salvos.
    -   *Ação:* Alerta de confirmação: "Descartar alterações?"

---

## 3. Estados de Permissão
-   **View Only:**
    -   *Cenário:* Usuário sem permissão de edição num projeto.
    -   *Design:* Remover botões de "Edit/Delete". Mostrar badge "Somente Leitura".
