#!/usr/bin/env bash
set -e

echo ""
echo "============================================"
echo "  JASIN METAL — VPS Setup"
echo "============================================"
echo ""

# ── 0. Create .env if missing ─────────────────
if [ ! -f ".env" ]; then
  echo "Krijimi i .env nga .env.example..."
  cp .env.example .env
  echo ""
  echo "  VËMENDJE: Skedari .env u krijua."
  echo "  Hapeni dhe vendosni DATABASE_URL tuaj:"
  echo ""
  echo "    nano .env"
  echo ""
  echo "  Pas ndryshimit ekzekutoni sërish: bash setup.sh"
  exit 0
fi

# ── 1. Validate DATABASE_URL ──────────────────
echo "[1/4] Kontrollimi i konfigurimit (.env)..."
set -a
# shellcheck disable=SC1091
source .env
set +a

if [ -z "${DATABASE_URL}" ]; then
  echo ""
  echo "  GABIM: DATABASE_URL nuk është vendosur në .env"
  echo "  Hapeni skedarin .env dhe vendosni:"
  echo "  DATABASE_URL=postgresql://user:password@localhost:5432/jasinmetal"
  echo ""
  exit 1
fi
echo "  DATABASE_URL: e konfiguruar."

# ── 2. Install dependencies ───────────────────
echo ""
echo "[2/4] Instalimi i varësive (npm install)..."
npm install --legacy-peer-deps
echo "  Varësitë u instaluan."

# ── 3. Build frontend ─────────────────────────
echo ""
echo "[3/4] Ndërtimi i frontend-it (npm run build)..."
npm run build
echo "  Frontend u ndërtua me sukses."

# ── 4. Start / restart with pm2 ───────────────
echo ""
echo "[4/4] Nisja e serverit me pm2..."

if pm2 describe jasin-metal > /dev/null 2>&1; then
  echo "  Aplikacioni gjendet — ristartohet..."
  pm2 restart jasin-metal --env production --update-env
else
  echo "  Aplikacioni nuk gjendet — niset..."
  pm2 start ecosystem.config.cjs --env production
fi

pm2 save

echo ""
echo "============================================"
echo "  GATI! Aplikacioni po punon."
echo ""
echo "  Statusi:  pm2 status"
echo "  Log-et:   pm2 logs jasin-metal"
echo "  Ndaloje:  pm2 stop jasin-metal"
echo "============================================"
echo ""
