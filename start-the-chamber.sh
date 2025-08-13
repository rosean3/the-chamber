#!/bin/bash

# 🚀 Script para iniciar The Chamber (Backend + Frontend)
# Execute com: ./start-the-chamber.sh

echo "🚀 Iniciando The Chamber..."
echo "================================"

# Verifica se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado!"
    echo "💡 Instale Node.js: https://nodejs.org/"
    exit 1
fi

# Verifica se Python está instalado
if ! command -v python &> /dev/null; then
    echo "❌ Python não está instalado!"
    exit 1
fi

# Verifica se as dependências do backend estão instaladas
if [ ! -d "the-chamber-backend/node_modules" ]; then
    echo "📦 Instalando dependências do backend..."
    cd the-chamber-backend
    npm install
    cd ..
fi

# Verifica se o arquivo credentials.json existe
if [ ! -f "the-chamber-backend/credentials.json" ]; then
    echo "⚠️  Copiando credentials.json para o backend..."
    cp credentials.json the-chamber-backend/
fi

echo "🔄 Iniciando backend em background..."
cd the-chamber-backend
npm start &
BACKEND_PID=$!
cd ..

# Aguarda o backend inicializar
echo "⏳ Aguardando backend inicializar..."
sleep 5

# Verifica se o backend está funcionando
if curl -s http://localhost:3000/ > /dev/null; then
    echo "✅ Backend iniciado com sucesso!"
else
    echo "❌ Falha ao iniciar backend"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "🌐 Iniciando frontend..."
echo "================================"
echo "📱 Frontend: http://localhost:8000"
echo "🔧 Backend:  http://localhost:3000"
echo "📊 API Status: http://localhost:3000/api/status"
echo ""
echo "💡 Para parar, pressione Ctrl+C"
echo "================================"

# Inicia o frontend
python -m http.server 8000

# Função de limpeza
cleanup() {
    echo ""
    echo "🛑 Encerrando The Chamber..."
    kill $BACKEND_PID 2>/dev/null
    echo "✅ Encerrado!"
    exit 0
}

# Captura Ctrl+C
trap cleanup SIGINT

# Aguarda indefinidamente
wait 