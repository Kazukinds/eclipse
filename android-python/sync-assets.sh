#!/bin/bash
# Sync web → android-python/assets/www
set -e
SRC=$(dirname "$(realpath "$0")")/..
DST=$(dirname "$(realpath "$0")")/assets/www
rm -rf "$DST"
mkdir -p "$DST/icons"
cp "$SRC/index.html" "$DST/"
cp "$SRC/biblioteca.html" "$DST/"
cp "$SRC/manifest.webmanifest" "$DST/"
cp "$SRC/sw.js" "$DST/"
cp -r "$SRC/icons/." "$DST/icons/"
echo "Bundled → $DST"
