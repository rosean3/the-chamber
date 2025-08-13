# 🚀 Guia de Deploy no Render (GRATUITO)

## 📋 **Visão Geral**
O **Render** é uma plataforma de deploy **totalmente gratuita** que oferece:
- ✅ **Deploy automático** do GitHub
- ✅ **SSL gratuito** para todos os domínios
- ✅ **Domínio gratuito** (.onrender.com)
- ✅ **Sem limite de tempo** (não "dorme" como Heroku)
- ✅ **Suporte a Node.js** e sites estáticos

---

## 🎯 **O que será Deployado**

### **1. Backend API** (`the-chamber-backend`)
- **URL**: `https://the-chamber-backend.onrender.com`
- **Tipo**: Web Service (Node.js)
- **Porta**: 10000
- **Plan**: Free

### **2. Frontend** (`the-chamber-frontend`)
- **URL**: `https://the-chamber-frontend.onrender.com`
- **Tipo**: Static Site
- **Plan**: Free

---

## 🚀 **Deploy Automático (Recomendado)**

### **Passo 1: Preparar o Repositório**
```bash
# Tornar o script executável
chmod +x deploy-render.sh

# Executar o deploy automático
./deploy-render.sh
```

### **Passo 2: Login no Render**
- O script abrirá o navegador
- Faça login com sua conta do Render
- Autorize o CLI

### **Passo 3: Configurar Credenciais**
No **Render Dashboard** → **Seu Backend** → **Environment**:

```bash
GOOGLE_APPLICATION_CREDENTIALS_JSON = [conteúdo completo do credentials.json]
```

---

## 🛠️ **Deploy Manual (Alternativo)**

### **Passo 1: Criar Conta no Render**
1. Acesse [render.com](https://render.com)
2. Clique em **"Get Started"**
3. Faça login com GitHub

### **Passo 2: Deploy do Backend**
1. Clique em **"New +"**
2. Selecione **"Web Service"**
3. Conecte seu repositório GitHub
4. Configure:
   - **Name**: `the-chamber-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd the-chamber-backend && npm install`
   - **Start Command**: `cd the-chamber-backend && npm start`
   - **Plan**: `Free`

### **Passo 3: Configurar Variáveis de Ambiente**
No backend, adicione:

```bash
NODE_ENV = production
PORT = 10000
SPREADSHEET_ID_V1 = 1PcAveY4HB4sAu-alSXaGArkqErY1Xa5J2VKZlM52xHs
SPREADSHEET_ID_V2 = 1iEZZ6iUJqmyp8FDGZXw4nX_Q_1XQJWFmH1q3S0LenOg
GOOGLE_APPLICATION_CREDENTIALS_JSON = [conteúdo do credentials.json]
CORS_ORIGIN = *
```

### **Passo 4: Deploy do Frontend**
1. Clique em **"New +"**
2. Selecione **"Static Site"**
3. Conecte seu repositório GitHub
4. Configure:
   - **Name**: `the-chamber-frontend`
   - **Build Command**: `echo "Frontend estático"`
   - **Publish Directory**: `.` (raiz)
   - **Plan**: `Free`

---

## 🔧 **Configuração das Credenciais**

### **1. Obter o Conteúdo do credentials.json**
```bash
# No terminal, execute:
cat credentials.json
```

### **2. Copiar TODO o conteúdo**
```json
{
  "type": "service_account",
  "project_id": "seu-projeto",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

### **3. Colar no Render Dashboard**
- Vá para seu backend no Render
- **Environment** → **Add Environment Variable**
- **Key**: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
- **Value**: Cole TODO o conteúdo do JSON

---

## 🧪 **Testando o Deploy**

### **1. Verificar Backend**
```bash
# Testar status da API
curl https://the-chamber-backend.onrender.com/api/status

# Resposta esperada:
{
  "success": true,
  "message": "API funcionando",
  "sheets": {
    "v1": "Conectado",
    "v2": "Conectado"
  }
}
```

### **2. Verificar Frontend**
- Acesse: `https://the-chamber-frontend.onrender.com`
- Teste a seleção de versão (V1/V2)
- Verifique se os dados são salvos no Google Sheets

---

## 📊 **Monitoramento**

### **Render Dashboard**
- **Status**: Verde = Funcionando, Vermelho = Erro
- **Logs**: Clique no serviço → **Logs**
- **Metrics**: Uso de CPU, memória, requests

### **Health Check**
- **Backend**: `/api/status` (automático)
- **Frontend**: Verificação de conectividade

---

## 🚨 **Troubleshooting**

### **Erro: "Build Failed"**
```bash
# Verificar logs no Render Dashboard
# Problema comum: Node.js version incompatível
```

**Solução**: Adicionar no `package.json`:
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### **Erro: "Google Sheets Connection Failed"**
```bash
# Verificar se GOOGLE_APPLICATION_CREDENTIALS_JSON está correto
# Verificar se o service account tem acesso às planilhas
```

### **Erro: "CORS Error"**
```bash
# Verificar se CORS_ORIGIN está configurado
# Deve ser "*" ou a URL do frontend
```

### **Erro: "Port Already in Use"**
```bash
# O Render usa a porta 10000 por padrão
# Verificar se PORT=10000 está configurado
```

---

## 🔄 **Atualizações Automáticas**

### **GitHub Integration**
1. **Push** para `main` branch
2. **Render detecta** automaticamente
3. **Deploy automático** em 2-3 minutos

### **Manual Deploy**
```bash
# No Render Dashboard
# Seu serviço → "Manual Deploy" → "Deploy latest commit"
```

---

## 💰 **Custos**

### **Plano Free**
- ✅ **Backend**: 1 serviço web
- ✅ **Frontend**: 1 site estático
- ✅ **SSL**: Gratuito
- ✅ **Domínio**: Gratuito (.onrender.com)
- ✅ **Bandwidth**: 100GB/mês
- ✅ **Sem limite de tempo**

### **Limitações**
- ⚠️ **Sleep**: 15 minutos de inatividade
- ⚠️ **CPU**: Limitado (mas suficiente para o projeto)
- ⚠️ **Memória**: 512MB (suficiente)

---

## 🎉 **Pronto!**

Após o deploy:
1. **Backend**: `https://the-chamber-backend.onrender.com`
2. **Frontend**: `https://the-chamber-frontend.onrender.com`
3. **API Status**: `/api/status`
4. **Google Sheets**: Funcionando automaticamente

### **Links Úteis**
- [Render Dashboard](https://dashboard.render.com)
- [Render Docs](https://render.com/docs)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)

---

## 🆘 **Suporte**

### **Render Support**
- **Email**: support@render.com
- **Docs**: [render.com/docs](https://render.com/docs)
- **Community**: [community.render.com](https://community.render.com)

### **Projeto The Chamber**
- **Issues**: GitHub Issues
- **Documentação**: README.md
- **Configuração**: config.js

---

**🎯 O Render é a melhor opção gratuita para deploy! Sem custos, sem limitações de tempo, e totalmente automático!** 🚀 