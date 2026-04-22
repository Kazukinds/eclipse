# Deploy

## GitHub Pages

Hospedado em **https://kazukinds.github.io/ficha-rpg/** direto do branch `main`.

O Pages detecta commits novos no `main` automaticamente e faz build em ~1 minuto.

### Verificar status do build

```bash
gh api repos/Kazukinds/ficha-rpg/pages/builds/latest | jq .status
# "building" → "built"
```

### Deploy local → remoto

```bash
git add -A
git commit -m "feat: descrição"
git push origin main
# Pages faz o resto
```

## PWA (Progressive Web App)

O app é instalável — `manifest.webmanifest` declara nome, ícones, display mode.

### Requisitos pra PWA funcionar
- Servido via HTTPS (Pages garante)
- `manifest.webmanifest` válido
- Service worker registrado (`sw.js`)
- Ícones 192×192 e 512×512 (em `icons/`)

### Testar instalação
- **Chrome Android**: menu → "Instalar aplicativo"
- **Safari iOS**: compartilhar → "Adicionar à tela de início" (limitado — iOS não suporta `display:fullscreen`)
- **Chrome Desktop**: ícone de instalar na barra de endereço, ou `chrome://apps`

## Service Worker — invalidação de cache

O `sw.js` tem uma constante:

```js
const CACHE='ficha-eclipse-vN';
```

**Toda vez que fizer deploy com mudanças**, bumpe `vN` → `v(N+1)`. O handler `activate` deleta automaticamente qualquer cache com nome diferente:

```js
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>
    Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
  ).then(()=>self.clients.claim()))
});
```

### Estratégia de cache

- **HTML/JS/CSS** → `network-first` (tenta rede; cai pro cache offline)
- **Ícones e imagens** → `cache-first` (pega do cache; baixa se não tiver)

Isso garante que mudanças no app chegam logo ao usuário, mas ícones e imagens grandes não são re-baixados toda vez.

## Atualização manual no celular (quando cache travar)

Se o cache travar e o usuário continuar vendo versão antiga mesmo após o deploy:

1. **PWA instalada (Android)**: Ajustes do app → Armazenamento → Limpar dados
2. **iOS**: remover da tela inicial + adicionar de novo
3. **Navegador**: desabilitar SW em DevTools (`Application → Service Workers → Unregister`) + hard reload

Em geral, bumpar o `CACHE` no `sw.js` já resolve sem precisar desses passos.

## Rodar localmente

```bash
# opção 1: abrir direto (funciona pra tudo exceto SW)
start index.html  # Windows

# opção 2: servir com HTTP (necessário pra testar SW/PWA)
python -m http.server 8000
# ou
npx serve .
```

SW só funciona em `localhost` ou `https://` — abrir via `file://` não registra service worker.
