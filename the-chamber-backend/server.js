const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Configuração do Google Sheets
let auth = null;
let sheets = null;

// IDs das planilhas para cada versão
const SPREADSHEET_IDS = {
    V1: '1PcAveY4HB4sAu-alSXaGArkqErY1Xa5J2VKZlM52xHs',
    V2: '1iEZZ6iUJqmyp8FDGZXw4nX_Q_1XQJWFmH1q3S0LenOg'
};

async function initializeGoogleSheets() {
    try {
        // Em produção (Render), usa variáveis de ambiente
        // Em desenvolvimento local, usa arquivo credentials.json
        if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
            console.log('☁️ Usando credenciais das variáveis de ambiente (produção)');
            
            // Parse das credenciais JSON da variável de ambiente
            const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
            
            auth = new google.auth.GoogleAuth({
                credentials: credentials,
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });
        } else {
            console.log('🏠 Usando arquivo credentials.json (desenvolvimento local)');
            
            // Verifica se o arquivo existe
            const fs = require('fs');
            const credentialsPath = path.join(__dirname, '../credentials.json');
            
            if (!fs.existsSync(credentialsPath)) {
                throw new Error('Arquivo credentials.json não encontrado. Configure GOOGLE_APPLICATION_CREDENTIALS_JSON em produção.');
            }
            
            auth = new google.auth.GoogleAuth({
                keyFile: credentialsPath,
                scopes: ['https://www.googleapis.com/auth/spreadsheets'],
            });
        }

        sheets = google.sheets({ version: 'v4', auth });
        console.log('✅ Google Sheets inicializado com sucesso');
        console.log('📊 Planilhas disponíveis:');
        console.log(`   V1: ${SPREADSHEET_IDS.V1}`);
        console.log(`   V2: ${SPREADSHEET_IDS.V2}`);
        return true;
    } catch (error) {
        console.error('❌ Erro ao inicializar Google Sheets:', error);
        return false;
    }
}

// Rota principal
app.get('/', (req, res) => {
    res.json({
        message: '🚀 The Chamber Backend API',
        version: '1.0.0',
        status: 'online',
        googleSheets: auth ? 'connected' : 'disconnected'
    });
});

// Rota para verificar status do Google Sheets
app.get('/api/status', async (req, res) => {
    try {
        if (!auth || !sheets) {
            return res.json({
                success: false,
                message: 'Google Sheets não inicializado',
                status: 'disconnected'
            });
        }

        // Testa conexão com ambas as planilhas
        const statusResults = {};
        
        for (const [version, spreadsheetId] of Object.entries(SPREADSHEET_IDS)) {
            try {
                const response = await sheets.spreadsheets.get({
                    spreadsheetId: spreadsheetId
                });
                
                statusResults[version] = {
                    id: response.data.spreadsheetId,
                    title: response.data.properties.title,
                    sheets: response.data.sheets.map(sheet => sheet.properties.title),
                    status: 'connected'
                };
            } catch (error) {
                statusResults[version] = {
                    id: spreadsheetId,
                    status: 'error',
                    error: error.message
                };
            }
        }

        res.json({
            success: true,
            message: 'Google Sheets conectado',
            status: 'connected',
            spreadsheets: statusResults
        });
    } catch (error) {
        console.error('❌ Erro ao verificar status:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao verificar status',
            error: error.message,
            status: 'error'
        });
    }
});

