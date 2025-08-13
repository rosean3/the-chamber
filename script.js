// Configurações do Experimento
const MAX_ROUNDS = 6;
const COLORS = {
    PRIMARY: '#00c8ff',
    SECONDARY: '#c8ffff',
    BG: '#05050f',
    DANGER: '#ff3232',
    SUCCESS: '#32ff96',
    SCROLLBAR: '#0096c8'
};

// Banco de Casos V1 (originais)
const CASE_POOL_V1 = [
    {
        "id": 1, "type": "Real", "suspect_gender": "Feminino", "version": 1,
        "fragments": [
            "Uma médica é vista saindo apressada de uma sala de cirurgia.",
            "Minutos depois, um alarme soa. Um paciente na mesma sala teve uma parada cardíaca e faleceu.",
            "Uma enfermeira alega ter ouvido a médica discutir com o paciente momentos antes do alarme.",
            "A investigação revela que a médica estava em um plantão de 36 horas.",
            "É descoberto que a médica havia solicitado equipamento de emergência que não foi fornecido pelo hospital.",
            "A autópsia confirma que a condição do paciente era pré-existente e gravíssima, tornando a sobrevivência improvável."
        ],
        "full_story": "A médica, exausta e trabalhando com recursos inadequados, teve uma discussão com o paciente tentando convencê-lo da necessidade de um procedimento arriscado. Ela saiu para buscar equipamento em outra sala, mas o paciente faleceu antes de sua volta. Foi absolvida por não haver negligência.",
        "real_outcome": 0 // Inocente
    },
    {
        "id": 2, "type": "Fictícia", "suspect_gender": "Masculino", "version": 1,
        "fragments": [
            "Um programador é demitido de uma startup de tecnologia.",
            "Na mesma noite, o servidor principal da empresa contendo todo o código-fonte é completamente apagado.",
            "Registros de acesso mostram que o login do programador demitido foi usado para apagar os arquivos.",
            "O programador tem um álibi: estava em um bar com amigos, longe do escritório.",
            "Ele alega que sua senha era fraca e conhecida por vários colegas.",
            "Um colega de equipe, que estava no escritório naquela noite, recentemente teve uma grande discussão com a diretoria por não receber crédito pelo projeto."
        ],
        "full_story": "O colega de equipe, sentindo-se injustiçado e sabendo a senha do programador demitido, usou o acesso dele para apagar o servidor, como vingança contra a empresa e para incriminar o ex-colega. O programador era inocente.",
        "real_outcome": 0 // Inocente
    },
    {
        "id": 3, "type": "Fictícia", "suspect_gender": "Masculino", "version": 1,
        "fragments": [
            "Um restaurador de arte é contratado para limpar uma pintura famosa em um museu.",
            "Após a devolução, um especialista alega que a pintura é uma falsificação quase perfeita.",
            "O restaurador foi o último a ter acesso exclusivo à obra de arte.",
            "Uma investigação financeira revela que o restaurador possui grandes dívidas de jogo não declaradas.",
            "Partículas de um pigmento moderno, inexistente na época do pintor original, são encontradas no ateliê do restaurador.",
            "Registros bancários mostram um grande depósito anônimo na conta do restaurador uma semana após a devolução da pintura."
        ],
        "full_story": "O restaurador, pressionado por dívidas, criou uma cópia meticulosa da obra. Durante o processo de 'restauração', ele trocou a original pela falsa e vendeu a pintura verdadeira no mercado negro para pagar suas dívidas. Ele foi considerado culpado.",
        "real_outcome": 1 // Culpado
    },
    {
        "id": 4, "type": "Real", "suspect_gender": "Feminino", "version": 1,
        "fragments": [
            "A fórmula secreta de um novo produto farmacêutico é vazada para uma empresa concorrente.",
            "Uma cientista sênior do projeto tinha acesso irrestrito à fórmula.",
            "Registros mostram que a cientista transferiu o arquivo da fórmula para um pen drive pessoal dias antes do vazamento.",
            "A cientista alega que fez o backup para trabalhar em uma apresentação em casa e perdeu o pen drive.",
            "Um assistente de laboratório júnior foi visto usando o computador da cientista fora do horário de expediente.",
            "O histórico de e-mails do assistente revela contato com um executivo da empresa concorrente."
        ],
        "full_story": "O assistente de laboratório, ambicioso e mal-intencionado, roubou o pen drive da cientista e vazou a fórmula para a concorrência em troca de uma oferta de emprego. A cientista foi usada como bode expiatório, mas acabou sendo inocentada.",
        "real_outcome": 0 // Inocente
    },
    {
        "id": 5, "type": "Fictícia", "suspect_gender": "Masculino", "version": 1,
        "fragments": [
            "Um pedestre é morto em um atropelamento e fuga durante a noite.",
            "Uma testemunha ocular descreve um carro sedan escuro, modelo que corresponde ao do suspeito.",
            "O carro do suspeito é encontrado em sua garagem com danos na parte dianteira, coberto por uma lona.",
            "O suspeito afirma que seu carro foi roubado na noite do acidente e que ele só percebeu na manhã seguinte.",
            "A perícia encontra apenas as impressões digitais do suspeito no volante e no interior do carro.",
            "Os dados de localização do celular do suspeito o colocam na rua exata do acidente no momento em que ocorreu."
        ],
        "full_story": "O suspeito estava dirigindo, distraiu-se e atingiu o pedestre. Em pânico, ele fugiu do local e inventou a história do roubo para tentar escapar da responsabilidade. As provas digitais e forenses provaram sua culpa.",
        "real_outcome": 1 // Culpado
    },
    {
        "id": 6, "type": "Fictícia", "suspect_gender": "Feminino", "version": 1,
        "fragments": [
            "Uma professora é acusada de vazar as respostas de uma prova nacional.",
            "Um aluno foi pego com uma cópia idêntica à prova oficial antes do exame.",
            "O arquivo da prova foi acessado no computador da professora na véspera.",
            "A professora nega envolvimento e afirma que deixou o computador desbloqueado na sala dos professores.",
            "Câmeras mostram outro docente mexendo no computador enquanto ela estava fora.",
            "Esse docente confessa ter copiado o arquivo e vendido as respostas a vários alunos."
        ],
        "full_story": "A professora foi vítima de negligência ao deixar o computador desbloqueado, mas não participou do vazamento. O verdadeiro culpado era outro professor, que confessou o crime.",
        "real_outcome": 0 // Inocente
    },
    {
        "id": 7, "type": "Fictícia", "suspect_gender": "Feminino", "version": 1,
        "fragments": [
            "Uma influenciadora digital é acusada de fraude em uma campanha de arrecadação para vítimas de enchente.",
            "Mais de R$ 500 mil foram arrecadados através das redes sociais dela.",
            "As vítimas afirmam não ter recebido qualquer ajuda proveniente da campanha.",
            "Extratos mostram transferências da conta da campanha para a conta pessoal da influenciadora.",
            "Ela alega que fez os saques para agilizar as compras de doações.",
            "Perícia comprova que parte significativa do dinheiro foi gasta em itens de luxo."
        ],
        "full_story": "A influenciadora usou a tragédia para enriquecer, desviando a maior parte dos recursos para gastos pessoais. Foi condenada por estelionato e apropriação indébita.",
        "real_outcome": 1
    },
    {
        "id": 8, "type": "Real", "suspect_gender": "Masculino", "version": 1,
        "fragments": [
            "Um motorista de ônibus é acusado de provocar um acidente fatal.",
            "Testemunhas dizem que ele dirigia acima da velocidade permitida.",
            "O tacógrafo indica velocidade 20% superior ao limite no momento do impacto.",
            "O motorista afirma que o sistema de freios apresentou falha repentina.",
            "A perícia confirma desgaste excessivo nos freios, incompatível com manutenção recente.",
            "A empresa responsável admite que ignorou pedidos de revisão feitos pelo motorista."
        ],
        "full_story": "O motorista não teve culpa direta; o acidente foi resultado de negligência da empresa que não realizou a manutenção. Ele foi inocentado.",
        "real_outcome": 0
    },
    {
        "id": 9, "type": "Fictícia", "suspect_gender": "Masculino", "version": 1,
        "fragments": [
            "Um cientista é acusado de manipular dados em uma pesquisa sobre vacinas.",
            "O artigo publicado apresenta resultados surpreendentes e altamente positivos.",
            "Colegas notam inconsistências nas planilhas originais e denunciam à instituição.",
            "O cientista argumenta que as discrepâncias ocorreram por erro de digitação.",
            "Um backup dos arquivos originais revela dados muito diferentes dos publicados.",
            "Descobre-se que ele alterou os resultados para garantir financiamento milionário."
        ],
        "full_story": "O cientista cometeu fraude deliberada para manter investimentos no projeto. Foi descredenciado e processado por má conduta científica.",
        "real_outcome": 1
    },
    {
        "id": 10, "type": "Real", "suspect_gender": "Feminino", "version": 1,
        "fragments": [
            "Uma prefeita é acusada de desviar verbas para festas da cidade.",
            "Populares afirmam que ela gastava mais com eventos do que com saúde.",
            "Investigações apontam contratos superfaturados em eventos culturais.",
            "Ela alega que os contratos foram assinados por um secretário, sem seu conhecimento.",
            "Testemunhas dizem que ela insistia em festas luxuosas para 'manter popularidade'.",
            "Perícia contábil prova que as assinaturas nos contratos foram dela."
        ],
        "full_story": "A prefeita usou recursos públicos para autopromoção por meio de festas grandiosas. Foi condenada por improbidade administrativa.",
        "real_outcome": 1
    }
];

