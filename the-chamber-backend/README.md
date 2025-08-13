# 🚀 The Chamber Backend

Backend API para integração do The Chamber com Google Sheets.

## 📋 **Pré-requisitos**

- Node.js 16+ instalado
- Arquivo `credentials.json` do Google Cloud
- Planilha do Google Sheets configurada

## 🛠️ **Instalação**

```bash
# Instalar dependências
npm install

# Copiar credenciais (se não estiver na pasta)
cp ../credentials.json .
```

## ⚙️ **Configuração**

1. **Arquivo de credenciais**: `credentials.json` deve estar na pasta raiz
2. **Variáveis de ambiente**: Configure no arquivo `env.config`
3. **ID da planilha**: Configure `SPREADSHEET_ID` no `env.config`

## 🚀 **Execução**

### **Desenvolvimento (com auto-reload)**
```bash
npm run dev
```

### **Produção**
```bash
npm start
```

## 🌐 **Endpoints da API**

### **GET /** - Status do servidor
```bash
curl http://localhost:3000/
```

### **GET /api/status** - Status do Google Sheets
```bash
curl http://localhost:3000/api/status
```

### **POST /api/sheets/append** - Enviar dados
```bash
# Para V1
curl -X POST http://localhost:3000/api/sheets/append \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      ["SESSAO_123", "P1", "1", "25", "Feminino", "3", "1", "Real", "Feminino", "2.5", "0", "0", "0", "1", "1"]
    ],
    "spreadsheetId": "1PcAveY4HB4sAu-alSXaGArkqErY1Xa5J2VKZlM52xHs"
  }'

# Para V2
curl -X POST http://localhost:3000/api/sheets/append \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      ["SESSAO_456", "P1", "1", "30", "Masculino", "4", "1", "Real", "Masculino", "3.2", "0", "0", "0", "1", "3"]
    ],
    "spreadsheetId": "1iEZZ6iUJqmyp8FDGZXw4nX_Q_1XQJWFmH1q3S0LenOg"
  }'
```

### **GET /api/sheets/read** - Ler dados
```bash
# Para V1
curl "http://localhost:3000/api/sheets/read?range=The Chamber Data!A:O&spreadsheetId=1PcAveY4HB4sAu-alSXaGArkqErY1Xa5J2VKZlM52xHs"

# Para V2
curl "http://localhost:3000/api/sheets/read?range=The Chamber Data!A:O&spreadsheetId=1iEZZ6iUJqmyp8FDGZXw4nX_Q_1XQJWFmH1q3S0LenOg"
```

### **DELETE /api/sheets/clear** - Limpar dados
```bash
# Para V1
curl -X DELETE http://localhost:3000/api/sheets/clear \
  -H "Content-Type: application/json" \
  -d '{"range": "The Chamber Data!A2:O", "spreadsheetId": "1PcAveY4HB4sAu-alSXaGArkqErY1Xa5J2VKZlM52xHs"}'

# Para V2
curl -X DELETE http://localhost:3000/api/sheets/clear \
  -H "Content-Type: application/json" \
  -d '{"range": "The Chamber Data!A2:O", "spreadsheetId": "1iEZZ6iUJqmyp8FDGZXw4nX_Q_1XQJWFmH1q3S0LenOg"}'
```

## 📊 **Estrutura dos Dados**

Cada linha enviada deve conter 15 colunas:

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

## 🔧 **Troubleshooting**

### **Erro 403 - Acesso negado**
- Verifique se a planilha foi compartilhada com o email da conta de serviço
- Verifique se as credenciais estão corretas

### **Erro 404 - Planilha não encontrada**
- Verifique se o SPREADSHEET_ID está correto
- Verifique se a planilha existe

### **Erro de CORS**
- O backend já está configurado com CORS habilitado
- Verifique se o frontend está acessando a URL correta

## 📁 **Estrutura de Arquivos**

```
the-chamber-backend/
├── server.js          # Servidor principal
├── package.json       # Dependências e scripts
├── env.config         # Configurações de ambiente
├── credentials.json   # Credenciais do Google Cloud
└── README.md          # Este arquivo
```

## 🔒 **Segurança**

- **NUNCA** exponha o arquivo `credentials.json`
- **SEMPRE** use HTTPS em produção
- **Implemente** autenticação se necessário
- **Monitore** logs de acesso

## 📞 **Suporte**

Para problemas ou dúvidas, verifique:
1. Logs do console
2. Status da API (`/api/status`)
3. Configuração das credenciais
4. Permissões da planilha

---

**🎯 Status**: Backend configurado e pronto para uso! 