// Rota para enviar dados para o Google Sheets
app.post('/api/sheets/append', async (req, res) => {
    try {
        const { data, spreadsheetId } = req.body;
        
        if (!data || !Array.isArray(data) || data.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Dados inválidos ou vazios'
            });
        }

        if (!auth || !sheets) {
            return res.status(500).json({
                success: false,
                message: 'Google Sheets não inicializado'
            });
        }

        const targetSpreadsheetId = spreadsheetId || process.env.SPREADSHEET_ID || '1PcAveY4HB4sAu-alSXaGArkqErY1Xa5J2VKZlM52xHs';

        console.log(`📊 Enviando ${data.length} linhas para planilha ${targetSpreadsheetId}`);

        // Primeiro, verifica se a aba "The Chamber Data" existe, se não, cria
        let sheetName = 'The Chamber Data';
        try {
            const spreadsheet = await sheets.spreadsheets.get({
                spreadsheetId: targetSpreadsheetId
            });
            
            const existingSheets = spreadsheet.data.sheets.map(s => s.properties.title);
            console.log('📋 Abas existentes:', existingSheets);
            
            if (!existingSheets.includes(sheetName)) {
                console.log('📝 Criando aba "The Chamber Data"...');
                await sheets.spreadsheets.batchUpdate({
                    spreadsheetId: targetSpreadsheetId,
                    resource: {
                        requests: [{
                            addSheet: {
                                properties: {
                                    title: sheetName,
                                    gridProperties: {
                                        rowCount: 1000,
                                        columnCount: 15
                                    }
                                }
                            }
                        }]
                    }
                });
                console.log('✅ Aba "The Chamber Data" criada com sucesso');
            }
        } catch (error) {
            console.error('❌ Erro ao verificar/criar aba:', error);
            // Se não conseguir criar, usa a primeira aba disponível
            try {
                const spreadsheet = await sheets.spreadsheets.get({
                    spreadsheetId: targetSpreadsheetId
                });
                sheetName = spreadsheet.data.sheets[0].properties.title;
                console.log(`📋 Usando aba existente: ${sheetName}`);
            } catch (e) {
                console.error('❌ Erro ao obter nome da primeira aba:', e);
                sheetName = 'Sheet1'; // Fallback
            }
        }

        // Adiciona cabeçalhos se a aba estiver vazia
        try {
            const headerCheck = await sheets.spreadsheets.values.get({
                spreadsheetId: targetSpreadsheetId,
                range: `${sheetName}!A1:O1`
            });
            
            if (!headerCheck.data.values || headerCheck.data.values.length === 0) {
                console.log('📝 Adicionando cabeçalhos...');
                const headers = [
                    'ID_Sessao',
                    'ID_Participante', 
                    'Num_Rodada',
                    'Idade',
                    'Genero_Participante',
                    'Experiencia_com_Jogos',
                    'ID_Caso',
                    'Tipo_de_Historia',
                    'Genero_Suspeito',
                    'Tempo_de_Decisao_s',
                    'Decisao_Final',
                    'Mudanca_de_Voto',
                    'Resultado_Real_Caso',
                    'Num_Jogadores_Sessao',
                    'Versão'
                ];
                
                await sheets.spreadsheets.values.update({
                    spreadsheetId: targetSpreadsheetId,
                    range: `${sheetName}!A1:O1`,
                    valueInputOption: 'RAW',
                    resource: { values: [headers] }
                });
                console.log('✅ Cabeçalhos adicionados');
            }
        } catch (error) {
            console.error('❌ Erro ao verificar/adicionar cabeçalhos:', error);
        }

        // Envia dados para o Google Sheets
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: targetSpreadsheetId,
            range: `${sheetName}!A:O`,
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: data
            }
        });

        console.log(`✅ Dados enviados com sucesso! ${response.data.updates.updatedRows} linhas atualizadas`);

        res.json({
            success: true,
            message: 'Dados enviados com sucesso',
            data: {
                updatedRows: response.data.updates.updatedRows,
                updatedRange: response.data.updates.updatedRange,
                spreadsheetId: targetSpreadsheetId,
                sheetName: sheetName
            }
        });

    } catch (error) {
        console.error('❌ Erro ao enviar dados:', error);
        
        // Erro específico do Google Sheets
        if (error.code === 403) {
            return res.status(403).json({
                success: false,
                message: 'Acesso negado à planilha. Verifique as permissões.',
                error: 'PERMISSION_DENIED'
            });
        }
        
        if (error.code === 404) {
            return res.status(404).json({
                success: false,
                message: 'Planilha não encontrada. Verifique o ID.',
                error: 'SPREADSHEET_NOT_FOUND'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor',
            error: error.message
        });
    }
});

// Rota para ler dados da planilha (opcional)
app.get('/api/sheets/read', async (req, res) => {
    try {
        const { spreadsheetId, range = 'The Chamber Data!A:O' } = req.query;
        
        if (!auth || !sheets) {
            return res.status(500).json({
                success: false,
                message: 'Google Sheets não inicializado'
            });
        }

        const targetSpreadsheetId = spreadsheetId || process.env.SPREADSHEET_ID || '1PcAveY4HB4sAu-alSXaGArkqErY1Xa5J2VKZlM52xHs';

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: targetSpreadsheetId,
            range: range
        });

        res.json({
            success: true,
            data: response.data.values || [],
            range: response.data.range,
            majorDimension: response.data.majorDimension
        });

    } catch (error) {
        console.error('❌ Erro ao ler dados:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao ler dados',
            error: error.message
        });
    }
});

// Rota para limpar dados da planilha (opcional)
app.delete('/api/sheets/clear', async (req, res) => {
    try {
        const { spreadsheetId, range = 'The Chamber Data!A2:O' } = req.body;
        
        if (!auth || !sheets) {
            return res.status(500).json({
                success: false,
                message: 'Google Sheets não inicializado'
            });
        }

        const targetSpreadsheetId = spreadsheetId || process.env.SPREADSHEET_ID || '1PcAveY4HB4sAu-alSXaGArkqErY1Xa5J2VKZlM52xHs';

        const response = await sheets.spreadsheets.values.clear({
            spreadsheetId: targetSpreadsheetId,
            range: range
        });

        res.json({
            success: true,
            message: 'Dados limpos com sucesso',
            clearedRange: response.data.clearedRange
        });

    } catch (error) {
        console.error('❌ Erro ao limpar dados:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao limpar dados',
            error: error.message
        });
    }
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
    console.error('❌ Erro não tratado:', error);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: error.message
    });
});

// Rota 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Rota não encontrada',
        availableRoutes: [
            'GET /',
            'GET /api/status',
            'POST /api/sheets/append',
            'GET /api/sheets/read',
            'DELETE /api/sheets/clear'
        ]
    });
});

// Inicialização do servidor
async function startServer() {
    try {
        // Inicializa Google Sheets
        await initializeGoogleSheets();
        
        // Inicia o servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor The Chamber rodando na porta ${PORT}`);
            console.log(`📊 Google Sheets: ${auth ? '✅ Conectado' : '❌ Desconectado'}`);
            console.log(`🌐 Acesse: http://localhost:${PORT}`);
            console.log(`📱 Frontend: http://localhost:${PORT}/index.html`);
        });
    } catch (error) {
        console.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

// Tratamento de sinais para graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Servidor sendo encerrado...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Servidor sendo encerrado...');
    process.exit(0);
});

// Inicia o servidor
startServer(); 