# Features

## Dashboard

Aba inicial (`#tab-dashboard`). Mostra visão geral do aventureiro.

- **Summary bar** — Inventário (itens/kg) e Crédito (saldo)
- **Inventário** — listas de armas e consumíveis (preview)
- **Evolução** — gráfico canvas XP/Crédito com toggle e períodos
- **Status** — Vitalidade, Esforço, Foco, Determinação, Neural, Córtex (com bônus)
- **Categorias** — donut de tipo/raridade dos itens
- **Grupo** — aliados, jogadores, NPCs, pets, montarias, mercadores
- **Atributos** — donut com 6 atributos + legenda

## Progresso

`#tab-progress`. Header lado a lado:
- **Nível** (yellow) — começa em 0, teto `MAX_LEVEL=20`, XP acumula com crescimento 1.2× por nível
- **Estágio** (purple) — começa em 0, teto `MAX_STAGE=20`, crescimento 1.3×
- Botão `+` abre modal de adicionar XP; engrenagem abre config

Abaixo: lista de habilidades (custo opcional, ícone, descrição).

## Crédito

`#tab-credit`. Saldo total + moeda personalizável (nome e símbolo editáveis).

- Depositar / Retirar / Transferir / configurar moeda
- Log transacional (entrada/saída + descrição + data)
- Sidebar com últimas transações resumidas

## Perícias

`#tab-pericias`. Sistema de D&D-like:
- Lista unificada com categorias (Físico, Psique, Motora, Intelecto)
- Rank: destreinado → treinado → perito → mestre (custos 100/200/400 pts)
- Proficiências (card lateral): pill "Não possui" por padrão
- Treino semanal (interlúdio): gráfico canvas por dia

## Veículos

`#tab-vehicles`. Ficha de veículo.
- Integridade (HP) com barra segmentada de 28 tracks
- Tipo: 7 presets (carro, moto, caminhão, barco…) + personalizados
- 6 atributos: Velocidade, Aceleração, Manuseio, Frenagem, Nitro, Blindagem
- Foto customizada (upload, FileReader → data URL)
- Descrição livre
- Modificações/melhorias instaláveis (contagem X/10)

## Perfil

Acessível pelo ícone de pessoa no topbar.

- Header: avatar (trocável), nome, nível
- **Informações Pessoais**: nome, email, telefone, fuso, data de criação
- **Detalhes do Personagem**: linhagem, passado, arquétipo, caminho (campos livres, sem travessão)
- **Detalhes**: nível, XP, vida, crédito total, itens, habilidades
- **Notas**: notas do GM/sistema
- **Estatísticas**: contadores por categoria de item
- **Log**: renderiza `APP_CHANGELOG` com versões, datas, e bullets (tag feat/fix/ui)

## Placeholders

- `#tab-feitico` — biblioteca de feitiços (em construção)
- `#tab-pet` — companheiros/animais (em construção)
- Inventário como módulo separado — UI atual é provisória; planejado pra ser reconstruído do zero

## Save / Load

Botão de salvar no topbar:
- **Salvar Ficha** — exporta JSON com todos os dados, imagens embutidas, animação de arquivamento
- **Exportar Dados** — export em texto humano-legível (.txt)
- **Importar Ficha** — upload de JSON, valida e aplica

Autosave automático também rola em paralelo (ver [ARCHITECTURE.md](ARCHITECTURE.md)).

## Tema

Botão de lua/sol no topbar alterna entre dark e light. Persistido em `localStorage.rpg-theme`.

## Modais globais

Botão engrenagem em várias seções abre modais configuráveis para:
- Editar XP/nível manualmente
- Adicionar/editar item, habilidade, atributo, membro do grupo, conquista
- Configurar veículo (tipo, atributos, HP)
- Mudar moeda (nome + símbolo)
- Editar nota

Implementação em `openModal(type, id)` + `closeModal()`.
