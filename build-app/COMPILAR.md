# Ficha Eclipse — build para Android / iOS

Dois caminhos, escolha um.

## Caminho 1 — Capacitor (recomendado)

Empacota o PWA como app nativo Android + iOS.

### Requisitos
- Node.js 18+ (já: v24.14.1)
- JDK 17
- Android Studio (Hedgehog 2023.1.1+)
- Para iOS: macOS + Xcode 14+

### Primeira vez

```bash
cd build-app
npm install                        # instala Capacitor + deps
npm run sync-web                   # copia webroot pra www/
npx cap add android                # adiciona plataforma Android
# (opcional macOS) npx cap add ios
```

### A cada mudança no projeto

```bash
cd build-app
npm run build                      # sync-web + cap sync
npm run open:android               # abre Android Studio
```

Dentro do Android Studio:
- Menu `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
- APK gerado em `android/app/build/outputs/apk/debug/app-debug.apk`
- Instalar no device: `adb install -r android/app/build/outputs/apk/debug/app-debug.apk`

### Build APK direto pela linha de comando (sem abrir IDE)

```bash
npm run apk:debug                  # APK debug
# assinar release: configure keystore em android/app/build.gradle, depois:
npm run apk:release
```

### Metadados do app

Editáveis em `capacitor.config.json`:
- `appId`: `com.kazuki.fichaeclipse` (namespace Java — NÃO muda após publicar)
- `appName`: `Ficha Eclipse`
- cores de splash/status configuradas via plugins

Ícones Android são gerados em `android/app/src/main/res/`. Substitua os `mipmap-*/ic_launcher*.png` pelos do diretório `icons/` do projeto (ou use `npx @capacitor/assets generate --iconPath ../icons/icon-512.png`).

---

## Caminho 2 — WebToApp (zero-código, via celular)

Repo: https://github.com/shiahonb777/web-to-app

Para quem quer montar no próprio Android sem PC.

### Passos

1. **Baixe o APK WebToApp**: releases do repo oficial (ou compile com Android Studio + JDK 17).
2. **Zipe o webroot**:
   ```bash
   cd build-app
   npm run sync-web
   # zipe a pasta www/ — qualquer utilitário serve
   ```
3. **Transfira o .zip pro Android** (USB, Google Drive, Telegram).
4. No app WebToApp:
   - `Criar App HTML`
   - Selecionar a pasta `www/` extraída
   - Entry file: `index.html`
   - Configurar nome, ícone, splash
   - `Build APK`

Resultado: APK standalone.

---

## Caminho 3 — PWA direta (mais rápida, sem build)

Se o site está hospedado (GitHub Pages, Vercel, Netlify), acesse no Chrome Android → menu → **Instalar app**. O PWA já tem `manifest.webmanifest` + service worker válidos. Vira um app "quase nativo" sem APK.

Para hospedar grátis:
```bash
# já tem git — usar GitHub Pages:
git push origin main
# ligar Pages em Settings → Pages → Branch main → /(root)
```

---

## Troubleshooting

- **Erro JDK não encontrado**: instalar [Temurin JDK 17](https://adoptium.net/) e setar `JAVA_HOME`.
- **Gradle trava**: `cd android && ./gradlew --stop` e relançar.
- **Ícone de baixa qualidade**: rodar `npx @capacitor/assets generate --iconPath ../icons/icon-512.png --splashPath ../icons/icon-512.png`.
- **"app ícone em branco"**: verificar `icons/icon-maskable-*.png` existem e usar purpose `maskable`.

## Versionamento

- `package.json` → `version`
- Android: `android/app/build.gradle` → `versionCode` e `versionName`
- iOS: `ios/App/App.xcodeproj/project.pbxproj` → `MARKETING_VERSION`
