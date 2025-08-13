## 🎯 **The Chamber - Setup Completo**

## 🚀 **Sistema Funcionando com Google Sheets Real!**

### ✅ **O que foi implementado:**

1. **Frontend Web** - Interface completa do jogo
2. **Backend Node.js** - API para integração com Google Sheets
3. **Integração Real** - Dados são salvos diretamente no Google Sheets
4. **Configuração Automática** - Credenciais carregadas automaticamente
5. **Duas Versões** - V1 (original) e V2 (atualizada) com planilhas separadas

---

## 🎮 **Versões Disponíveis**

### **VERSÃO 1 (Original)**
- **Planilha**: `1PcAveY4HB4sAu-alSXaGArkqErY1Xa5J2VKZlM52xHs`
- **Casos**: Distribuição equilibrada de gêneros
- **Versão**: 1
- **Características**: Casos originais do experimento

### **VERSÃO 2 (Atualizada)**
- **Planilha**: `1iEZZ6iUJqmyp8FDGZXw4nX_Q_1XQJWFmH1q3S0LenOg`
- **Casos**: Foco em suspeitos masculinos
- **Versão**: 3
- **Características**: Casos atualizados com nova distribuição de gêneros

---

## 🛠️ **Instalação e Configuração**

### **1. Pré-requisitos**
```bash
# Verificar se Node.js está instalado
node --version  # Deve ser 16+

# Verificar se Python está instalado
python --version  # Deve ser 3.6+
```

### **2. Estrutura de Arquivos**
```
the_chamber2/
├── index.html                    # Frontend principal com seleção de versão
├── styles.css                    # Estilos CSS
├── script.js                     # Lógica do jogo + seleção de versão
├── config.js                     # Configurações (ambas as planilhas)
├── credentials.json              # Credenciais Google Cloud
├── start-the-chamber.sh          # Script de inicialização
├── the-chamber-backend/          # Pasta do backend
│   ├── server.js                 # Servidor Node.js (suporte a 2 planilhas)
│   ├── package.json              # Dependências
│   ├── credentials.json          # Credenciais (cópia)
│   └── test-backend.js           # Script de teste
└── SETUP_COMPLETO.md             # Este arquivo
```

---

## 🚀 **Como Executar**

### **Opção 1: Script Automático (Recomendado)**
```bash
./start-the-chamber.sh
```

### **Opção 2: Manual**
```bash
# Terminal 1: Backend
cd the-chamber-backend
npm start

# Terminal 2: Frontend  
python -m http.server 8000
```

---

## 🌐 **URLs de Acesso**

- **Frontend (Jogo)**: http://localhost:8000
- **Backend (API)**: http://localhost:3000
- **Status da API**: http://localhost:3000/api/status

---

## 🎯 **Fluxo do Jogo**

1. **Seleção de Versão** - Escolha entre V1 ou V2
2. **Introdução** - Explicação do experimento
3. **Demografia** - Coleta de dados do participante
4. **Jogo** - 6 rodadas por caso
5. **Revelação** - Resultado real do caso
6. **Próximo Caso** - Continua até completar todos
7. **Finalização** - Dados salvos na planilha correta

---

## 🧪 **Testando o Sistema**

### **1. Teste do Backend**
```bash
cd the-chamber-backend
node test-backend.js
```

### **2. Teste da API**
```bash
# Status do servidor
curl http://localhost:3000/

# Status do Google Sheets (ambas as versões)
curl http://localhost:3000/api/status

# Envio de dados de teste V1
curl -X POST http://localhost:3000/api/sheets/append \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      ["TESTE_V1", "P1", "1", "25", "Feminino", "3", "1", "Real", "Feminino", "2.5", "0", "0", "0", "1", "1"]
    ],
    "spreadsheetId": "1PcAveY4HB4sAu-alSXaGArkqErY1Xa5J2VKZlM52xHs"
  }'

# Envio de dados de teste V2
curl -X POST http://localhost:3000/api/sheets/append \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      ["TESTE_V2", "P1", "1", "30", "Masculino", "4", "1", "Real", "Masculino", "3.2", "0", "0", "0", "1", "3"]
    ],
    "spreadsheetId": "1iEZZ6iUJqmyp8FDGZXw4nX_Q_1XQJWFmH1q3S0LenOg"
  }'
```

---

## 📊 **Como Funciona a Integração**