// Banco de Casos V2 (atualizados com foco em gênero masculino)
const CASE_POOL_V2 = [
    {
        "id": 1, "type": "Real", "suspect_gender": "Masculino", "version": 3,
        "fragments": [
            "Um médico é visto saindo apressado de uma sala de cirurgia.",
            "Minutos depois, um alarme soa. Um paciente na mesma sala teve uma parada cardíaca e faleceu.",
            "Um enfermeiro alega ter ouvido o médico discutir com o paciente momentos antes do alarme.",
            "A investigação revela que o médico estava em um plantão de 36 horas.",
            "É descoberto que o médico havia solicitado equipamento de emergência que não foi fornecido pelo hospital.",
            "A autópsia confirma que a condição do paciente era pré-existente e gravíssima, tornando a sobrevivência improvável."
        ],
        "full_story": "O médico, exausto e trabalhando com recursos inadequados, teve uma discussão com o paciente tentando convencê-lo da necessidade de um procedimento arriscado. Ele saiu para buscar equipamento em outra sala, mas o paciente faleceu antes de sua volta. Foi absolvido por não haver negligência.",
        "real_outcome": 0
    },
    {
        "id": 2, "type": "Fictícia", "suspect_gender": "Feminino", "version": 3,
        "fragments": [
            "Uma programadora é demitida de uma startup de tecnologia.",
            "Na mesma noite, o servidor principal da empresa contendo todo o código-fonte é completamente apagado.",
            "Registros de acesso mostram que o login da programadora demitida foi usado para apagar os arquivos.",
            "A programadora tem um álibi: estava em um bar com amigas, longe do escritório.",
            "Ela alega que sua senha era fraca e conhecida por várias colegas.",
            "Uma colega de equipe, que estava no escritório naquela noite, recentemente teve uma grande discussão com a diretoria por não receber crédito pelo projeto."
        ],
        "full_story": "A colega de equipe, sentindo-se injustiçada e sabendo a senha da programadora demitida, usou o acesso dela para apagar o servidor, como vingança contra a empresa e para incriminar a ex-colega. A programadora era inocente.",
        "real_outcome": 0
    },
    {
        "id": 3, "type": "Fictícia", "suspect_gender": "Feminino", "version": 3,
        "fragments": [
            "Uma restauradora de arte é contratada para limpar uma pintura famosa em um museu.",
            "Após a devolução, um especialista alega que a pintura é uma falsificação quase perfeita.",
            "A restauradora foi a última a ter acesso exclusivo à obra de arte.",
            "Uma investigação financeira revela que a restauradora possui grandes dívidas de jogo não declaradas.",
            "Partículas de um pigmento moderno, inexistente na época da pintora original, são encontradas no ateliê da restauradora.",
            "Registros bancários mostram um grande depósito anônimo na conta da restauradora uma semana após a devolução da pintura."
        ],
        "full_story": "A restauradora, pressionada por dívidas, criou uma cópia meticulosa da obra. Durante o processo de 'restauração', ela trocou a original pela falsa e vendeu a pintura verdadeira no mercado negro para pagar suas dívidas. Ela foi considerada culpada.",
        "real_outcome": 1
    },
    {
        "id": 4, "type": "Real", "suspect_gender": "Masculino", "version": 3,
        "fragments": [
            "A fórmula secreta de um novo produto farmacêutico é vazada para uma empresa concorrente.",
            "Um cientista sênior do projeto tinha acesso irrestrito à fórmula.",
            "Registros mostram que o cientista transferiu o arquivo da fórmula para um pen drive pessoal dias antes do vazamento.",
            "O cientista alega que fez o backup para trabalhar em uma apresentação em casa e perdeu o pen drive.",
            "Um assistente de laboratório júnior foi visto usando o computador do cientista fora do horário de expediente.",
            "O histórico de e-mails do assistente revela contato com um executivo da empresa concorrente."
        ],
        "full_story": "O assistente de laboratório, ambicioso e mal-intencionado, roubou o pen drive do cientista e vazou a fórmula para a concorrência em troca de uma oferta de emprego. O cientista foi usado como bode expiatório, mas acabou sendo inocentado.",
        "real_outcome": 0
    },
    {
        "id": 5, "type": "Fictícia", "suspect_gender": "Feminino", "version": 3,
        "fragments": [
            "Uma pedestre é morta em um atropelamento e fuga durante a noite.",
            "Uma testemunha ocular descreve um carro sedan escuro, modelo que corresponde ao da suspeita.",
            "O carro da suspeita é encontrado em sua garagem com danos na parte dianteira, coberto por uma lona.",
            "A suspeita afirma que seu carro foi roubado na noite do acidente e que ela só percebeu na manhã seguinte.",
            "A perícia encontra apenas as impressões digitais da suspeita no volante e no interior do carro.",
            "Os dados de localização do celular da suspeita a colocam na rua exata do acidente no momento em que ocorreu."
        ],
        "full_story": "A suspeita estava dirigindo, distraiu-se e atingiu a pedestre. Em pânico, ela fugiu do local e inventou a história do roubo para tentar escapar da responsabilidade. As provas digitais e forenses provaram sua culpa.",
        "real_outcome": 1
    },
    {
        "id": 6, "type": "Fictícia", "suspect_gender": "Masculino", "version": 3,
        "fragments": [
            "Um professor é acusado de vazar as respostas de uma prova nacional.",
            "Um aluno foi pego com uma cópia idêntica à prova oficial antes do exame.",
            "O arquivo da prova foi acessado no computador do professor na véspera.",
            "O professor nega envolvimento e afirma que deixou o computador desbloqueado na sala dos professores.",
            "Câmeras mostram outra docente mexendo no computador enquanto ele estava fora.",
            "Essa docente confessa ter copiado o arquivo e vendido as respostas a vários alunos."
        ],
        "full_story": "O professor foi vítima de negligência ao deixar o computador desbloqueado, mas não participou do vazamento. A verdadeira culpada era outra professora, que confessou o crime.",
        "real_outcome": 0
    },
    {
        "id": 7, "type": "Fictícia", "suspect_gender": "Masculino", "version": 3,
        "fragments": [
            "Um influenciador digital é acusado de fraude em uma campanha de arrecadação para vítimas de enchente.",
            "Mais de R$ 500 mil foram arrecadados através das redes sociais dele.",
            "As vítimas afirmam não ter recebido qualquer ajuda proveniente da campanha.",
            "Extratos mostram transferências da conta da campanha para a conta pessoal do influenciador.",
            "Ele alega que fez os saques para agilizar as compras de doações.",
            "Perícia comprova que parte significativa do dinheiro foi gasta em itens de luxo."
        ],
        "full_story": "O influenciador usou a tragédia para enriquecer, desviando a maior parte dos recursos para gastos pessoais. Foi condenado por estelionato e apropriação indébita.",
        "real_outcome": 1
    },
    {
        "id": 8, "type": "Real", "suspect_gender": "Feminino", "version": 3,
        "fragments": [
            "Uma motorista de ônibus é acusada de provocar um acidente fatal.",
            "Testemunhas dizem que ela dirigia acima da velocidade permitida.",
            "O tacógrafo indica velocidade 20% superior ao limite no momento do impacto.",
            "A motorista afirma que o sistema de freios apresentou falha repentina.",
            "A perícia confirma desgaste excessivo nos freios, incompatível com manutenção recente.",
            "A empresa responsável admite que ignorou pedidos de revisão feitos pela motorista."
        ],
        "full_story": "A motorista não teve culpa direta; o acidente foi resultado de negligência da empresa que não realizou a manutenção. Ela foi inocentada.",
        "real_outcome": 0
    },
    {
        "id": 9, "type": "Fictícia", "suspect_gender": "Feminino", "version": 3,
        "fragments": [
            "Uma cientista é acusada de manipular dados em uma pesquisa sobre vacinas.",
            "O artigo publicado apresenta resultados surpreendentes e altamente positivos.",
            "Colegas notam inconsistências nas planilhas originais e denunciam à instituição.",
            "A cientista argumenta que as discrepâncias ocorreram por erro de digitação.",
            "Um backup dos arquivos originais revela dados muito diferentes dos publicados.",
            "Descobre-se que ela alterou os resultados para garantir financiamento milionário."
        ],
        "full_story": "A cientista cometeu fraude deliberada para manter investimentos no projeto. Foi descredenciada e processada por má conduta científica.",
        "real_outcome": 1
    },
    {
        "id": 10, "type": "Real", "suspect_gender": "Masculino", "version": 3,
        "fragments": [
            "Um prefeito é acusado de desviar verbas para festas da cidade.",
            "Populares afirmam que ele gastava mais com eventos do que com saúde.",
            "Investigações apontam contratos superfaturados em eventos culturais.",
            "Ele alega que os contratos foram assinados por um secretário, sem seu conhecimento.",
            "Testemunhas dizem que ele insistia em festas luxuosas para 'manter popularidade'.",
            "Perícia contábil prova que as assinaturas nos contratos foram dele."
        ],
        "full_story": "O prefeito usou recursos públicos para autopromoção por meio de festas grandiosas. Foi condenado por improbidade administrativa.",
        "real_outcome": 1
    }
];

