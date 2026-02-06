#!/bin/bash
export TMPDIR="$XDG_RUNTIME_DIR/app/$FLATPAK_ID"
WAYLAND_SOCKET=${WAYLAND_DISPLAY:-"wayland-0"}

# Use zypak to wrap Electron for sandbox compatibility
exec zypak-wrapper /app/lib/anidesk/AniDesk "$@"
