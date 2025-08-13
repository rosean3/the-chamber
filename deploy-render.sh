#!/bin/bash

# 🚀 Script de Deploy Automático para Render
# Deploy gratuito do The Chamber Backend + Frontend

set -e

echo "🚀 INICIANDO DEPLOY NO RENDER (GRATUITO)..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se o Render CLI está instalado
if ! command -v render &> /dev/null; then
    echo -e "${YELLOW}⚠️  Render CLI não encontrado. Instalando...${NC}"
    
    # Instalar Render CLI
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -s https://api.render.com/downloads/cli/linux | bash
        export PATH="$HOME/.local/bin:$PATH"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        curl -s https://api.render.com/downloads/cli/macos | bash
        export PATH="$HOME/.local/bin:$PATH"
    else
        echo -e "${RED}❌ Sistema operacional não suportado${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Render CLI instalado/verificado${NC}"

# Verificar se está logado no Render
if ! render whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Faça login no Render primeiro:${NC}"
    echo -e "${BLUE}🔑 Execute: render login${NC}"
    echo -e "${BLUE}📱 Abra o navegador e faça login${NC}"
    render login
fi

echo -e "${GREEN}✅ Logado no Render${NC}"

# Criar diretório temporário para deploy
TEMP_DIR="render-deploy-temp"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

echo -e "${BLUE}📁 Preparando arquivos para deploy...${NC}"

# Copiar arquivos do backend
cp -r the-chamber-backend "$TEMP_DIR/"
cp render.yaml "$TEMP_DIR/"

# Copiar arquivos do frontend
cp index.html "$TEMP_DIR/"
cp styles.css "$TEMP_DIR/"
cp script.js "$TEMP_DIR/"
cp config.js "$TEMP_DIR/"

# Criar package.json para o frontend (necessário para o Render)
cat > "$TEMP_DIR/package.json" << 'EOF'
{
  "name": "the-chamber-frontend",
  "version": "1.0.0",
  "description": "Frontend do The Chamber - Experimento Individual",
  "scripts": {
    "start": "npx serve -s . -l 10000"
  },
  "dependencies": {
    "serve": "^14.2.0"
  }
}
EOF

# Criar .renderignore
cat > "$TEMP_DIR/.renderignore" << 'EOF'
node_modules/
*.log
.env
.env.local
.DS_Store
.git/
.gitignore
README.md
*.md
deploy-*.sh
render.yaml
EOF

cd "$TEMP_DIR"

echo -e "${BLUE}🔧 Configurando variáveis de ambiente...${NC}"

# Criar arquivo de configuração do backend
cat > the-chamber-backend/.env << EOF
NODE_ENV=production
PORT=10000
SPREADSHEET_ID_V1=1PcAveY4HB4sAu-alSXaGArkqErY1Xa5J2VKZlM52xHs
SPREADSHEET_ID_V2=1iEZZ6iUJqmyp8FDGZXw4nX_Q_1XQJWFmH1q3S0LenOg
CORS_ORIGIN=*
EOF

echo -e "${YELLOW}⚠️  IMPORTANTE: Configure as credenciais do Google Sheets no Render Dashboard${NC}"
echo -e "${BLUE}📋 Variáveis necessárias:${NC}"
echo -e "${BLUE}   - GOOGLE_APPLICATION_CREDENTIALS_JSON (conteúdo do credentials.json)${NC}"

echo -e "${BLUE}🚀 Iniciando deploy no Render...${NC}"

# Deploy usando render.yaml
if render deploy --file render.yaml; then
    echo -e "${GREEN}✅ Deploy iniciado com sucesso!${NC}"
    echo -e "${BLUE}📊 Acompanhe o progresso em: https://dashboard.render.com${NC}"
    echo -e "${BLUE}⏳ O deploy pode levar alguns minutos...${NC}"
    
    # Aguardar um pouco e verificar status
    sleep 10
    
    echo -e "${BLUE}🔍 Verificando status dos serviços...${NC}"
    render ps
    
else
    echo -e "${RED}❌ Erro no deploy${NC}"
    echo -e "${YELLOW}💡 Dica: Verifique se você tem permissões para criar serviços no Render${NC}"
    exit 1
fi

cd ..

echo -e "${GREEN}🎉 Deploy configurado!${NC}"
echo -e "${BLUE}📋 Próximos passos:${NC}"
echo -e "${BLUE}   1. Configure GOOGLE_APPLICATION_CREDENTIALS_JSON no Render Dashboard${NC}"
echo -e "${BLUE}   2. Aguarde o deploy completar (5-10 minutos)${NC}"
echo -e "${BLUE}   3. Teste a API: https://the-chamber-backend.onrender.com/api/status${NC}"
echo -e "${BLUE}   4. Acesse o frontend: https://the-chamber-frontend.onrender.com${NC}"

# Limpar arquivos temporários
rm -rf "$TEMP_DIR"

echo -e "${GREEN}✨ Deploy no Render configurado com sucesso!${NC}" 