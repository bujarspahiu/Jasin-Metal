#!/usr/bin/env bash
set -e

echo ""
echo "============================================"
echo "  JASIN METAL — VPS Setup"
echo "============================================"
echo ""

# ── 1. Check .env ─────────────────────────────
if [ ! -f ".env" ]; then
  echo "[1/4] Krijimi i skedarit .env nga .env.example..."
  cp .env.example .env
  echo ""
  echo "  VËMENDJE: Hapeni skedarin .env dhe vendosni DATABASE_URL tuaj:"
  echo "  nano .env"
  echo ""
  echo "  Pas ndryshimit ekzekutoni sërish: bash setup.sh"
  exit 0
else
  echo "[1/4] Skedari .env ekziston — vazhdo."
fi

# ── 2. Install dependencies ───────────────────
echo ""
echo "[2/4] Instalimi i varësive (npm install)..."
npm install --legacy-peer-deps

# ── 3. Build frontend ─────────────────────────
echo ""
echo "[3/4] Ndërtimi i frontend-it (npm run build)..."
npm run build

# ── 4. Start with pm2 ─────────────────────────
echo ""
echo "[4/4] Nisja e serverit me pm2..."

if pm2 describe jasin-metal > /dev/null 2>&1; then
  echo "  Aplikacioni gjendet — ristartohet..."
  pm2 restart jasin-metal --env production
else
  echo "  Aplikacioni nuk gjendet — niset..."
  pm2 start ecosystem.config.cjs --env production
fi

pm2 save

echo ""
echo "============================================"
echo "  GATI! Aplikacioni po punon."
echo ""
echo "  Kontrollo statusin: pm2 status"
echo "  Shiko log-et:       pm2 logs jasin-metal"
echo "============================================"
echo ""
