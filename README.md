# Financeiro Estácio — Aplicação Expo (Documentação Técnica)

Este repositório contém uma aplicação mobile multiplataforma desenvolvida com Expo e React Native (Router baseado em arquivos). O propósito do sistema é demonstrar um painel financeiro simples com transações, orçamentos e inventário — pensado como um exercício técnico/atividade acadêmica.

Visão técnica resumida
- Plataforma: React Native (Expo SDK)
- Router: expo-router (file-based routing)
- Linguagem: TypeScript
- Dependências principais: expo, react-native, react, react-native-chart-kit, react-native-svg

Objetivos deste README
- Fornecer instruções técnicas de setup, execução e depuração.
- Documentar arquitetura, estrutura do projeto e decisões relevantes (theme, gerenciamento de dados em memória, modais "in-page").

Pré-requisitos
- Node.js (recomendado LTS — 18/20)
- npm ou yarn
- Expo CLI (opcional; `npx expo` funciona sem instalação global)

Instalação e execução (desenvolvimento)
1. Instale dependências:

```bash
npm install
```

2. Inicie o servidor Metro / Expo:

```bash
npx expo start
```

3. Abra o app no emulador ou dispositivo (opções apresentadas pelo Expo CLI):
- Expo Go (aplicativo mobile)
- Android emulator / iOS simulator

Scripts úteis (package.json)
- `npm run start` — inicia o Expo (alias para `expo start`).
- `npm run android` / `npm run ios` / `npm run web` — atalhos para abrir em plataformas específicas.
- `npm run lint` — executa ESLint via `expo lint`.
- `npm run reset-project` — script auxiliar (move o código de exemplo para `app-example` e cria diretório `app` limpo).

Arquitetura e pontos de interesse
- AppContext (arquivo: `app/data/AppContext.tsx`): gerencia dados em memória — transações, orçamentos, inventário. Implementação simples com React Context + useState.
- Páginas (diretório: `app/`): cada arquivo representa uma rota (ex.: `finance.tsx`, `budget.tsx`, `inventory.tsx`).
- Componentes compartilhados (`components/`): `themed-text.tsx`, `themed-view.tsx`, `chart.tsx`, entre outros. `ThemedView` implementa SafeAreaView + ScrollView quando `enableScroll` é true.
- Theming (`constants/theme.ts` + `hooks/use-theme-color.ts`): a aplicação foi configurada para utilizar apenas tema claro (light) para evitar diferenças de renderização entre dispositivos.

Decisões técnicas importantes
- Evitar aninhar `FlatList` (VirtualizedList) dentro de `ScrollView` com a mesma orientação: isso gera aviso e comportamento inesperado. Para páginas com lista virtualizada utilizamos `ThemedView enableScroll={false}`.
- Modais simples implementados como views condicionais (overlay absoluto) para manter compatibilidade com Expo Go sem dependências adicionais de modal manager.

Estrutura de pastas (resumo)
- `app/` — rotas e páginas.
  - `budget.tsx` — gerenciamento de orçamentos (lista, criação/edição em modal).
  - `finance.tsx` — painel financeiro, formulário de transação e lista de transações.
  - `inventory.tsx` — inventário simples.
- `app/data/` — `AppContext.tsx` com modelos e provedor de dados.
- `components/` — componentes UIs reutilizáveis (`themed-text.tsx`, `themed-view.tsx`, `chart.tsx`, `bottom-navbar.tsx`, etc.).
- `constants/` — `theme.ts` (cores e fontes).
- `hooks/` — hooks customizados (`use-theme-color.ts`, `use-color-scheme.ts`).

Como funciona o fluxo de dados
- Dados são mantidos no `AppDataProvider` (contexto). As páginas usam `useAppData()` para leitura/escrita.
- Operações (ex.: adicionar orçamento, atualizar inventário) alteram estados locais via `useState` e não persistem fora da sessão (simulação para a atividade acadêmica).

Testes, lint e qualidade
- ESLint está configurado via `eslint-config-expo`. Execute `npm run lint` e corrija warnings/erros conforme necessário.
- Não há testes unitários automatizados incluídos neste repositório por padrão; recomenda-se adicionar Jest + React Native Testing Library para cobertura de componentes e lógica.

Boas práticas e sugestões de evolução
- Persistência: substituir armazenamento em memória por AsyncStorage / SecureStore ou integrar backend (GraphQL/REST + banco de dados).
- Formularios: usar libs como `react-hook-form` para validação e performance em formulários mais complexos.
- Modal/UX: considerar `react-native-modal` ou Navigator-driven modals para comportamento mais consistente.
- Performance: memoização de listas e componentes grandes, usar keyExtractor em FlatList e otimizar renderItem.

Problemas conhecidos e como depurar
- Aviso VirtualizedLists: se aparecer, verifique se há um `ScrollView` (ou `ThemedView` com scroll habilitado) contendo um `FlatList`. Solução: desabilitar scroll no container ou trocar por `FlatList`-backed container.
- Input com máscara/formatos: atualmente a máscara de moeda é implementada manualmente em `app/finance.tsx` — replicar a função `formatCurrency` em outras páginas quando necessário.

Checklist de entrega (para avaliação)
- [ ] Código em TypeScript tipado sem erros de compilação.
- [ ] Linter executado e warnings tratados quando aplicável.
- [ ] README técnico (este arquivo) com instruções de execução e arquitetura.
- [ ] Demonstração funcional das features: transações, orçamentos e inventário.

Contribuindo
- Faça fork -> branch com nome descritivo -> commit claro -> pull request.
- Mantenha commits pequenos e focados (um propósito por commit).

Referências úteis
- Expo docs: https://docs.expo.dev/
- React Native: https://reactnative.dev/
- expo-router: https://expo.github.io/router/docs

Contato
- Caso tenha dúvidas sobre a implementação ou queira que eu explique alguma parte do código, informe qual arquivo/fluxo devo detalhar.

---
Gerado para uso em entrega acadêmica: foco em clareza técnica, reprodutibilidade e notas de evolução.