// Classe Player
class Player {
    constructor(playerId) {
        this.id = playerId;
        this.age = "";
        this.gender = "";
        this.experience = 0;
    }
}

// Classe GoogleSheetsManager com implementação real
class GoogleSheetsManager {
    constructor() {
        this.service = null;
        this.spreadsheetId = null;
        this.credentials = null;
        this.isInitialized = false;
        this.backendUrl = this.detectBackendUrl();
        this.loadConfig();
    }

    // Detecta automaticamente a URL do backend
    detectBackendUrl() {
        // Se está rodando em localhost, usa o backend local
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('🏠 Ambiente local detectado, usando backend local');
            return window.CONFIG?.BACKEND?.LOCAL_URL || 'http://localhost:3000';
        } else {
            // Se está em produção (Render), usa o backend deployado
            console.log('☁️ Ambiente de produção detectado, usando backend Render');
            return window.CONFIG?.BACKEND?.RENDER_URL || 'https://the-chamber-backend.onrender.com';
        }
    }

    async loadConfig() {
        try {
            // Tenta carregar do localStorage primeiro
            const config = localStorage.getItem('googleSheetsConfig');
            if (config) {
                const parsed = JSON.parse(config);
                this.spreadsheetId = parsed.spreadsheetId;
                this.credentials = parsed.credentials;
                console.log('📊 Configuração do Google Sheets carregada do localStorage');
                return;
            }

            // Se não há configuração salva, carrega automaticamente do arquivo
            await this.loadCredentialsFromFile();
        } catch (error) {
            console.error('Erro ao carregar configuração:', error);
        }
    }

    async loadCredentialsFromFile() {
        try {
            // Carrega o arquivo credentials.json
            const response = await fetch('credentials.json');
            if (!response.ok) {
                throw new Error('Não foi possível carregar credentials.json');
            }

            const credentials = await response.json();
            this.credentials = credentials;
            
            // Lê o ID da planilha do arquivo de configuração (padrão V1)
            this.spreadsheetId = window.CONFIG?.GOOGLE_SHEETS?.SPREADSHEET_ID || '1PcAveY4HB4sAu-alSXaGArkqErY1Xa5J2VKZlM52xHs';

            console.log('📊 Credenciais carregadas automaticamente do arquivo credentials.json');
            console.log('📊 ID da planilha padrão (V1):', this.spreadsheetId);
            console.log('📊 Email da conta de serviço:', credentials.client_email);

            // Salva no localStorage para uso futuro
            this.saveConfigToStorage();
        } catch (error) {
            console.error('❌ Erro ao carregar credenciais do arquivo:', error);
            console.log('⚠️ Google Sheets não será inicializado automaticamente');
        }
    }

    // Método para atualizar o ID da planilha baseado na versão selecionada
    updateSpreadsheetId(version) {
        if (version === 1) {
            this.spreadsheetId = window.CONFIG?.GOOGLE_SHEETS?.SPREADSHEET_ID || '1PcAveY4HB4sAu-alSXaGArkqErY1Xa5J2VKZlM52xHs'; // V1
            console.log('📊 Usando planilha V1:', this.spreadsheetId);
        } else if (version === 2) {
            this.spreadsheetId = window.CONFIG?.GOOGLE_SHEETS?.SPREADSHEET_ID_V2 || '1iEZZ6iUJqmyp8FDGZXw4nX_Q_1XQJWFmH1q3S0LenOg'; // V2
            console.log('📊 Usando planilha V2:', this.spreadsheetId);
        }
        
        // Atualiza no localStorage
        this.saveConfigToStorage();
    }

    saveConfigToStorage() {
        localStorage.setItem('googleSheetsConfig', JSON.stringify({
            credentials: this.credentials,
            spreadsheetId: this.spreadsheetId
        }));
        console.log('✅ Configuração salva no localStorage');
    }

    saveConfig(credentials, spreadsheetId) {
        this.credentials = credentials;
        this.spreadsheetId = spreadsheetId;
        this.saveConfigToStorage();
        console.log('✅ Configuração do Google Sheets salva');
    }

    async initializeService() {
        if (!this.credentials || !this.spreadsheetId) {
            console.warn('⚠️ Google Sheets não configurado');
            return false;
        }

        try {
            console.log('🔄 Inicializando Google Sheets via backend...');
            
            // Testa conexão com o backend
            const statusResponse = await fetch(`${this.backendUrl}/api/status`);
            
            if (statusResponse.ok) {
                const statusData = await statusResponse.json();
                
                if (statusData.success && statusData.status === 'connected') {
                    this.isInitialized = true;
                    console.log('✅ Google Sheets inicializado com sucesso via backend');
                    console.log('📊 Planilha:', statusData.spreadsheet.title);
                    return true;
                } else {
                    console.warn('⚠️ Backend conectado mas Google Sheets não disponível');
                    return false;
                }
            } else {
                console.error('❌ Backend não está respondendo');
                return false;
            }
        } catch (error) {
            console.error('❌ Erro ao inicializar Google Sheets:', error);
            console.log('💡 Certifique-se de que o backend está rodando em', this.backendUrl);
            return false;
        }
    }

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

            console.log('📊 Enviando dados para backend:', values);

            // Envia dados para o backend
            const response = await fetch(`${this.backendUrl}/api/sheets/append`, {
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
                console.log('✅ Dados enviados para Google Sheets via backend:', result);
                return true;
            } else {
                const errorData = await response.json();
                console.error('❌ Erro do backend:', errorData);
                throw new Error(errorData.message || 'Falha na resposta do servidor');
            }
        } catch (error) {
            console.error('❌ Erro ao enviar dados:', error);
            return false;
        }
    }

    async testConnection() {
        if (!this.isInitialized || !this.spreadsheetId) return false;

        try {
            const response = await fetch(`${this.backendUrl}/api/status`);
            if (response.ok) {
                const data = await response.json();
                return data.success && data.status === 'connected';
            }
            return false;
        } catch (error) {
            console.error('❌ Erro ao testar conexão:', error);
            return false;
        }
    }

    getStatus() {
        if (!this.credentials || !this.spreadsheetId) {
            return 'Não configurado';
        }
        if (!this.isInitialized) {
            return 'Não inicializado';
        }
        return 'Conectado';
    }

    // Método para verificar se o backend está disponível
    async checkBackendHealth() {
        try {
            const response = await fetch(`${this.backendUrl}/`);
            return response.ok;
        } catch (error) {
            return false;
        }
    }
}

