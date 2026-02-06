#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
VERSION=$(node -e "console.log(require('$PROJECT_DIR/package.json').version)")

echo "==> Сборка AniDesk v${VERSION} в Flatpak"

# 1. Собираем Svelte-бандл
echo "==> [1/4] Сборка Svelte..."
cd "$PROJECT_DIR"
npm run build

# 2. Упаковываем Electron
echo "==> [2/4] Упаковка Electron..."
npx electron-forge package

# 3. Генерируем иконки если отсутствуют
echo "==> [3/4] Подготовка ресурсов..."
cd "$SCRIPT_DIR"
if [ ! -f anidesk-icon-256.png ]; then
    cp "$PROJECT_DIR/public/assets/icons/anidesk-icon.png" anidesk-icon-512.png
    magick anidesk-icon-512.png -resize 256x256 anidesk-icon-256.png
    magick anidesk-icon-512.png -resize 128x128 anidesk-icon-128.png
    magick anidesk-icon-512.png -resize 64x64 anidesk-icon-64.png
fi

# 4. Собираем Flatpak
echo "==> [4/4] Сборка Flatpak..."
flatpak-builder --force-clean --repo=repo build-dir com.ds1nc.anidesk.yml

# Создаём .flatpak бандл
BUNDLE_NAME="anidesk-${VERSION}-x86_64.flatpak"
flatpak build-bundle repo "$BUNDLE_NAME" com.ds1nc.anidesk

echo ""
echo "==> Готово! Flatpak-бандл: flatpak/${BUNDLE_NAME}"
echo "    Размер: $(du -h "$BUNDLE_NAME" | cut -f1)"
echo ""
echo "    Установка:  flatpak install ${BUNDLE_NAME}"
echo "    Запуск:     flatpak run com.ds1nc.anidesk"
