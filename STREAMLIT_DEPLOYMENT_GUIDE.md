# Guia de Deploy no Streamlit Cloud com Google Sheets

Este guia explica como configurar as credenciais do Google Sheets para funcionar no Streamlit Cloud, onde você não pode fazer upload de arquivos de credenciais.

## 🚀 Configuração no Streamlit Cloud

### 1. Acesse o Streamlit Cloud

1. Vá para [share.streamlit.io](https://share.streamlit.io/)
2. Faça login com sua conta GitHub
3. Selecione o repositório `the_chamber2`

### 2. Configure as Credenciais do Google Sheets

1. No painel do Streamlit Cloud, clique em "Settings" (⚙️)
2. Vá para a aba "Secrets"
3. Cole o seguinte JSON no campo de secrets:

```json
{
  "GOOGLE_CREDENTIALS": {
    "type": "service_account",
    "project_id": "seu-projeto-id",
    "private_key_id": "sua-private-key-id",
    "private_key": "-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----\n",
    "client_email": "sua-conta-de-servico@seu-projeto.iam.gserviceaccount.com",
    "client_id": "seu-client-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/sua-conta-de-servico%40seu-projeto.iam.gserviceaccount.com"
  }
}
```

### 3. Obter as Credenciais do Google Cloud

Para obter os valores acima, siga estes passos:

#### 3.1 Acesse o Google Cloud Console
1. Vá para [console.cloud.google.com](https://console.cloud.google.com/)
2. Selecione seu projeto

#### 3.2 Crie ou Use uma Conta de Serviço Existente
1. Vá em "IAM & Admin" → "Service Accounts"
2. Se você já tem uma conta de serviço, clique nela
3. Se não tem, crie uma nova:
   - Clique em "Create Service Account"
   - Nome: `the-chamber-sheets`
   - Descrição: `Conta para integração com The Chamber no Streamlit`
   - Clique em "Create and Continue"
   - Em "Grant access", selecione "Editor"
   - Clique em "Done"

#### 3.3 Gere uma Nova Chave
1. Clique na conta de serviço criada
2. Vá na aba "Keys"
3. Clique em "Add Key" → "Create new key"
4. Selecione "JSON" e clique em "Create"
5. O arquivo será baixado automaticamente

#### 3.4 Extraia as Informações
1. Abra o arquivo JSON baixado
2. Copie todo o conteúdo
3. Cole no campo "GOOGLE_CREDENTIALS" do Streamlit Cloud

### 4. Compartilhar a Planilha

1. Abra sua planilha no Google Drive
2. Clique em "Compartilhar" (canto superior direito)
3. Adicione o email da conta de serviço (está no campo `client_email` do JSON)
4. Dê permissão de "Editor"
5. Clique em "Enviar"

### 5. Verificar a Configuração

1. No Streamlit Cloud, clique em "Deploy"
2. Aguarde o deploy terminar
3. Acesse sua aplicação
4. Verifique se aparece a mensagem: "✅ Autenticação com Google Sheets via Streamlit realizada com sucesso!"

## 🔧 Configuração Alternativa com Variáveis de Ambiente

Se preferir usar variáveis de ambiente (mais seguro para projetos empresariais):

### 1. No Streamlit Cloud
1. Vá em "Settings" → "Secrets"
2. Adicione:

```json
{
  "GOOGLE_CREDENTIALS": "SUA_STRING_JSON_COMPLETA_AQUI"
}
```

### 2. Ou Configure no Sistema
```bash
export GOOGLE_CREDENTIALS='{"type":"service_account",...}'
```

## 🚨 Solução de Problemas

### Erro: "Não foi possível autenticar com Google Sheets"
- Verifique se o JSON das credenciais está correto no Streamlit
- Confirme se a conta de serviço tem permissão na planilha
- Verifique se a Google Sheets API está ativada no projeto

### Erro: "Acesso negado"
- Confirme se a planilha foi compartilhada com o email da conta de serviço
- Verifique se as permissões estão como "Editor"

### Erro: "Planilha não encontrada"
- Verifique se o `SPREADSHEET_ID` está correto no código
- Confirme se a planilha existe e está acessível

## 📝 Notas Importantes

- **NUNCA** commite o arquivo `credentials.json` no GitHub
- O Streamlit Cloud automaticamente detecta e usa as credenciais configuradas
- Para desenvolvimento local, continue usando o arquivo `credentials.json`
- Para produção, sempre use o sistema de secrets do Streamlit
- As credenciais são criptografadas e seguras no Streamlit Cloud

## 🔄 Atualizando Credenciais

Se precisar atualizar as credenciais:

1. Gere uma nova chave no Google Cloud Console
2. Atualize o campo "GOOGLE_CREDENTIALS" no Streamlit Cloud
3. Faça um novo deploy
4. A aplicação usará automaticamente as novas credenciais

## ✅ Verificação Final

Após configurar tudo:

1. ✅ Credenciais configuradas no Streamlit Cloud
2. ✅ Planilha compartilhada com a conta de serviço
3. ✅ Google Sheets API ativada
4. ✅ Deploy realizado com sucesso
5. ✅ Mensagem de autenticação aparecendo
6. ✅ Dados sendo salvos na planilha

Agora sua aplicação deve funcionar perfeitamente no Streamlit Cloud com integração ao Google Sheets! 🎉 