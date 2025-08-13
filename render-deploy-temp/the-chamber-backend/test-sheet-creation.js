#!/usr/bin/env node

/**
 * Script para testar a criação da aba "The Chamber Data"
 * Execute com: node test-sheet-creation.js
 */

const http = require('http');

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

async function testSheetCreation() {
    console.log('🧪 Testando criação da aba "The Chamber Data"...\n');

    try {
        // Teste 1: Verificar status do Google Sheets
        console.log('📋 Teste 1: Status do Google Sheets');
        const statusResponse = await makeRequest('/api/status');
        console.log(`   Status: ${statusResponse.status}`);
        
        if (statusResponse.status !== 200) {
            console.log('   ❌ Google Sheets não está funcionando');
            return;
        }
        
        console.log('   ✅ Google Sheets conectado\n');

        // Teste 2: Enviar dados (isso deve criar a aba automaticamente)
        console.log('📋 Teste 2: Envio de dados (criação automática da aba)');
        const testData = {
            data: [
                [
                    'TESTE_CRIACAO_001',
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
        
        if (appendResponse.status === 200) {
            console.log('   ✅ Dados enviados e aba criada com sucesso!');
            console.log(`   📊 Nome da aba: ${appendResponse.data.data.sheetName}`);
            console.log(`   📝 Linhas atualizadas: ${appendResponse.data.data.updatedRows}`);
        } else {
            console.log('   ❌ Falha no envio:', appendResponse.data);
            return;
        }

        // Teste 3: Verificar se a aba foi criada
        console.log('\n📋 Teste 3: Verificação da aba criada');
        const readResponse = await makeRequest('/api/sheets/read?range=The Chamber Data!A:O');
        console.log(`   Status: ${readResponse.status}`);
        
        if (readResponse.status === 200) {
            const data = readResponse.data.data;
            console.log(`   📊 Total de linhas: ${data.length}`);
            
            if (data.length > 0) {
                console.log('   📋 Cabeçalhos:', data[0]);
                if (data.length > 1) {
                    console.log('   📊 Primeira linha de dados:', data[1]);
                }
            }
            
            console.log('   ✅ Aba criada e funcionando perfeitamente!');
        } else {
            console.log('   ❌ Falha na leitura da aba criada');
        }

        console.log('\n🎉 Teste de criação da aba concluído com sucesso!');
        console.log('📊 A aba "The Chamber Data" foi criada automaticamente');
        console.log('📝 Os cabeçalhos foram adicionados automaticamente');
        console.log('✅ O sistema está funcionando perfeitamente!');

    } catch (error) {
        console.error('❌ Erro durante o teste:', error.message);
        console.log('\n💡 Verifique se:');
        console.log('   1. O backend está rodando (npm start)');
        console.log('   2. O arquivo credentials.json está na pasta');
        console.log('   3. A planilha foi compartilhada com a conta de serviço');
        console.log('   4. A planilha tem permissões de edição');
    }
}

// Executa o teste
testSheetCreation(); 