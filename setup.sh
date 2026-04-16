#!/usr/bin/env bash
set -e

echo ""
echo "============================================"
echo "  JASIN METAL — VPS Setup"
echo "============================================"
echo ""

# ── 0. Load and validate environment ─────────
if [ -f ".env" ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

if [ -z "${DATABASE_URL}" ]; then
  echo "  GABIM: DATABASE_URL nuk është konfiguruar."
  echo ""
  echo "  Krijo skedarin .env:"
  echo "    cp .env.example .env"
  echo "    nano .env"
  echo ""
  echo "  Pastaj vendos:"
  echo "    DATABASE_URL=postgresql://user:password@localhost:5432/jasinmetal"
  echo ""
  echo "  Dhe ekzekuto sërish: bash setup.sh"
  exit 1
fi
echo "[0/3] Konfigurimi: OK (DATABASE_URL e vendosur)"

# ── 1. Install dependencies ───────────────────
echo ""
echo "[1/3] Instalimi i varësive..."
npm install --legacy-peer-deps
echo "      Varësitë u instaluan."

# ── 2. Build frontend ─────────────────────────
echo ""
echo "[2/3] Ndërtimi i frontend-it..."
npm run build
echo "      Frontend u ndërtua me sukses."

# ── 3. Start / restart with pm2 ───────────────
echo ""
echo "[3/3] Nisja e serverit me pm2..."

if pm2 describe jasin-metal > /dev/null 2>&1; then
  pm2 restart jasin-metal --env production --update-env
  echo "      Aplikacioni u ristart."
else
  pm2 start ecosystem.config.cjs --env production
  echo "      Aplikacioni u nis."
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