// Estado global do jogo
let gameState = {
    currentScreen: 'version-selection',
    selectedVersion: null,
    currentCasePool: null,
    player: null,
    currentCaseIndex: 0,
    currentRound: 1,
    sessionId: null,
    collectedData: [],
    playerVotesHistory: [],
    sheetsManager: null,
    roundStartTime: null
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM carregado, inicializando The Chamber...');
    initializeGame();
    setupEventListeners();
});

function initializeGame() {
    console.log('🔄 Inicializando jogo...');
    gameState.sheetsManager = new GoogleSheetsManager();
    gameState.sessionId = `SESSAO_${Date.now()}`;
    
    console.log('🚀 The Chamber inicializado');
    console.log('📊 Status Google Sheets:', gameState.sheetsManager.getStatus());
    
    // Atualiza status inicial
    updateSheetsStatus();
    
    // Atualiza status a cada 5 segundos
    setInterval(updateSheetsStatus, 5000);
    
    // Verifica saúde do backend e inicializa Google Sheets
    checkBackendAndInitialize();
}

async function checkBackendAndInitialize() {
    try {
        console.log('🔍 Verificando saúde do backend...');
        
        if (!gameState.sheetsManager) {
            console.error('❌ Google Sheets Manager não inicializado');
            return;
        }
        
        const backendHealthy = await gameState.sheetsManager.checkBackendHealth();
        
        if (backendHealthy) {
            console.log('✅ Backend está funcionando');
            showNotification('Backend conectado com sucesso!', 'success');
            
            setTimeout(async () => {
                if (gameState.sheetsManager.credentials) {
                    console.log('🔄 Inicializando Google Sheets automaticamente...');
                    await initializeGoogleSheets();
                }
            }, 2000);
        } else {
            console.log('⚠️ Backend não está respondendo');
            console.log('💡 Execute o backend com: cd the-chamber-backend && npm start');
            showNotification('Backend não está rodando. Execute: npm start na pasta the-chamber-backend', 'warning');
        }
    } catch (error) {
        console.error('❌ Erro ao verificar backend:', error);
        showNotification('Erro ao verificar backend', 'error');
    }
}

