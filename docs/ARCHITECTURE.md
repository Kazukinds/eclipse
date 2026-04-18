# Arquitetura

Tudo vive em `index.html` (~420 KB, ~4500 linhas). A divisão interna segue 3 blocos:

```
index.html
├── <head>              meta tags, manifest, favicon
├── <style>             CSS (lines ~20–1700)
├── <body>              HTML (lines ~1700–2030)
└── <script>            JS (lines ~2030–4700)
```

## Estado global (JS)

Todo o estado é mantido em variáveis top-level, sem framework. Os principais:

| Variável | O que é |
|---|---|
| `playerLevel`, `playerXP`, `xpToNext` | Nível e progresso XP (teto `MAX_LEVEL=20`) |
| `playerStage`, `stageXP`, `stageToNext` | Estágio (teto `MAX_STAGE=20`) |
| `playerHP`, `playerHPMax`, `playerHPBonus` | Vitalidade |
| `playerStatus` | Esforço/Foco/Determinação/Neural/Córtex (cada um com `val`, `max`, `bonus`) |
| `playerGold`, `currencyName`, `currencySymbol` | Crédito/moeda |
| `attributes` | Array com 6 atributos (Físico, Psique, Motora, Intelecto, Neural, Córtex) |
| `skills` | Habilidades (adicionáveis) |
| `inventory`, `gridSlots`, `GRID_SIZE` | Inventário (módulo a ser reformulado em separado) |
| `creditLog`, `xpLog` | Histórico de transações e XP |
| `groupMembers`, `achievements` | Grupo e conquistas |
| `periciasState`, `profState`, `userPericias` | Perícias e proficiências |
| `trainLog` | Treino semanal |
| `vehicleState`, `customVehicles`, `modState` | Veículo ativo, presets custom, modificações |
| `profileData`, `profileAvatar` | Dados do aventureiro |

## Ciclo de renderização

Não tem virtual DOM. Cada mudança chama uma `renderX()` específica que reescreve o `innerHTML` da seção correspondente.

```
user ação → mutação no state → renderX() → innerHTML
```

Funções principais:
- `renderSummary()` — barra de sumário do dashboard
- `renderXP()` — barras de nível e estágio
- `renderStatus()` — cards de status
- `renderAttrs()` — donut + legenda de atributos
- `renderSkills()`, `renderProficiencias()`, `renderPericias()` — áreas de progressão
- `renderCredit()`, `renderGroup()`, `renderAch()` — sidebar/cards específicos
- `renderVehicleState()`, `renderMods()` — veículo
- `renderProfile()`, `renderProfileLog()` — aba de perfil
- `drawChart()` — canvas do gráfico de evolução (Bezier smooth)
- `refreshAll()` — chama todos os acima de uma vez (usada após load)

## Persistência

Dois caminhos em paralelo:

### Autosave (recuperação automática)
- Chave `ficha-eclipse-save` no `localStorage`
- Fallback em `IndexedDB` (mesma estrutura, store `ficha-eclipse-db`)
- Dispara a cada 8s, em `visibilitychange=hidden`, em `pagehide`, em `beforeunload`
- Restaura no `load`: tenta `localStorage` → cai pra `IndexedDB` → se ambos falham, inicia limpo

### Export/Import manual
- `saveToFile()` → `collectAllData()` → JSON blob → download
- `importFromFile()` → FileReader → `applyAllData(data)` → `refreshAll()`
- Imagens (avatar, foto do veículo) vão embutidas como data URL no JSON

## Migração de saves antigos

`applyAllData()` contém migrações inline. Caso atual:
- Saves pré-v1.1 nasciam com `playerLevel=20` e `playerStage=20`. Se o save tem esses valores e `XP=0` (nenhum progresso), trata como default antigo e zera.

## PWA / Service Worker

- `manifest.webmanifest` define nome, ícones, `display:standalone`
- `sw.js` usa **network-first** pra HTML/JS/CSS (pega versão nova quando online) e **cache-first** pra ícones/imagens
- Cache nomeado `ficha-eclipse-vN` — bump manual a cada deploy, o `activate` apaga o anterior automaticamente

## Responsividade

Classes base + media queries. O documento expõe `data-orientation` e `data-device` no `<html>` via `updateDeviceOrientation()`, redisparado em `resize`/`orientationchange`.

Breakpoints principais:
- `>1024px`: desktop, 3 colunas
- `1024px portrait`: tablet, sidebar 60px
- `<=640px portrait`: mobile, sidebar vira bottom-nav fixa
- `pointer:coarse`: alvos táteis ≥40px
- `prefers-reduced-motion`: animações desligadas
