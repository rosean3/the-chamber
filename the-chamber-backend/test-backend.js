#!/usr/bin/env node

/**
 * Script de teste para o backend The Chamber
 * Execute com: node test-backend.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Função para fazer requisições HTTP
function makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (error) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

// Testes
async function runTests() {
    console.log('🧪 Iniciando testes do backend The Chamber...\n');

    try {
        // Teste 1: Status do servidor
        console.log('📋 Teste 1: Status do servidor');
        const statusResponse = await makeRequest('/');
        console.log(`   Status: ${statusResponse.status}`);
        console.log(`   Resposta:`, statusResponse.data);
        console.log('   ✅ Status do servidor OK\n');

        // Teste 2: Status do Google Sheets
        console.log('📋 Teste 2: Status do Google Sheets');
        const sheetsStatusResponse = await makeRequest('/api/status');
        console.log(`   Status: ${sheetsStatusResponse.status}`);
        console.log(`   Resposta:`, sheetsStatusResponse.data);
        
        if (sheetsStatusResponse.status === 200) {
            console.log('   ✅ Status do Google Sheets OK\n');
        } else {
            console.log('   ⚠️ Google Sheets não está funcionando\n');
        }

        // Teste 3: Envio de dados de teste
        console.log('📋 Teste 3: Envio de dados de teste');
        const testData = {
            data: [
                [
                    'TESTE_SESSAO_001',
                    'P1',
                    '1',
                    '25',
                    'Feminino',
                    '3',
                    '1',
                    'Real',
                    'Feminino',
                    '2.5',
                    '0',
                    '0',
                    '0',
                    '1',
                    '1'
                ]
            ],
            spreadsheetId: '1PcAveY4HB4sAu-alSXaGArkqErY1Xa5J2VKZlM52xHs'
        };

        const appendResponse = await makeRequest('/api/sheets/append', 'POST', testData);
        console.log(`   Status: ${appendResponse.status}`);
        console.log(`   Resposta:`, appendResponse.data);
        
        if (appendResponse.status === 200) {
            console.log('   ✅ Envio de dados OK\n');
        } else {
            console.log('   ❌ Falha no envio de dados\n');
        }

        // Teste 4: Leitura de dados
        console.log('📋 Teste 4: Leitura de dados');
        const readResponse = await makeRequest('/api/sheets/read?range=The Chamber Data!A:O');
        console.log(`   Status: ${readResponse.status}`);
        
        if (readResponse.status === 200) {
            console.log(`   Dados lidos: ${readResponse.data.data ? readResponse.data.data.length : 0} linhas`);
            console.log('   ✅ Leitura de dados OK\n');
        } else {
            console.log('   ❌ Falha na leitura de dados\n');
        }

        console.log('🎉 Todos os testes concluídos!');
        
        // Resumo
        console.log('\n📊 Resumo dos testes:');
        console.log(`   Servidor: ✅ OK`);
        console.log(`   Google Sheets: ${sheetsStatusResponse.status === 200 ? '✅ OK' : '❌ FALHOU'}`);
        console.log(`   Envio: ${appendResponse.status === 200 ? '✅ OK' : '❌ FALHOU'}`);
        console.log(`   Leitura: ${readResponse.status === 200 ? '✅ OK' : '❌ FALHOU'}`);

    } catch (error) {
        console.error('❌ Erro durante os testes:', error.message);
        console.log('\n💡 Verifique se:');
        console.log('   1. O backend está rodando (npm start)');
        console.log('   2. O arquivo credentials.json está na pasta');
        console.log('   3. A planilha foi compartilhada com a conta de serviço');
    }
}

// Executa os testes
runTests(); 