function setupEventListeners() {
    console.log('🔧 Configurando event listeners...');
    
    // Botões de seleção de versão
    const version1Btn = document.getElementById('version-1-btn');
    const version2Btn = document.getElementById('version-2-btn');
    
    if (version1Btn) {
        version1Btn.addEventListener('click', () => {
            console.log('🎯 Versão 1 selecionada');
            selectVersion(1);
        });
    } else {
        console.error('❌ Botão versão 1 não encontrado');
    }
    
    if (version2Btn) {
        version2Btn.addEventListener('click', () => {
            console.log('🎯 Versão 2 selecionada');
            selectVersion(2);
        });
    } else {
        console.error('❌ Botão versão 2 não encontrado');
    }

    // Botão de início
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            console.log('🚀 Iniciando experimento...');
            showScreen('demographics');
        });
    } else {
        console.error('❌ Botão de início não encontrado');
    }

    // Botão de confirmação de demografia
    const confirmBtn = document.getElementById('confirm-demographics-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            console.log('✅ Confirmando demografia...');
            if (validateDemographics()) {
                startExperiment();
            }
        });
    } else {
        console.error('❌ Botão de confirmação não encontrado');
    }

    // Botões de escolha de gênero
    document.querySelectorAll('[data-gender]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            console.log('👤 Gênero selecionado:', e.target.dataset.gender);
            selectChoice('gender', e.target.dataset.gender);
        });
    });

    // Botões de escolha de experiência
    document.querySelectorAll('[data-experience]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            console.log('🎮 Experiência selecionada:', e.target.dataset.experience);
            selectChoice('experience', parseInt(e.target.dataset.experience));
        });
    });

    // Input de idade
    const ageInput = document.getElementById('age-input');
    if (ageInput) {
        ageInput.addEventListener('input', (e) => {
            gameState.player.age = e.target.value;
            updateConfirmButton();
        });
    } else {
        console.error('❌ Input de idade não encontrado');
    }

    // Botões de votação
    const culpadoBtn = document.getElementById('culpado-btn');
    const inocenteBtn = document.getElementById('inocente-btn');
    
    if (culpadoBtn) {
        culpadoBtn.addEventListener('click', () => {
            console.log('🔴 Decisão: CULPADO');
            makeDecision(1);
        });
    } else {
        console.error('❌ Botão culpado não encontrado');
    }

    if (inocenteBtn) {
        inocenteBtn.addEventListener('click', () => {
            console.log('🟢 Decisão: INOCENTE');
            makeDecision(0);
        });
    } else {
        console.error('❌ Botão inocente não encontrado');
    }

    // Botão de próximo caso
    const nextCaseBtn = document.getElementById('next-case-btn');
    if (nextCaseBtn) {
        nextCaseBtn.addEventListener('click', () => {
            console.log('⏭️ Próximo caso...');
            nextCase();
        });
    } else {
        console.error('❌ Botão próximo caso não encontrado');
    }

    // Botão de download CSV
    const downloadBtn = document.getElementById('download-csv-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            console.log('📥 Download CSV...');
            downloadCSV();
        });
    } else {
        console.error('❌ Botão download não encontrado');
    }

    // Configuração do Google Sheets
    const saveSheetsBtn = document.getElementById('save-sheets-config');
    const cancelSheetsBtn = document.getElementById('cancel-sheets-config');
    
    if (saveSheetsBtn) {
        saveSheetsBtn.addEventListener('click', () => {
            console.log('💾 Salvando configuração Google Sheets...');
            saveSheetsConfig();
        });
    } else {
        console.error('❌ Botão salvar configuração não encontrado');
    }

    if (cancelSheetsBtn) {
        cancelSheetsBtn.addEventListener('click', () => {
            console.log('❌ Cancelando configuração Google Sheets...');
            hideModal('sheets-modal');
        });
    } else {
        console.error('❌ Botão cancelar configuração não encontrado');
    }

    console.log('✅ Event listeners configurados');
}

// Função para selecionar a versão do experimento
function selectVersion(version) {
    console.log(`🎯 Selecionando versão ${version}...`);
    
    gameState.selectedVersion = version;
    
    // Atualiza o pool de casos baseado na versão
    if (version === 1) {
        gameState.currentCasePool = CASE_POOL_V1;
        console.log('🎯 Versão 1 selecionada - Casos originais');
        console.log(`📊 Total de casos: ${gameState.currentCasePool.length}`);
    } else if (version === 2) {
        gameState.currentCasePool = CASE_POOL_V2;
        console.log('🎯 Versão 2 selecionada - Casos atualizados');
        console.log(`📊 Total de casos: ${gameState.currentCasePool.length}`);
    } else {
        console.error('❌ Versão inválida:', version);
        return;
    }
    
    // Atualiza o ID da planilha no Google Sheets Manager
    if (gameState.sheetsManager) {
        gameState.sheetsManager.updateSpreadsheetId(version);
    }
    
    // Atualiza o indicador de versão na tela de introdução
    const versionDisplay = document.getElementById('current-version-display');
    if (versionDisplay) {
        versionDisplay.textContent = `VERSÃO ${version}`;
        console.log('📱 Indicador de versão atualizado');
    }
    
    // Mostra a tela de introdução
    console.log('🔄 Mudando para tela de introdução...');
    showScreen('intro');
    
    console.log(`✅ Versão ${version} selecionada com sucesso`);
    console.log(`📊 Pool de casos: ${gameState.currentCasePool.length} casos`);
    if (gameState.sheetsManager) {
        console.log(`📊 Planilha: ${gameState.sheetsManager.spreadsheetId}`);
    }
}

function showScreen(screenName) {
    console.log(`🔄 Mudando para tela: ${screenName}`);
    
    // Esconde todas as telas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
        console.log(`   📱 Escondendo tela: ${screen.id}`);
    });

    // Mostra a tela solicitada
    const targetScreen = document.getElementById(`${screenName}-screen`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        gameState.currentScreen = screenName;
        console.log(`   ✅ Tela ativada: ${screenName}`);
    } else {
        console.error(`❌ Tela não encontrada: ${screenName}-screen`);
        return;
    }

    // Inicializa a tela se necessário
    if (screenName === 'demographics') {
        console.log('   🔧 Inicializando tela de demografia...');
        initializeDemographics();
    } else if (screenName === 'voting') {
        console.log('   🔧 Inicializando tela de votação...');
        initializeVoting();
        gameState.roundStartTime = Date.now();
    } else if (screenName === 'final') {
        console.log('   🔧 Inicializando tela de revelação final...');
        initializeFinalRevelation();
    } else if (screenName === 'completion') {
        console.log('   🔧 Inicializando tela de finalização...');
        // Salva todos os dados restantes
        saveAllRemainingData();
    }
    
    console.log(`✅ Mudança para tela ${screenName} concluída`);
}

