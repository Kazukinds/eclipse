# Ficha Eclipse

Ficha de personagem RPG single-file — HTML + CSS + JS vanilla, sem dependências, sem build step. Rodável offline, instalável como PWA.

**Live:** https://kazukinds.github.io/ficha-rpg/

![Stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS-lightgrey)
![Deps](https://img.shields.io/badge/dependencies-zero-brightgreen)
![PWA](https://img.shields.io/badge/PWA-ready-blue)

## Como rodar

```bash
# abrir direto no navegador
start index.html     # Windows
open  index.html     # macOS
xdg-open index.html  # Linux

# ou servir local pra funcionalidade completa de PWA
python -m http.server 8000
npx serve .
```

## Instalação como app

- **Android (Chrome):** menu → "Instalar aplicativo"
- **iOS (Safari):** compartilhar → "Adicionar à tela de início"
- **Desktop (Chrome/Edge):** ícone de instalar na barra de endereço

O service worker cacheia tudo no primeiro load — depois disso funciona 100% offline.

## Estrutura

```
/
├── index.html              # App completo (HTML + CSS + JS inline, ~420KB)
├── manifest.webmanifest    # PWA manifest
├── sw.js                   # Service worker (network-first)
├── icons/                  # Ícones PWA (maskable, apple-touch, favicon)
├── docs/                   # Documentação técnica
└── LICENSE
```

## Documentação

- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — estrutura interna do `index.html`, estado global, ciclo de renderização
- **[docs/FEATURES.md](docs/FEATURES.md)** — o que cada aba faz (Dashboard, Perícias, Crédito, Veículos, Perfil…)
- **[docs/DEPLOY.md](docs/DEPLOY.md)** — deploy no GitHub Pages, PWA, invalidação de cache
- **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)** — como editar, convenções, onde achar cada seção
- **[docs/CHANGELOG.md](docs/CHANGELOG.md)** — histórico de versões (sincronizado com o Log no perfil do app)

## Licença

MIT — veja [LICENSE](LICENSE).
