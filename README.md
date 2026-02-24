# KaSucos Landing Page

Projeto React + Vite para vitrine e venda de sucos, com foco em catálogo, combos e pedido rápido.

## Estrutura de pastas

```text
src/
├── components/
│   ├── layout/
│   └── sections/
├── data/
├── styles/
├── App.jsx
├── index.css
└── index.jsx
```

## Rodando localmente

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`: inicia servidor de desenvolvimento
- `npm run build`: gera build de produção
- `npm run preview`: serve build localmente

## CI/CD

- **CI (`.github/workflows/ci.yml`)**: valida apenas mudanças importantes do app (código, build/config e workflows), instalando dependências com `npm ci` e executando `npm run build`.
- **CD (`.github/workflows/cd.yml`)**: em push na `main`, gera o build e publica automaticamente no GitHub Pages.
- **Dependabot (`.github/dependabot.yml`)**: atualizações semanais para dependências npm e GitHub Actions.
