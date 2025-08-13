// Exemplo de implementação real do Google Sheets para The Chamber
// Este arquivo mostra como implementar a integração completa

class GoogleSheetsManagerReal {
    constructor() {
        this.service = null;
        this.spreadsheetId = null;
        this.credentials = null;
        this.loadConfig();
    }

    async loadConfig() {
        const config = localStorage.getItem('googleSheetsConfig');
        if (config) {
            const parsed = JSON.parse(config);
            this.spreadsheetId = parsed.spreadsheetId;
            this.credentials = parsed.credentials;
            await this.initializeService();
        }
    }

    async initializeService() {
        if (!this.credentials) return false;

        try {
            // Carrega a biblioteca do Google
            await this.loadGoogleAPI();
            
            // Inicializa o cliente
            const client = await gapi.client.init({
                apiKey: this.credentials.api_key,
                clientId: this.credentials.client_id,
                discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
                scope: 'https://www.googleapis.com/auth/spreadsheets'
            });

            // Autentica o usuário
            await gapi.auth2.getAuthInstance().signIn();
            
            this.service = gapi.client.sheets;
            return true;
        } catch (error) {
            console.error('Erro ao inicializar Google Sheets:', error);
            return false;
        }
    }

    async loadGoogleAPI() {
        return new Promise((resolve, reject) => {
            if (window.gapi) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                gapi.load('client:auth2', resolve);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async appendData(data) {
        if (!this.service || !this.spreadsheetId) {
            console.warn('Google Sheets não configurado');
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

            // Envia para o Google Sheets
            const response = await this.service.spreadsheets.values.append({
                spreadsheetId: this.spreadsheetId,
                range: 'Sheet1!A:O',
                valueInputOption: 'RAW',
                insertDataOption: 'INSERT_ROWS',
                resource: {
                    values: values
                }
            });

            console.log('Dados enviados com sucesso:', response.result);
            return true;
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            return false;
        }
    }

    async testConnection() {
        if (!this.service || !this.spreadsheetId) return false;

        try {
            const response = await this.service.spreadsheets.get({
                spreadsheetId: this.spreadsheetId
            });
            return response.status === 200;
        } catch (error) {
            console.error('Erro ao testar conexão:', error);
            return false;
        }
    }

    saveConfig(credentials, spreadsheetId) {
        this.credentials = credentials;
        this.spreadsheetId = spreadsheetId;
        localStorage.setItem('googleSheetsConfig', JSON.stringify({
            credentials,
            spreadsheetId
        }));
    }
}

// Exemplo de uso no jogo principal
async function initializeGoogleSheets() {
    const sheetsManager = new GoogleSheetsManagerReal();
    
    if (await sheetsManager.initializeService()) {
        console.log('✅ Google Sheets configurado com sucesso!');
        
        if (await sheetsManager.testConnection()) {
            console.log('✅ Conexão estabelecida com sucesso!');
            return sheetsManager;
        } else {
            console.log('⚠️ Problemas na conexão com Google Sheets');
            return null;
        }
    } else {
        console.log('⚠️ Falha ao inicializar Google Sheets');
        return null;
    }
}

// Exemplo de envio de dados
async function sendDataToSheets(sheetsManager, data) {
    if (!sheetsManager) {
        console.log('Google Sheets não disponível, salvando localmente');
        saveDataLocally(data);
        return;
    }

    try {
        showLoading();
        const success = await sheetsManager.appendData(data);
        
        if (success) {
            console.log('📊 Dados enviados para o Google Sheets com sucesso!');
            // Também salva localmente como backup
            saveDataLocally(data);
        } else {
            console.log('⚠️ Falha ao enviar dados para o Google Sheets');
            saveDataLocally(data);
        }
    } catch (error) {
        console.error('⚠️ Erro ao enviar para Google Sheets:', error);
        saveDataLocally(data);
    } finally {
        hideLoading();
    }
}

// Função para salvar dados localmente
function saveDataLocally(data) {
    const existingData = JSON.parse(localStorage.getItem('theChamberData') || '[]');
    existingData.push(...data);
    localStorage.setItem('theChamberData', JSON.stringify(existingData));
    console.log('💾 Dados salvos localmente como backup');
}

// Função para exportar dados locais
function exportLocalData() {
    const data = JSON.parse(localStorage.getItem('theChamberData') || '[]');
    if (data.length === 0) {
        alert('Nenhum dado local para exportar');
        return;
    }

    const csvContent = convertToCSV(data);
    downloadCSV(csvContent, 'the_chamber_backup.csv');
}

// Função para converter dados para CSV
function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','),
        ...data.map(row => 
            headers.map(header => `"${row[header]}"`).join(',')
        )
    ];
    return csvRows.join('\n');
}

// Função para download de arquivo
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Exemplo de configuração automática
function autoConfigureGoogleSheets() {
    // Configuração para desenvolvimento
    const devConfig = {
        api_key: 'SUA_API_KEY_AQUI',
        client_id: 'SEU_CLIENT_ID_AQUI',
        spreadsheet_id: 'ID_DA_SUA_PLANILHA'
    };

    const sheetsManager = new GoogleSheetsManagerReal();
    sheetsManager.saveConfig(devConfig, devConfig.spreadsheet_id);
    
    console.log('Configuração automática aplicada');
}

// Função para mostrar status da conexão
async function showConnectionStatus() {
    const sheetsManager = new GoogleSheetsManagerReal();
    const isConnected = await sheetsManager.testConnection();
    
    const statusElement = document.getElementById('connection-status');
    if (statusElement) {
        statusElement.textContent = isConnected ? '🟢 Conectado' : '🔴 Desconectado';
        statusElement.className = isConnected ? 'status-connected' : 'status-disconnected';
    }
}

// Exemplo de uso no HTML
/*
<div id="google-sheets-status">
    <h3>Status do Google Sheets</h3>
    <p id="connection-status">⚪ Verificando...</p>
    <button onclick="showConnectionStatus()">Verificar Status</button>
    <button onclick="exportLocalData()">Exportar Dados Locais</button>
</div>
*/

// Inicialização automática quando o documento carregar
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Inicializando Google Sheets...');
    
    // Aguarda um pouco para carregar outras dependências
    setTimeout(async () => {
        const sheetsManager = await initializeGoogleSheets();
        if (sheetsManager) {
            window.gameState.sheetsManager = sheetsManager;
        }
    }, 1000);
});

// Exporta as funções para uso global
window.GoogleSheetsManagerReal = GoogleSheetsManagerReal;
window.initializeGoogleSheets = initializeGoogleSheets;
window.sendDataToSheets = sendDataToSheets;
window.exportLocalData = exportLocalData;
window.showConnectionStatus = showConnectionStatus; 