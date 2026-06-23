#!/bin/bash
# Sync web assets → android-widgets APK bundle.
# Rodar antes de build release.
set -e
SRC=$(dirname "$(realpath "$0")")/..
DST=$(dirname "$(realpath "$0")")/app/src/main/assets/www
rm -rf "$DST"
mkdir -p "$DST/icons"
cp "$SRC/index.html" "$DST/"
# weapon-test.html é apenas de dev — não vai pro bundle do APK.
cp "$SRC/manifest.webmanifest" "$DST/"
cp "$SRC/sw.js" "$DST/"
cp -r "$SRC/icons/." "$DST/icons/"
# Grimório (card mockingbird) — só os arquivos usados, sem uploads de dev
mkdir -p "$DST/aaaah"
cp "$SRC/aaaah/mockingbird-challenge.dc.html" "$DST/aaaah/"
cp "$SRC/aaaah/support.js" "$DST/aaaah/"
cp "$SRC/aaaah/CardBack.dc.html" "$DST/aaaah/" 2>/dev/null || true
cp "$SRC"/aaaah/*.svg "$DST/aaaah/" 2>/dev/null || true
mkdir -p "$DST/icons/weapons"
cp -r "$SRC/icons/weapons/." "$DST/icons/weapons/" 2>/dev/null || true
echo "Bundled → $DST"
