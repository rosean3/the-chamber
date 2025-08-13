#!/bin/bash

# 🧪 Script de Teste para Deploy no Render
# Verifica se tudo está configurado corretamente

echo "🧪 TESTANDO CONFIGURAÇÃO PARA RENDER..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📁 Verificando arquivos necessários...${NC}"

# Verificar se os arquivos principais existem
FILES=(
    "render.yaml"
    "deploy-render.sh"
    "the-chamber-backend/server.js"
    "the-chamber-backend/package.json"
    "index.html"
    "styles.css"
    "script.js"
    "config.js"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file não encontrado${NC}"
        exit 1
    fi
done

echo -e "${BLUE}🔧 Verificando configuração do backend...${NC}"

# Verificar se o backend tem as dependências corretas
cd the-chamber-backend

if grep -q "googleapis" package.json; then
    echo -e "${GREEN}✅ googleapis no package.json${NC}"
else
    echo -e "${RED}❌ googleapis não encontrado no package.json${NC}"
fi

if grep -q "express" package.json; then
    echo -e "${GREEN}✅ express no package.json${NC}"
else
    echo -e "${RED}❌ express não encontrado no package.json${NC}"
fi

if grep -q "cors" package.json; then
    echo -e "${GREEN}✅ cors no package.json${NC}"
else
    echo -e "${RED}❌ cors não encontrado no package.json${NC}"
fi

cd ..

echo -e "${BLUE}🌐 Verificando configuração do frontend...${NC}"

# Verificar se o frontend tem as configurações corretas
if grep -q "SPREADSHEET_ID.*1PcAveY4HB4sAu-alSXaGArkqErY1Xa5J2VKZlM52xHs" config.js; then
    echo -e "${GREEN}✅ SPREADSHEET_ID_V1 configurado${NC}"
else
    echo -e "${RED}❌ SPREADSHEET_ID_V1 não encontrado${NC}"
fi

if grep -q "SPREADSHEET_ID_V2" config.js; then
    echo -e "${GREEN}✅ SPREADSHEET_ID_V2 configurado${NC}"
else
    echo -e "${RED}❌ SPREADSHEET_ID_V2 não encontrado${NC}"
fi

echo -e "${BLUE}📋 Verificando render.yaml...${NC}"

# Verificar se o render.yaml está correto
if grep -q "the-chamber-backend" render.yaml; then
    echo -e "${GREEN}✅ Backend configurado no render.yaml${NC}"
else
    echo -e "${RED}❌ Backend não configurado no render.yaml${NC}"
fi

if grep -q "the-chamber-frontend" render.yaml; then
    echo -e "${GREEN}✅ Frontend configurado no render.yaml${NC}"
else
    echo -e "${RED}❌ Frontend não configurado no render.yaml${NC}"
fi

echo -e "${BLUE}🔑 Verificando credenciais...${NC}"

# Verificar se o credentials.json existe
if [ -f "credentials.json" ]; then
    echo -e "${GREEN}✅ credentials.json encontrado${NC}"
    
    # Verificar se é um JSON válido
    if python3 -m json.tool credentials.json > /dev/null 2>&1; then
        echo -e "${GREEN}✅ credentials.json é um JSON válido${NC}"
    else
        echo -e "${RED}❌ credentials.json não é um JSON válido${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  credentials.json não encontrado${NC}"
    echo -e "${BLUE}💡 Você precisará configurar as credenciais no Render Dashboard${NC}"
fi

echo -e "${BLUE}🚀 Verificando script de deploy...${NC}"

# Verificar se o script de deploy é executável
if [ -x "deploy-render.sh" ]; then
    echo -e "${GREEN}✅ deploy-render.sh é executável${NC}"
else
    echo -e "${RED}❌ deploy-render.sh não é executável${NC}"
    echo -e "${BLUE}💡 Execute: chmod +x deploy-render.sh${NC}"
fi

echo ""
echo -e "${GREEN}🎉 TESTE CONCLUÍDO!${NC}"
echo ""
echo -e "${BLUE}📋 PRÓXIMOS PASSOS:${NC}"
echo -e "${BLUE}   1. Execute: ./deploy-render.sh${NC}"
echo -e "${BLUE}   2. Faça login no Render${NC}"
echo -e "${BLUE}   3. Configure GOOGLE_APPLICATION_CREDENTIALS_JSON no Dashboard${NC}"
echo -e "${BLUE}   4. Aguarde o deploy (5-10 minutos)${NC}"
echo ""
echo -e "${GREEN}✨ Tudo configurado para deploy no Render!${NC}" 