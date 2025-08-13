# 🔧 Implementação Real do Google Sheets - The Chamber

## 🚨 **Problema Atual**

O Google Sheets API **não pode ser usado diretamente no navegador** com uma conta de serviço por questões de segurança. As credenciais da conta de serviço contêm chaves privadas que não devem ser expostas no frontend.

## ✅ **Soluções Disponíveis**

### **Opção 1: Backend com Node.js (Recomendado)**

#### **1. Criar servidor Node.js**

```bash
# Crie uma pasta para o backend
mkdir the-chamber-backend
cd the-chamber-backend

# Inicialize o projeto
npm init -y

# Instale dependências
npm install express googleapis cors dotenv
```

#### **2. Criar servidor (`server.js`)**

```javascript
const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do Google Sheets
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Rota para enviar dados
app.post('/api/sheets/append', async (req, res) => {
    try {
        const { data, spreadsheetId } = req.body;
        
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetId || process.env.SPREADSHEET_ID,
            range: 'Sheet1!A:O',
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: { values: data }
        });

        res.json({ success: true, data: response.data });
    } catch (error) {
        console.error('Erro:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
```

#### **3. Arquivo de ambiente (`.env`)**

```env
SPREADSHEET_ID=1PcAveY4HB4sAu-alSXaGArkqErY1Xa5J2VKZlM52xHs
PORT=3000
```

#### **4. Atualizar o frontend (`script.js`)**

```javascript
async appendData(data) {
    if (!this.isInitialized || !this.spreadsheetId) {
        console.warn('⚠️ Google Sheets não inicializado');
        return false;
    }

    try {
        // Prepara os dados para envio
        const values = data.map(row => [
            row.ID_Sessao,
            row.ID_Participante,
            row.Num_Rodada,
            row.Idade,
            row.Genero_Participante,
            row.Experiencia_com_Jogos,
            row.ID_Caso,
            row.Tipo_de_Historia,
            row.Genero_Suspeito,
            row.Tempo_de_Decisao_s,
            row.Decisao_Final,
            row.Mudanca_de_Voto,
            row.Resultado_Real_Caso,
            row.Num_Jogadores_Sessao,
            row.Versão
        ]);

        // Envia para o backend
        const response = await fetch('http://localhost:3000/api/sheets/append', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: values,
                spreadsheetId: this.spreadsheetId
            })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Dados enviados para Google Sheets:', result);
            return true;
        } else {
            throw new Error('Falha na resposta do servidor');
        }
    } catch (error) {
        console.error('❌ Erro ao enviar dados:', error);
        return false;
    }
}
```

### **Opção 2: Google Apps Script (Alternativa)**

#### **1. Criar Google Apps Script**

1. Acesse [script.google.com](https://script.google.com)
2. Crie um novo projeto
3. Cole o código abaixo:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const spreadsheetId = data.spreadsheetId;
    const values = data.data;
    
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName('Sheet1');
    
    // Adiciona os dados
    sheet.getRange(sheet.getLastRow() + 1, 1, values.length, values[0].length).setValues(values);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Dados adicionados com sucesso'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('The Chamber API está funcionando!');
}
```

#### **2. Deploy como Web App**

1. Clique em "Deploy" > "New deployment"
2. Tipo: "Web app"
3. Execute as: "Me"
4. Who has access: "Anyone"
5. Clique em "Deploy"

#### **3. Atualizar frontend para usar Apps Script**

```javascript
async appendData(data) {
    try {
        const values = data.map(row => [
            row.ID_Sessao,
            row.ID_Participante,
            row.Num_Rodada,
            row.Idade,
            row.Genero_Participante,
            row.Experiencia_com_Jogos,
            row.ID_Caso,
            row.Tipo_de_Historia,
            row.Genero_Suspeito,
            row.Tempo_de_Decisao_s,
            row.Decisao_Final,
            row.Mudanca_de_Voto,
            row.Resultado_Real_Caso,
            row.Num_Jogadores_Sessao,
            row.Versão
        ]);

        const response = await fetch('URL_DO_APPS_SCRIPT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: values,
                spreadsheetId: this.spreadsheetId
            })
        });

        if (response.ok) {
            console.log('✅ Dados enviados via Apps Script');
            return true;
        }
    } catch (error) {
        console.error('❌ Erro:', error);
        return false;
    }
}
```

### **Opção 3: Firebase Functions (Avançado)**

#### **1. Configurar Firebase**

```bash
npm install -g firebase-tools
firebase login
firebase init functions
```

#### **2. Criar função (`functions/index.js`)**

```javascript
const functions = require('firebase-functions');
const { google } = require('googleapis');

exports.appendToSheets = functions.https.onRequest(async (req, res) => {
    try {
        const { data, spreadsheetId } = req.body;
        
        const auth = new google.auth.GoogleAuth({
            keyFile: 'credentials.json',
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:O',
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: { values: data }
        });

        res.json({ success: true, data: response.data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
```

## 🎯 **Recomendação**

### **Para Desenvolvimento:**
- Use a **Opção 1 (Node.js)** - Mais simples e direta

### **Para Produção:**
- Use a **Opção 3 (Firebase Functions)** - Escalável e seguro

### **Para Prototipagem:**
- Use a **Opção 2 (Google Apps Script)** - Rápido de implementar

## 🚀 **Implementação Rápida (Node.js)**

1. **Clone o projeto backend:**
   ```bash
   git clone https://github.com/seu-usuario/the-chamber-backend.git
   cd the-chamber-backend
   npm install
   ```

2. **Configure as credenciais:**
   - Coloque `credentials.json` na pasta do backend
   - Configure `.env` com o ID da planilha

3. **Execute o servidor:**
   ```bash
   npm start
   ```

4. **Teste a API:**
   ```bash
   curl -X POST http://localhost:3000/api/sheets/append \
     -H "Content-Type: application/json" \
     -d '{"data":[["test","data"]],"spreadsheetId":"SEU_ID"}'
   ```

## 🔒 **Segurança**

- **NUNCA** exponha credenciais no frontend
- **SEMPRE** use HTTPS em produção
- **Implemente** rate limiting e validação
- **Monitore** logs e acesso

---

**📝 Status**: Implementação simulada funcionando. Para produção, implemente uma das opções acima. 