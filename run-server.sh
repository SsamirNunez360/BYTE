#!/usr/bin/env bash
set -e

# Cambiar al directorio del script
cd "$(dirname "$0")"

PORT="${PORT:-3000}"
HOSTNAME="${HOSTNAME:-0.0.0.0}"

echo "Instalando dependencias..."
npm install

echo "Eliminando build anterior..."
rm -rf .next

echo "Iniciando servidor de desarrollo en http://${HOSTNAME}:${PORT}"
exec npm run dev -- --port "${PORT}" --hostname "${HOSTNAME}"