function initializeDemographics() {
    console.log('👤 Inicializando tela de demografia...');
    
    if (!gameState.player) {
        gameState.player = new Player(1);
        console.log('   ✅ Novo jogador criado');
    }
    
    updateConfirmButton();
    console.log('   ✅ Tela de demografia inicializada');
}

function selectChoice(type, value) {
    console.log(`🎯 Selecionando ${type}: ${value}`);
    
    if (!gameState.player) {
        console.error('❌ Jogador não inicializado');
        return;
    }
    
    if (type === 'gender') {
        gameState.player.gender = value;
        updateGenderButtons(value);
        console.log(`   👤 Gênero definido: ${value}`);
    } else if (type === 'experience') {
        gameState.player.experience = value;
        updateExperienceButtons(value);
        console.log(`   🎮 Experiência definida: ${value}`);
    }
    
    updateConfirmButton();
    console.log(`✅ ${type} selecionado com sucesso`);
}

function updateGenderButtons(selectedGender) {
    console.log(`👤 Atualizando botões de gênero para: ${selectedGender}`);
    
    document.querySelectorAll('[data-gender]').forEach(btn => {
        if (btn.dataset.gender === selectedGender) {
            btn.classList.add('selected');
            console.log(`   ✅ Botão ${selectedGender} selecionado`);
        } else {
            btn.classList.remove('selected');
        }
    });
}

function updateExperienceButtons(selectedExperience) {
    console.log(`🎮 Atualizando botões de experiência para: ${selectedExperience}`);
    
    document.querySelectorAll('[data-experience]').forEach(btn => {
        if (parseInt(btn.dataset.experience) === selectedExperience) {
            btn.classList.add('selected');
            console.log(`   ✅ Botão experiência ${selectedExperience} selecionado`);
        } else {
            btn.classList.remove('selected');
        }
    });
}

function updateConfirmButton() {
    console.log('🔘 Atualizando botão de confirmação...');
    
    const confirmBtn = document.getElementById('confirm-demographics-btn');
    if (!confirmBtn) {
        console.error('❌ Botão de confirmação não encontrado');
        return;
    }
    
    if (!gameState.player) {
        console.error('❌ Jogador não inicializado');
        return;
    }
    
    const hasAge = gameState.player.age && gameState.player.age.trim() !== '';
    const hasGender = gameState.player.gender && gameState.player.gender.trim() !== '';
    const hasExperience = gameState.player.experience > 0;
    
    const isValid = hasAge && hasGender && hasExperience;
    
    confirmBtn.disabled = !isValid;
    
    console.log(`   📊 Validação: Idade=${hasAge}, Gênero=${hasGender}, Experiência=${hasExperience}`);
    console.log(`   🔘 Botão habilitado: ${isValid}`);
}

function validateDemographics() {
    console.log('🔍 Validando dados demográficos...');
    
    if (!gameState.player) {
        console.error('❌ Jogador não inicializado');
        alert('Erro: Jogador não inicializado');
        return false;
    }
    
    const hasAge = gameState.player.age && gameState.player.age.trim() !== '';
    const hasGender = gameState.player.gender && gameState.player.gender.trim() !== '';
    const hasExperience = gameState.player.experience > 0;
    
    console.log(`   📊 Validação: Idade=${hasAge}, Gênero=${hasGender}, Experiência=${hasExperience}`);
    
    if (!hasAge || !hasGender || !hasExperience) {
        const missingFields = [];
        if (!hasAge) missingFields.push('idade');
        if (!hasGender) missingFields.push('gênero');
        if (!hasExperience) missingFields.push('experiência');
        
        console.warn(`⚠️ Campos faltando: ${missingFields.join(', ')}`);
        alert(`Por favor, preencha todos os campos obrigatórios: ${missingFields.join(', ')}`);
        return false;
    }
    
    console.log('✅ Dados demográficos válidos');
    return true;
}

function startExperiment() {
    console.log('🚀 Iniciando experimento...');
    
    if (!gameState.currentCasePool) {
        console.error('❌ Pool de casos não definido. Selecione uma versão primeiro.');
        alert('Erro: Selecione uma versão primeiro');
        return;
    }
    
    if (!gameState.player) {
        console.error('❌ Jogador não inicializado');
        alert('Erro: Jogador não inicializado');
        return;
    }
    
    console.log(`   📊 Versão selecionada: ${gameState.selectedVersion}`);
    console.log(`   📊 Pool de casos: ${gameState.currentCasePool.length} casos`);
    console.log(`   👤 Jogador: ${gameState.player.age} anos, ${gameState.player.gender}, experiência ${gameState.player.experience}`);
    
    gameState.currentCaseIndex = 0;
    gameState.currentRound = 1;
    gameState.collectedData = [];
    gameState.playerVotesHistory = [];
    
    console.log('   ✅ Estado do experimento inicializado');
    startCase();
}

function startCase() {
    console.log(`🎯 Iniciando caso ${gameState.currentCaseIndex + 1}...`);
    
    if (!gameState.currentCasePool) {
        console.error('❌ Pool de casos não definido');
        return;
    }
    
    if (gameState.currentCaseIndex >= gameState.currentCasePool.length) {
        console.log('🏁 Todos os casos foram completados');
        showScreen('completion');
        return;
    }

    gameState.currentRound = 1;
    console.log(`   📊 Caso ${gameState.currentCaseIndex + 1} de ${gameState.currentCasePool.length}`);
    showScreen('voting');
}

function initializeVoting() {
    console.log(`🗳️ Inicializando votação - Rodada ${gameState.currentRound}...`);
    
    if (!gameState.currentCasePool || !gameState.currentCasePool[gameState.currentCaseIndex]) {
        console.error('❌ Caso não encontrado');
        return;
    }
    
    const currentCase = gameState.currentCasePool[gameState.currentCaseIndex];
    const roundTitle = document.getElementById('round-title');
    const caseInfo = document.getElementById('case-info');
    
    if (roundTitle) {
        roundTitle.textContent = `RODADA ${gameState.currentRound} DE ${MAX_ROUNDS}`;
        console.log(`   📊 Título da rodada atualizado`);
    }
    
    if (caseInfo) {
        caseInfo.textContent = `Caso #${currentCase.id} | Gênero do Suspeito: ${currentCase.suspect_gender} | Tipo: ${currentCase.type}`;
        console.log(`   📊 Informações do caso atualizadas`);
    }
    
    displayFragments();
    console.log(`✅ Votação inicializada para rodada ${gameState.currentRound}`);
}

