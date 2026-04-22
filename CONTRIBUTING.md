# Contribuindo com a Ficha Eclipse

Obrigado pelo interesse! Esse projeto é **single-file HTML/CSS/JS vanilla, sem build step**. Simples de rodar, fácil de hackear.

## Como rodar localmente

```bash
git clone https://github.com/Kazukinds/eclipse.git
cd eclipse

# opção 1: abrir direto
start index.html          # Windows
open  index.html          # macOS
xdg-open index.html       # Linux

# opção 2: servir pra testar PWA + SW (recomendado)
python -m http.server 8000
# ou
npx serve .
```

PWA e service worker só funcionam 100% em `http://`/`https://` — `file://` desativa várias features.

## Estrutura do projeto

```
/
├── index.html              # App principal (~9.000 linhas, tudo inline)
├── biblioteca.html         # Compêndio de lore (standalone)
├── sw.js                   # Service worker (network-first)
├── manifest.webmanifest    # PWA manifest
├── icons/                  # Ícones PWA
├── widgets/                # Widgets HTML (dashboard interno)
├── android-widgets/        # App Android nativo (home-screen widgets)
├── docs/                   # Documentação técnica
└── .github/                # CI + templates
```

## Convenções de código

### CSS
- Tokens de cor no `:root` em [index.html:24](index.html#L24) (dark) e `[data-theme="light"]` em [index.html:2998](index.html#L2998).
- Classes em kebab-case, seções separadas por `/* ═══ NOME ═══ */`.
- Media queries: `400 / 480 / 640 / 768 / 900 / 1024 / 1100 / 1200`.
- **Não** adicione Tailwind, CSS-in-JS, nem build step.

### JS
- Sem frameworks. Vanilla puro.
- `const`/`let`. Arrow functions OK. Sem imports (exceto tiks via CDN).
- `try{...}catch(_){}` em pontos de integração opcional (ex. `window.sfx`).
- Estado principal: variáveis globais no escopo do `<script>`. Persistência via `localStorage` chave `ficha-eclipse-save`.

### Commits
Conventional Commits em **português**:
- `feat:` nova funcionalidade
- `fix:` correção
- `style:` CSS/visual (sem mudança de lógica)
- `refactor:` reorganização sem mudança de comportamento
- `perf:` otimização
- `docs:` documentação
- `chore:` build/CI/config

Exemplo:
```
feat(audio): som de moeda ao depositar crédito
```

## Pull Requests

1. Fork o repo
2. Branch a partir de `main`: `git checkout -b feat/minha-feature`
3. Faça mudanças pequenas e focadas
4. Teste em **mobile vertical** + **desktop** antes de abrir PR
5. Siga o `PULL_REQUEST_TEMPLATE.md` (preenchido automaticamente)

### Antes de abrir PR
- [ ] Testei em Chrome desktop
- [ ] Testei em mobile (Chrome Android ou DevTools responsive)
- [ ] Alternei modo claro/escuro
- [ ] `localStorage.getItem('ficha-eclipse-save')` antigo ainda carrega
- [ ] Sem warnings novos no console

## Reportando bugs

Use o [template de bug](.github/ISSUE_TEMPLATE/bug_report.yml). Quanto mais detalhe (plataforma, passos, screenshot), mais rápido corrijo.

## Sugestões

Use o [template de feature](.github/ISSUE_TEMPLATE/feature_request.yml). Mockup ou referência visual acelera muito.

## Dúvidas

Abra uma [discussion](https://github.com/Kazukinds/eclipse/discussions) — issues são pra bugs/features, discussions pra conversar.

## Licença

Ao contribuir, você concorda que seu código será licenciado sob a [MIT](LICENSE).
