#!/usr/bin/env python3
"""
Script para extrair credenciais do Google Sheets e formatar para Streamlit Cloud
"""

import json
import os

def extract_credentials():
    """Extrai credenciais do arquivo local e formata para Streamlit"""
    
    # Verifica se o arquivo de credenciais existe
    if not os.path.exists('credentials.json'):
        print("❌ Arquivo 'credentials.json' não encontrado!")
        print("   Certifique-se de que o arquivo está na mesma pasta deste script.")
        return
    
    try:
        # Lê o arquivo de credenciais
        with open('credentials.json', 'r') as f:
            credentials = json.load(f)
        
        # Formata para Streamlit (opção 1: JSON completo)
        streamlit_json = {
            "GOOGLE_CREDENTIALS": credentials
        }
        
        # Formata para Streamlit (opção 2: string JSON)
        streamlit_string = {
            "GOOGLE_CREDENTIALS": json.dumps(credentials)
        }
        
        print("✅ Credenciais extraídas com sucesso!")
        print("\n" + "="*60)
        print("📋 COLE ESTE JSON NO STREAMLIT CLOUD (Secrets):")
        print("="*60)
        print(json.dumps(streamlit_json, indent=2))
        
        print("\n" + "="*60)
        print("🔑 OU USE ESTA VERSÃO COMO STRING:")
        print("="*60)
        print(json.dumps(streamlit_string, indent=2))
        
        print("\n" + "="*60)
        print("📝 INSTRUÇÕES:")
        print("="*60)
        print("1. Vá para share.streamlit.io")
        print("2. Selecione seu repositório")
        print("3. Clique em 'Settings' → 'Secrets'")
        print("4. Cole um dos JSONs acima")
        print("5. Clique em 'Save'")
        print("6. Faça um novo deploy")
        
        # Salva os arquivos formatados
        with open('streamlit_secrets.json', 'w') as f:
            json.dump(streamlit_json, f, indent=2)
        
        with open('streamlit_secrets_string.json', 'w') as f:
            json.dump(streamlit_string, f, indent=2)
        
        print("\n✅ Arquivos salvos:")
        print("   - streamlit_secrets.json")
        print("   - streamlit_secrets_string.json")
        
    except Exception as e:
        print(f"❌ Erro ao processar credenciais: {e}")

def show_credentials_info():
    """Mostra informações sobre as credenciais"""
    try:
        with open('credentials.json', 'r') as f:
            credentials = json.load(f)
        
        print("📊 INFORMAÇÕES DAS CREDENCIAIS:")
        print("="*40)
        print(f"Project ID: {credentials.get('project_id', 'N/A')}")
        print(f"Client Email: {credentials.get('client_email', 'N/A')}")
        print(f"Private Key ID: {credentials.get('private_key_id', 'N/A')}")
        print(f"Type: {credentials.get('type', 'N/A')}")
        
        # Verifica se a chave privada está presente
        private_key = credentials.get('private_key', '')
        if private_key:
            print(f"Private Key: {'✅ Presente' if private_key.startswith('-----BEGIN') else '❌ Formato incorreto'}")
        else:
            print("Private Key: ❌ Ausente")
            
    except Exception as e:
        print(f"❌ Erro ao ler credenciais: {e}")

if __name__ == "__main__":
    print("🔐 EXTRATOR DE CREDENCIAIS PARA STREAMLIT CLOUD")
    print("="*50)
    
    # Mostra informações das credenciais
    show_credentials_info()
    print()
    
    # Extrai e formata as credenciais
    extract_credentials()
    
    print("\n" + "="*60)
    print("🎯 PRÓXIMOS PASSOS:")
    print("="*60)
    print("1. Copie um dos JSONs acima")
    print("2. Configure no Streamlit Cloud")
    print("3. Compartilhe sua planilha com a conta de serviço")
    print("4. Faça o deploy")
    print("5. Teste a funcionalidade do Google Sheets") 