function displayFragments() {
    console.log(`📝 Exibindo fragmentos para rodada ${gameState.currentRound}...`);
    
    if (!gameState.currentCasePool || !gameState.currentCasePool[gameState.currentCaseIndex]) {
        console.error('❌ Caso não encontrado para exibir fragmentos');
        return;
    }
    
    const currentCase = gameState.currentCasePool[gameState.currentCaseIndex];
    const fragmentsContent = document.getElementById('fragments-content');
    
    if (!fragmentsContent) {
        console.error('❌ Container de fragmentos não encontrado');
        return;
    }
    
    fragmentsContent.innerHTML = '';
    console.log(`   📊 Limpando conteúdo anterior`);
    
    for (let i = 0; i < gameState.currentRound; i++) {
        if (i < currentCase.fragments.length) {
            const fragmentDiv = document.createElement('div');
            fragmentDiv.className = 'fragment-item';
            
            const fragmentTitle = document.createElement('div');
            fragmentTitle.className = 'fragment-title';
            fragmentTitle.textContent = `Info ${i + 1}:`;
            
            const fragmentText = document.createElement('div');
            fragmentText.className = 'fragment-text';
            fragmentText.textContent = currentCase.fragments[i];
            
            fragmentDiv.appendChild(fragmentTitle);
            fragmentDiv.appendChild(fragmentText);
            fragmentsContent.appendChild(fragmentDiv);
            
            console.log(`   📝 Fragmento ${i + 1} adicionado`);
        }
    }
    
    console.log(`✅ ${gameState.currentRound} fragmentos exibidos`);
}

function makeDecision(decision) {
    console.log(`🎯 Decisão tomada: ${decision === 1 ? 'CULPADO' : 'INOCENTE'}`);
    
    if (!gameState.roundStartTime) {
        console.error('❌ Tempo de início da rodada não definido');
        return;
    }
    
    const decisionTime = Date.now() - gameState.roundStartTime;
    const decisionTimeSeconds = Math.round(decisionTime / 100) / 10;
    
    console.log(`   ⏱️ Tempo de decisão: ${decisionTimeSeconds}s`);
    
    if (!gameState.currentCasePool || !gameState.currentCasePool[gameState.currentCaseIndex]) {
        console.error('❌ Caso não encontrado');
        return;
    }
    
    const currentCase = gameState.currentCasePool[gameState.currentCaseIndex];
    
    // Verifica mudança de voto
    let mudancaVoto = 0;
    if (gameState.currentRound > 1 && decision !== gameState.playerVotesHistory[gameState.currentRound - 2]) {
        mudancaVoto = 1;
        console.log(`   🔄 Mudança de voto detectada`);
    }
    
    gameState.playerVotesHistory.push(decision);
    
    // Coleta dados
    const dataRow = {
        "ID_Sessao": gameState.sessionId,
        "ID_Participante": `P${gameState.player.id}`,
        "Num_Rodada": gameState.currentRound,
        "Idade": gameState.player.age,
        "Genero_Participante": gameState.player.gender,
        "Experiencia_com_Jogos": gameState.player.experience,
        "ID_Caso": currentCase.id,
        "Tipo_de_Historia": currentCase.type,
        "Genero_Suspeito": currentCase.suspect_gender,
        "Tempo_de_Decisao_s": decisionTimeSeconds,
        "Decisao_Final": decision,
        "Mudanca_de_Voto": mudancaVoto,
        "Resultado_Real_Caso": currentCase.real_outcome,
        "Num_Jogadores_Sessao": 1,
        "Versão": currentCase.version
    };
    
    gameState.collectedData.push(dataRow);
    console.log(`   📊 Dados da rodada ${gameState.currentRound} coletados`);
    
    // Próxima rodada ou caso
    if (gameState.currentRound < MAX_ROUNDS) {
        gameState.currentRound++;
        console.log(`   ⏭️ Avançando para rodada ${gameState.currentRound}`);
        initializeVoting();
    } else {
        console.log(`   🏁 Caso ${currentCase.id} completado, salvando dados...`);
        // Salva dados no Google Sheets ao final de cada caso
        saveCaseData();
        showScreen('final');
    }
}

// Função para salvar dados de cada caso
async function saveCaseData() {
    const currentCase = gameState.currentCasePool[gameState.currentCaseIndex];
    console.log(`💾 Salvando dados do Caso #${currentCase.id}`);
    
    // Filtra dados apenas deste caso
    const caseData = gameState.collectedData.filter(row => row.ID_Caso === currentCase.id);
    
    // Salva no Google Sheets se disponível
    if (gameState.sheetsManager && gameState.sheetsManager.isInitialized) {
        try {
            showLoading();
            const success = await gameState.sheetsManager.appendData(caseData);
            
            if (success) {
                console.log(`✅ Dados do Caso #${currentCase.id} enviados para Google Sheets`);
                showNotification('Dados salvos no Google Sheets!', 'success');
            } else {
                console.log(`⚠️ Falha ao enviar dados do Caso #${currentCase.id} para Google Sheets`);
                showNotification('Falha ao salvar no Google Sheets. Dados salvos localmente.', 'warning');
            }
        } catch (error) {
            console.error(`❌ Erro ao enviar dados do Caso #${currentCase.id}:`, error);
            showNotification('Erro ao salvar no Google Sheets. Dados salvos localmente.', 'error');
        } finally {
            hideLoading();
        }
    } else {
        console.log(`💾 Google Sheets não disponível. Dados do Caso #${currentCase.id} salvos localmente`);
        showNotification('Dados salvos localmente', 'info');
    }
    
    // Sempre salva localmente como backup
    saveDataLocally(caseData);
}

function saveDataLocally(data) {
    const existingData = JSON.parse(localStorage.getItem('theChamberData') || '[]');
    existingData.push(...data);
    localStorage.setItem('theChamberData', JSON.stringify(existingData));
    console.log('💾 Dados salvos localmente como backup');
}

function showNotification(message, type = 'info') {
    console.log(`🔔 Notificação [${type}]: ${message}`);
    
    // Remove notificações existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Cria nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Adiciona ao body
    document.body.appendChild(notification);
    
    // Mostra a notificação
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove após 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    console.log(`   ✅ Notificação exibida: ${message}`);
}

