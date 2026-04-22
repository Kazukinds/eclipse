# Development

Como editar o projeto sem quebrar nada.

## Setup

Zero dependências. Só precisa de um editor e de um navegador.

```bash
git clone https://github.com/Kazukinds/ficha-rpg.git
cd ficha-rpg
# opcional: servir local pra testar o PWA
python -m http.server 8000
```

## Estrutura do `index.html`

Linhas aproximadas (podem mudar conforme o código evolui — use `Ctrl+F`):

| Linha | Bloco |
|---|---|
| ~1–19 | `<head>`: meta, manifest, favicon |
| ~20–1700 | `<style>` com CSS |
| ~1700–2030 | `<body>` — sidebar, topbar, tabs |
| ~2030–4700 | `<script>` — estado + render + handlers |

### Achando seções rápido no CSS

Os blocos estão separados por comentários `═══ NOME ═══`. Pesquise por `═══` pra pular entre eles.

Principais:
- `═══ SIDEBAR ═══`
- `═══ MAIN ═══` (topbar, content)
- `═══ DUAL CARD / STATUS ═══`
- `═══ CREDIT TAB ═══`
- `═══ PROFILE ═══`
- `═══ MODAL ═══`
- `═══════════ RESPONSIVE ═══════════` (media queries mobile/tablet)
- `═══════════ APP SPLASH / INTRO ═══════════`
- `═══════════ POLIMENTO GERAL ═══════════`

### Achando seções no JS

- `═══ STATE ═══` — todas as variáveis globais
- `═══ NAV ═══` — troca de abas
- `═══ DASHBOARD LISTS ═══`, `═══ CHART ═══`, `═══ ATTRIBUTES ═══`, `═══ SKILLS ═══`, `═══ PERICIAS SYSTEM ═══`, `═══ VEHICLES ═══`, `═══ CREDIT ═══`
- `═══ AUTOSAVE (localStorage) + CONFIRMAR RECARGA ═══`
- `═══ CHANGELOG / ATUALIZAÇÕES ═══`
- `═══ PWA / SERVICE WORKER ═══`

## Convenções

### CSS
- Custom properties em `:root` (`--lime`, `--bg-card`, `--radius`…)
- Nomes de classe em kebab-case
- Mobile-first não é seguido — usa `@media (max-width:…)` pra overrides. Fica por enquanto.
- **Não** usar frameworks ou utility classes (Tailwind etc). O projeto é vanilla por design.

### JS
- Funções globais, sem módulos (o single-file não usa ES modules)
- `render*()` para reescrever DOM a partir do estado
- `applyAllData()` / `collectAllData()` para qualquer save/load
- Qualquer mutação em estado que quer virar autosave é automática (intervalo 8s)

### Commits

Seguir Conventional Commits:
- `feat:` nova funcionalidade
- `fix:` correção
- `refactor:` mudança interna sem alterar comportamento
- `chore:` manutenção (versão, limpeza)
- `revert:` desfaz algo

## Fluxo típico de mudança

1. Identifica a seção (HTML/CSS/JS) com `Ctrl+F` pelo marker `═══`
2. Edita direto no `index.html`
3. Abre o HTML localmente — valida no desktop
4. Testa responsive pelo DevTools (`F12 → toggle device`)
5. Se mexeu em algo que o usuário vai ver cacheado, bump `CACHE` em `sw.js`
6. Commit + push
7. Espera ~1 min, testa em `https://kazukinds.github.io/ficha-rpg/`

## Reset de dados no navegador

Pra testar o app "limpo":

```js
// cole no console do browser
localStorage.clear();
indexedDB.deleteDatabase('ficha-eclipse-db');
location.reload();
```

## Adicionando um changelog entry

Editar `APP_CHANGELOG` em `index.html` (perto do fim do `<script>`, procura por `const APP_CHANGELOG=`). Formato:

```js
{version:'v1.4',date:'2026-04-20',title:'Novos recursos',items:[
  {tag:'feat',text:'Descrição da feature'},
  {tag:'fix',text:'Correção'},
  {tag:'ui',text:'Mudança visual'},
]},
```

Também adicionar no `docs/HISTORICO.md` pro histórico no repo.

## Evitando escopo

Single-file tem limite. Quando o `index.html` passar de ~5000 linhas, considere extrair:
- `<style>` → `assets/styles.css`
- `<script>` → `assets/app.js`
- `const SVG` + `ICON_MAP` → `assets/icons.js`

Mas até lá, manter single-file simplifica deploy e debug.
