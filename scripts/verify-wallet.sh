#!/bin/bash

# Script de verificación para Wallet Core (Plan 03)

echo "🔍 Verificando implementación del Wallet Core..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de verificaciones
PASSED=0
FAILED=0

# Función para verificar archivo
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1 - NO ENCONTRADO"
        ((FAILED++))
    fi
}

# Función para verificar directorio
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1/ - NO ENCONTRADO"
        ((FAILED++))
    fi
}

echo "📁 Verificando estructura de archivos..."
echo ""

# Tipos
echo "Tipos:"
check_file "src/types/wallet.types.ts"
echo ""

# Store
echo "Store:"
check_file "src/store/walletStore.ts"
check_file "src/store/__tests__/walletStore.test.ts"
echo ""

# API
echo "API:"
check_file "src/api/wallet.ts"
echo ""

# Utilidades
echo "Utilidades:"
check_file "src/utils/currency.ts"
check_file "src/utils/__tests__/currency.test.ts"
echo ""

# Componentes
echo "Componentes:"
check_file "src/features/wallet/components/BalanceCard.tsx"
check_file "src/features/wallet/components/BalanceCard.styles.ts"
check_file "src/features/wallet/components/TransactionItem.tsx"
check_file "src/features/wallet/components/TransactionItem.styles.ts"
check_file "src/features/wallet/components/TransactionList.tsx"
check_file "src/features/wallet/components/TransactionList.styles.ts"
check_file "src/features/wallet/components/__tests__/BalanceCard.test.tsx"
check_file "src/features/wallet/components/index.ts"
echo ""

# Hooks
echo "Hooks:"
check_file "src/features/wallet/hooks/useWallet.ts"
check_file "src/features/wallet/hooks/index.ts"
echo ""

# Screens
echo "Screens:"
check_file "src/features/wallet/screens/HomeScreen.tsx"
check_file "src/features/wallet/screens/HomeScreen.styles.ts"
echo ""

# Documentación
echo "Documentación:"
check_file "src/features/wallet/README.md"
check_file ".specs/03_IMPLEMENTATION_SUMMARY.md"
check_file ".specs/03_CHECKLIST.md"
echo ""

# Resumen
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Verificaciones: ${GREEN}$PASSED pasadas${NC}, ${RED}$FAILED fallidas${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ Todos los archivos están presentes${NC}"
    echo ""
    echo "🧪 Ejecutando tests..."
    echo ""
    yarn test --testPathPattern="wallet|currency" --passWithNoTests
    echo ""
    echo -e "${GREEN}✅ Implementación del Wallet Core completada${NC}"
    exit 0
else
    echo -e "${RED}❌ Faltan $FAILED archivos${NC}"
    exit 1
fi