function initializeFinalRevelation() {
    console.log(`🔍 Inicializando revelação final...`);
    
    if (!gameState.currentCasePool || !gameState.currentCasePool[gameState.currentCaseIndex]) {
        console.error('❌ Caso não encontrado para revelação final');
        return;
    }
    
    const currentCase = gameState.currentCasePool[gameState.currentCaseIndex];
    const caseStory = document.getElementById('case-story');
    const finalVerdict = document.getElementById('final-verdict');
    
    if (caseStory) {
        caseStory.innerHTML = `
            <p><strong>A verdade sobre o Caso #${currentCase.id}:</strong></p>
            <p>${currentCase.full_story}</p>
        `;
        console.log(`   📖 História do caso exibida`);
    }
    
    if (finalVerdict) {
        const outcomeText = currentCase.real_outcome === 1 ? "CULPADO" : "INOCENTE";
        const outcomeClass = currentCase.real_outcome === 1 ? "culpado" : "inocente";
        
        finalVerdict.innerHTML = `
            <h2>O suspeito era: ${outcomeText}</h2>
        `;
        finalVerdict.className = `final-verdict ${outcomeClass}`;
        console.log(`   ⚖️ Veredicto final exibido: ${outcomeText}`);
    }
    
    console.log(`✅ Revelação final inicializada para caso ${currentCase.id}`);
}

function nextCase() {
    console.log(`⏭️ Avançando para próximo caso...`);
    
    if (!gameState.currentCasePool) {
        console.error('❌ Pool de casos não definido');
        return;
    }
    
    gameState.currentCaseIndex++;
    console.log(`   📊 Caso atual: ${gameState.currentCaseIndex + 1} de ${gameState.currentCasePool.length}`);
    
    startCase();
}

function showScreen(screenName) {
    // Esconde todas as telas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Mostra a tela solicitada
    document.getElementById(`${screenName}-screen`).classList.add('active');
    gameState.currentScreen = screenName;

    // Inicializa a tela se necessário
    if (screenName === 'demographics') {
        initializeDemographics();
    } else if (screenName === 'voting') {
        initializeVoting();
        gameState.roundStartTime = Date.now();
    } else if (screenName === 'final') {
        initializeFinalRevelation();
    } else if (screenName === 'completion') {
        // Salva todos os dados restantes
        saveAllRemainingData();
    }
}

async function saveAllRemainingData() {
    if (gameState.collectedData.length === 0) return;
    
    console.log('💾 Salvando todos os dados restantes...');
    
    // Salva no Google Sheets se disponível
    if (gameState.sheetsManager && gameState.sheetsManager.isInitialized) {
        try {
            showLoading();
            const success = await gameState.sheetsManager.appendData(gameState.collectedData);
            
            if (success) {
                console.log('✅ Todos os dados enviados para Google Sheets');
                showNotification('Todos os dados salvos no Google Sheets!', 'success');
            } else {
                console.log('⚠️ Falha ao enviar todos os dados para Google Sheets');
                showNotification('Falha ao salvar todos os dados no Google Sheets.', 'warning');
            }
        } catch (error) {
            console.error('❌ Erro ao enviar todos os dados:', error);
            showNotification('Erro ao salvar todos os dados no Google Sheets.', 'error');
        } finally {
            hideLoading();
        }
    }
    
    // Sempre salva localmente como backup
    saveDataLocally(gameState.collectedData);
}

function downloadCSV() {
    if (gameState.collectedData.length === 0) {
        alert('Nenhum dado para download.');
        return;
    }

    const headers = Object.keys(gameState.collectedData[0]);
    const csvContent = [
        headers.join(','),
        ...gameState.collectedData.map(row => 
            headers.map(header => `"${row[header]}"`).join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `resultados_experimento_${gameState.sessionId}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function showModal(modalId) {
    console.log(`🔓 Mostrando modal: ${modalId}`);
    
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        console.log(`   ✅ Modal ${modalId} exibido`);
    } else {
        console.error(`❌ Modal ${modalId} não encontrado`);
    }
}

function hideModal(modalId) {
    console.log(`🔒 Escondendo modal: ${modalId}`);
    
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        console.log(`   ✅ Modal ${modalId} escondido`);
    } else {
        console.error(`❌ Modal ${modalId} não encontrado`);
    }
}

function saveSheetsConfig() {
    const credentials = document.getElementById('sheets-credentials').value;
    const spreadsheetId = document.getElementById('spreadsheet-id').value;
    
    if (!credentials || !spreadsheetId) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    try {
        // Parse das credenciais JSON
        const parsedCredentials = JSON.parse(credentials);
        
        gameState.sheetsManager.saveConfig(parsedCredentials, spreadsheetId);
        hideModal('sheets-modal');
        
        // Inicializa o serviço
        initializeGoogleSheets();
        
        alert('Configuração salva com sucesso! Google Sheets será inicializado.');
    } catch (error) {
        alert('Erro ao salvar configuração: ' + error.message);
    }
}

async function initializeGoogleSheets() {
    console.log('🔄 Inicializando Google Sheets...');
    
    if (!gameState.sheetsManager) {
        console.error('❌ Google Sheets Manager não inicializado');
        return;
    }
    
    try {
        const success = await gameState.sheetsManager.initializeService();
        
        if (success) {
            console.log('✅ Google Sheets inicializado com sucesso');
            showNotification('Google Sheets conectado!', 'success');
            updateSheetsStatus();
        } else {
            console.log('⚠️ Falha ao inicializar Google Sheets');
            showNotification('Falha ao conectar com Google Sheets', 'warning');
        }
    } catch (error) {
        console.error('❌ Erro ao inicializar Google Sheets:', error);
        showNotification('Erro ao conectar com Google Sheets', 'error');
    }
}

// Função para atualizar status do Google Sheets
function updateSheetsStatus() {
    console.log('📊 Atualizando status do Google Sheets...');
    
    const statusText = document.getElementById('sheets-status-text');
    if (!statusText) {
        console.error('❌ Elemento de status não encontrado');
        return;
    }
    
    if (!gameState.sheetsManager) {
        statusText.textContent = 'Não inicializado';
        console.log('   📊 Status: Não inicializado');
        return;
    }
    
    const status = gameState.sheetsManager.getStatus();
    statusText.textContent = status;
    console.log(`   📊 Status atualizado: ${status}`);
}

// Funções auxiliares
function showLoading() {
    console.log('⏳ Mostrando loading...');
    
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
        console.log('   ✅ Loading exibido');
    } else {
        console.error('❌ Loading overlay não encontrado');
    }
}

function hideLoading() {
    console.log('✅ Escondendo loading...');
    
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
        console.log('   ✅ Loading escondido');
    } else {
        console.error('❌ Loading overlay não encontrado');
    }
}

// Tratamento de erros global
window.addEventListener('error', (event) => {
    console.error('Erro no jogo:', event.error);
    hideLoading();
});

// Prevenção de saída acidental
window.addEventListener('beforeunload', (event) => {
    if (gameState.currentScreen !== 'intro' && gameState.currentScreen !== 'completion') {
        event.preventDefault();
        event.returnValue = 'Tem certeza que deseja sair? Seus dados podem ser perdidos.';
    }
}); 