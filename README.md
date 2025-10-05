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
