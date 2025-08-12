"""
Gerenciador para operações com Google Sheets - Versão 2
"""

import os
import json
import streamlit as st
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from google_sheets_config_v2 import SCOPES, SPREADSHEET_ID, RANGE_NAME, CREDENTIALS_FILE

class GoogleSheetsManagerV2:
    def __init__(self):
        self.service = None
        self.credentials = None
        self._authenticate()
    
    def _authenticate(self):
        """Autentica com a API do Google usando credenciais de conta de serviço"""
        try:
            # Primeiro, tenta usar credenciais do Streamlit (para deploy)
            if self._authenticate_from_streamlit():
                return True
            
            # Se não funcionar, tenta usar arquivo local (para desenvolvimento)
            if self._authenticate_from_file():
                return True
            
            print("❌ Não foi possível autenticar com Google Sheets")
            print("   Verifique as configurações do Streamlit ou o arquivo de credenciais local")
            return False
            
        except Exception as e:
            print(f"❌ Erro na autenticação: {e}")
            return False
    
    def _authenticate_from_streamlit(self):
        """Tenta autenticar usando secrets do Streamlit (para deploy)"""
        try:
            # Verifica se estamos rodando no Streamlit
            if hasattr(st, 'secrets'):
                # Tenta obter credenciais dos secrets do Streamlit
                if 'GOOGLE_CREDENTIALS' in st.secrets:
                    creds_json = st.secrets['GOOGLE_CREDENTIALS']
                    if isinstance(creds_json, str):
                        creds_dict = json.loads(creds_json)
                    else:
                        creds_dict = creds_json
                    
                    self.credentials = Credentials.from_service_account_info(
                        creds_dict, scopes=SCOPES
                    )
                    self.service = build('sheets', 'v4', credentials=self.credentials)
                    print("✅ Autenticação com Google Sheets via Streamlit realizada com sucesso!")
                    return True
                
                # Tenta obter credenciais de variáveis de ambiente
                elif 'GOOGLE_CREDENTIALS' in os.environ:
                    creds_json = os.environ['GOOGLE_CREDENTIALS']
                    creds_dict = json.loads(creds_json)
                    
                    self.credentials = Credentials.from_service_account_info(
                        creds_dict, scopes=SCOPES
                    )
                    self.service = build('sheets', 'v4', credentials=self.credentials)
                    print("✅ Autenticação com Google Sheets via variáveis de ambiente realizada com sucesso!")
                    return True
            
            return False
            
        except Exception as e:
            print(f"⚠️  Falha na autenticação via Streamlit: {e}")
            return False
    
    def _authenticate_from_file(self):
        """Tenta autenticar usando arquivo local (para desenvolvimento)"""
        try:
            if not os.path.exists(CREDENTIALS_FILE):
                print(f"⚠️  Arquivo de credenciais '{CREDENTIALS_FILE}' não encontrado!")
                return False
            
            self.credentials = Credentials.from_service_account_file(
                CREDENTIALS_FILE, scopes=SCOPES
            )
            self.service = build('sheets', 'v4', credentials=self.credentials)
            print("✅ Autenticação com Google Sheets via arquivo local realizada com sucesso!")
            return True
            
        except Exception as e:
            print(f"⚠️  Falha na autenticação via arquivo local: {e}")
            return False
    
    def append_data(self, data_rows):
        """Adiciona dados à planilha do Google Sheets"""
        if not self.service:
            print("❌ Serviço não autenticado. Verifique as credenciais.")
            return False
        
        try:
            # Converte os dados para o formato esperado pelo Google Sheets
            values = []
            for row in data_rows:
                values.append([str(value) for value in row.values()])
            
            # Obtém informações da planilha para usar a primeira aba disponível
            spreadsheet_info = self.get_spreadsheet_info()
            if not spreadsheet_info or not spreadsheet_info['sheets']:
                print("❌ Não foi possível obter informações da planilha")
                return False
            
            # Usa a primeira aba disponível
            first_sheet = spreadsheet_info['sheets'][0]
            range_name = f"{first_sheet}!A1"
            
            print(f"📊 Usando aba: {first_sheet}")
            
            # Adiciona os dados à planilha
            body = {'values': values}
            result = self.service.spreadsheets().values().append(
                spreadsheetId=SPREADSHEET_ID,
                range=range_name,
                valueInputOption='RAW',
                insertDataOption='INSERT_ROWS',
                body=body
            ).execute()
            
            print(f"✅ {len(data_rows)} linhas adicionadas com sucesso ao Google Sheets!")
            print(f"   Planilha atualizada: {result.get('updates').get('updatedRange')}")
            return True
            
        except Exception as e:
            print(f"❌ Erro ao adicionar dados ao Google Sheets: {e}")
            return False
    
    def get_spreadsheet_info(self):
        """Obtém informações sobre a planilha"""
        if not self.service:
            return None
        
        try:
            result = self.service.spreadsheets().get(
                spreadsheetId=SPREADSHEET_ID
            ).execute()
            
            return {
                'title': result['properties']['title'],
                'sheets': [sheet['properties']['title'] for sheet in result['sheets']]
            }
        except Exception as e:
            if "404" in str(e):
                print(f"❌ Planilha não encontrada. Verifique se o SPREADSHEET_ID está correto: {SPREADSHEET_ID}")
            elif "403" in str(e):
                print(f"❌ Acesso negado. Verifique se a planilha foi compartilhada com a conta de serviço")
            else:
                print(f"❌ Erro ao obter informações da planilha: {e}")
            return None
    
    def test_connection(self):
        """Testa a conexão com a planilha"""
        print(f"🔍 Testando conexão com planilha ID: {SPREADSHEET_ID}")
        
        info = self.get_spreadsheet_info()
        if info:
            print(f"✅ Planilha encontrada: {info['title']}")
            print(f"   Abas disponíveis: {', '.join(info['sheets'])}")
            return True
        else:
            print("❌ Falha na conexão com a planilha")
            return False 