### **1. Fluxo de Dados**
```
Jogador faz decisão → Frontend coleta dados → Backend recebe → Google Sheets salva
```

### **2. Estrutura dos Dados Salvos**
Cada linha contém 15 colunas:
1. **ID_Sessao** - Identificador único da sessão
2. **ID_Participante** - Identificador do participante
3. **Num_Rodada** - Número da rodada (1-6)
4. **Idade** - Idade do participante
5. **Genero_Participante** - Gênero do participante
6. **Experiencia_com_Jogos** - Nível de experiência (1-5)
7. **ID_Caso** - Identificador do caso
8. **Tipo_de_Historia** - Tipo da história (Real/Fictícia)
9. **Genero_Suspeito** - Gênero do suspeito
10. **Tempo_de_Decisao_s** - Tempo de decisão em segundos
11. **Decisao_Final** - Decisão final (0=Inocente, 1=Culpado)
12. **Mudanca_de_Voto** - Se houve mudança de voto (0=Não, 1=Sim)
13. **Resultado_Real_Caso** - Resultado real do caso
14. **Num_Jogadores_Sessao** - Número de jogadores na sessão
15. **Versão** - Versão do experimento

### **3. Salvamento Automático**
- **A cada cenário**: Dados são enviados para Google Sheets
- **Backup local**: Dados também são salvos no localStorage
- **Notificações**: Usuário recebe feedback visual do salvamento

---

## 🔧 **Troubleshooting**

### **Problema: Backend não inicia**
```bash
# Verificar se as dependências estão instaladas
cd the-chamber-backend
npm install

# Verificar se credentials.json existe
ls -la credentials.json

# Verificar logs de erro
npm start
```

### **Problema: Google Sheets não conecta**
```bash
# Verificar status da API
curl http://localhost:3000/api/status

# Verificar se a planilha foi compartilhada
# Email: the-chamber@hardy-messenger-400112.iam.gserviceaccount.com
```

### **Problema: CORS ou erros de rede**
- O backend já está configurado com CORS habilitado
- Verifique se está acessando http://localhost:8000 (não file://)

---

## 📈 **Monitoramento e Logs**

### **Logs do Backend**
```bash
# Ver logs em tempo real
cd the-chamber-backend
npm start

# Ou use nodemon para desenvolvimento
npm run dev
```

### **Logs do Frontend**
- Abra o Console do navegador (F12)
- Todos os eventos são logados com emojis para fácil identificação

---

## 🚀 **Deploy em Produção**

### **1. Backend (Heroku, Railway, etc.)**
```bash
# Configure variáveis de ambiente
SPREADSHEET_ID=1PcAveY4HB4sAu-alSXaGArkqErY1Xa5J2VKZlM52xHs
NODE_ENV=production

# Deploy
git push heroku main
```

### **2. Frontend (GitHub Pages, Netlify, etc.)**
- Atualize `script.js` com a URL do backend em produção
- Faça upload dos arquivos estáticos

---

## 🎯 **Status Atual**

- ✅ **Frontend**: 100% funcional
- ✅ **Backend**: 100% funcional
- ✅ **Google Sheets**: 100% integrado
- ✅ **Coleta de Dados**: 100% funcional
- ✅ **Salvamento Automático**: 100% funcional
- ✅ **Interface**: 100% idêntica ao Pygame original

---

## 🎮 **Como Jogar**

1. **Acesse**: http://localhost:8000
2. **Preencha**: Dados demográficos
3. **Jogue**: 6 rodadas por caso
4. **Decida**: Culpado ou Inocente
5. **Veja**: Revelação final
6. **Continue**: Próximo caso
7. **Dados**: Salvos automaticamente no Google Sheets

---

## 📞 **Suporte**

### **Se algo não funcionar:**
1. Verifique os logs do console
2. Execute `node test-backend.js`
3. Verifique se o backend está rodando
4. Verifique se as credenciais estão corretas

### **Comandos úteis:**
```bash
# Verificar status do sistema
curl http://localhost:3000/api/status

# Testar backend
cd the-chamber-backend && node test-backend.js

# Reiniciar tudo
./start-the-chamber.sh
```

---

**🎉 Parabéns! The Chamber está funcionando perfeitamente com Google Sheets!**

**🚀 Execute `./start-the-chamber.sh` e comece a jogar!** 