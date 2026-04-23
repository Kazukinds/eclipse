# Eclipse — Python Android wrapper

App Android self-contained em Python/Kivy. Carrega `assets/www/index.html` bundled via WebView nativo. Funciona 100% offline.

## Setup (Linux/WSL)

```bash
pip install --user buildozer cython==0.29.33
sudo apt install -y build-essential git zip unzip openjdk-17-jdk autoconf libtool pkg-config zlib1g-dev libncurses5-dev libncursesw5-dev libtinfo5 cmake libffi-dev libssl-dev
```

Windows: usar WSL (Ubuntu recomendado).

## Build

```bash
cd android-python
bash sync-assets.sh              # copia www/ do raiz
buildozer android debug          # gera APK debug
# ou release
buildozer android release
```

APK sai em `bin/eclipse-3.0-*-debug.apk` (ou release).

## Arquitetura

```
main.py                 # Kivy app, monta WebView via jnius
buildozer.spec          # config build
assets/www/             # HTML/JS/CSS bundled (gerado por sync)
sync-assets.sh          # copia raiz → assets antes de build
```

`main.py` usa `jnius` pra instanciar `android.webkit.WebView` nativo, carrega `file:///android_asset/www/index.html` e injeta como content view.

## Update conteúdo

Editou `index.html` na raiz? Roda `bash sync-assets.sh` e faz rebuild.
