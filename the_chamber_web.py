import streamlit as st
import random
import time
from datetime import datetime

# Importações para Google Sheets
try:
    from google_sheets_manager import GoogleSheetsManager
    from google_sheets_manager_v2 import GoogleSheetsManagerV2
    GOOGLE_SHEETS_AVAILABLE = True
except ImportError:
    GOOGLE_SHEETS_AVAILABLE = False
    st.warning("⚠️ Módulo Google Sheets não disponível. Os dados serão salvos apenas localmente.")

# --- Configurações do Experimento ---
MAX_ROUNDS = 6

# --- Banco de Casos V1 (Original) ---
CASE_POOL_V1 = [
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
        "real_outcome": 0
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
        "real_outcome": 0
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
        "real_outcome": 1
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
        "real_outcome": 0
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
        "real_outcome": 1
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
        "real_outcome": 0
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
]

# --- Banco de Casos V2 (Novo) ---
CASE_POOL_V2 = [
    {
        "id": 11, "type": "Real", "suspect_gender": "Masculino", "version": 2,
        "fragments": [
            "Um cientista é visto saindo de um laboratório de pesquisa com um material biológico.",
            "O material é identificado como uma substância altamente perigosa e radioativa.",
            "O cientista alega que o material é um composto de pesquisa para um novo medicamento.",
            "O laboratório não possui registro de autorização para manipular substâncias radioativas.",
            "O cientista não possui licença para trabalhar com material radioativo.",
            "O material foi encontrado em seu bolso durante uma inspeção de segurança."
        ],
        "full_story": "O cientista cometeu fraude ao manipular material radioativo sem autorização. Foi condenado por má conduta científica e negligência.",
        "real_outcome": 1
    },
    {
        "id": 12, "type": "Fictícia", "suspect_gender": "Feminino", "version": 2,
        "fragments": [
            "Uma enfermeira é acusada de roubar medicamentos de um hospital.",
            "Ela alega que estava fazendo um favor a um paciente que precisava de um medicamento.",
            "O material roubado é identificado como um antidepresso.",
            "O hospital não possui registro de que o paciente precisava desse medicamento.",
            "O hospital não possui registro de que a enfermeira estava no local naquele momento.",
            "O material roubado foi encontrado em sua casa."
        ],
        "full_story": "A enfermeira roubou medicamentos para ajudar um paciente, mas cometeu fraude ao roubar. Foi condenada por estelionato e negligência.",
        "real_outcome": 1
    },
    {
        "id": 13, "type": "Fictícia", "suspect_gender": "Masculino", "version": 2,
        "fragments": [
            "Um professor é acusado de plagiar um artigo científico.",
            "O artigo original é de um colega de pesquisa.",
            "O professor alega que fez uma cópia para estudar a metodologia.",
            "O artigo original não possui a cópia no histórico dele.",
            "O artigo original foi publicado em uma revista de alta reputação.",
            "O artigo original foi denunciado por outros cientistas."
        ],
        "full_story": "O professor cometeu fraude ao plagiar o artigo. Foi descredenciado e processado por má conduta científica.",
        "real_outcome": 1
    },
    {
        "id": 14, "type": "Real", "suspect_gender": "Feminino", "version": 2,
        "fragments": [
            "Uma advogada é acusada de manipular um processo judicial.",
            "Ela alega que estava defendendo um cliente inocente.",
            "O cliente foi condenado por um crime que a advogada sabia ser falso.",
            "O cliente foi condenado por um crime que a advogada sabia ser falso.",
            "O cliente foi condenado por um crime que a advogada sabia ser falso.",
            "O cliente foi condenado por um crime que a advogada sabia ser falso."
        ],
        "full_story": "A advogada cometeu fraude ao manipular o processo judicial. Foi descredenciada e processada por má conduta profissional.",
        "real_outcome": 1
    },
    {
        "id": 15, "type": "Fictícia", "suspect_gender": "Masculino", "version": 2,
        "fragments": [
            "Um motorista de ônibus é acusado de dirigir sob efeito de álcool.",
            "O motorista alega que estava apenas comendo um sanduíche.",
            "O motorista foi detido por um policial em um posto de controle.",
            "O motorista tem um histórico de acidentes de trânsito.",
            "O motorista tem um histórico de acidentes de trânsito.",
            "O motorista tem um histórico de acidentes de trânsito."
        ],
        "full_story": "O motorista cometeu fraude ao dirigir sob efeito de álcool. Foi condenado por negligência e fraude.",
        "real_outcome": 1
    },
    {
        "id": 16, "type": "Fictícia", "suspect_gender": "Feminino", "version": 2,
        "fragments": [
            "Uma professora é acusada de plagiar um artigo acadêmico.",
            "O artigo original é de um colega de pesquisa.",
            "A professora alega que fez uma cópia para estudar a metodologia.",
            "O artigo original não possui a cópia no histórico dele.",
            "O artigo original foi publicado em uma revista de alta reputação.",
            "O artigo original foi denunciado por outros cientistas."
        ],
        "full_story": "A professora cometeu fraude ao plagiar o artigo. Foi descredenciada e processada por má conduta profissional.",
        "real_outcome": 1
    },
    {
        "id": 17, "type": "Fictícia", "suspect_gender": "Masculino", "version": 2,
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
        "id": 18, "type": "Real", "suspect_gender": "Feminino", "version": 2,
        "fragments": [
            "Uma prefeita é acusada de gastar verbas públicas em festas de luxo.",
            "Ela alega que estava organizando um evento cultural para promover a cidade.",
            "O evento foi um sucesso, mas o custo foi muito alto.",
            "O custo do evento foi de R$ 500 mil, contra um orçamento de R$ 100 mil.",
            "O orçamento foi aprovado pela câmara, mas a prefeita não informou sobre o custo real.",
            "O orçamento foi aprovado pela câmara, mas a prefeita não informou sobre o custo real."
        ],
        "full_story": "A prefeita cometeu fraude ao gastar verbas públicas em festas de luxo. Foi condenada por improbidade administrativa e estelionato.",
        "real_outcome": 1
    }
]

# Combine both case pools
CASE_POOL = CASE_POOL_V1 + CASE_POOL_V2

def get_case_pool_by_version(version):
    """Retorna o pool de casos baseado na versão selecionada"""
    if version == 1:
        return [case for case in CASE_POOL_V1 if case['version'] == 1]
    elif version == 2:
        return [case for case in CASE_POOL_V2 if case['version'] == 2]
    else:
        return CASE_POOL_V1  # Default to v1

def main():
    st.set_page_config(
        page_title="The Chamber - Experimento Individual",
        page_icon="⚖️",
        layout="wide",
        initial_sidebar_state="collapsed"
    )
    
    # Forçar tema escuro
    st.markdown("""
        <style>
        /* Forçar tema escuro global */
        :root {
            --background-color: #1a1a2e !important;
            --text-color: #ffffff !important;
        }
        </style>
    """, unsafe_allow_html=True)
    
    # Custom CSS para interface IDÊNTICA ao Pygame original
    st.markdown("""
        <style>
        /* Forçar fundo escuro em TODA a página - IDÊNTICO ao Pygame */
        body {
            background-color: #05050f !important;
            color: #c8ffff !important;
        }
        
        /* Fundo principal - preto escuro como no Pygame */
        .main {
            background-color: #05050f !important;
            color: #c8ffff !important;
        }
        
        /* Forçar fundo escuro em todos os containers */
        .block-container {
            background-color: #05050f !important;
            padding-top: 1rem !important;
            padding-bottom: 1rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            max-width: 1000px !important;
        }
        
        /* Forçar fundo escuro em todos os elementos */
        .stApp {
            background-color: #05050f !important;
        }
        
        /* Forçar fundo escuro em todas as divs */
        div {
            background-color: #05050f !important;
        }
        
        /* Forçar fundo escuro em todas as seções */
        section {
            background-color: #05050f !important;
        }
        
        /* Forçar fundo escuro em todos os elementos do Streamlit */
        .stMarkdown, .stText, .stButton, .stForm, .stRadio, .stSelectbox, .stTextInput {
            background-color: #05050f !important;
        }
        
        /* Forçar fundo escuro em elementos específicos */
        .stMarkdown > div {
            background-color: #05050f !important;
        }
        
        /* Títulos - azul neon EXATO como no Pygame original */
        h1, h2, h3 {
            color: #00c8ff !important;
            text-align: center !important;
            font-family: 'Courier New', monospace !important;
            font-weight: bold !important;
            font-size: 50px !important;
            text-shadow: none !important;
            letter-spacing: 2px !important;
        }
        
        /* Título principal específico */
        h1 {
            font-size: 60px !important;
            font-weight: 900 !important;
            margin-bottom: 40px !important;
        }
        
        /* Botões - estilo EXATO ao Pygame */
        .stButton > button {
            background-color: transparent !important;
            color: #00c8ff !important;
            border: 2px solid #00c8ff !important;
            border-radius: 5px !important;
            padding: 15px 30px !important;
            font-family: 'Courier New', monospace !important;
            font-weight: bold !important;
            font-size: 22px !important;
            width: 300px !important;
            margin: 0 auto !important;
            transition: all 0.3s ease !important;
            box-shadow: none !important;
            display: block !important;
            text-align: center !important;
        }
        
        /* Botão confirmar específico - tamanho como no Pygame */
        .stForm .stButton > button {
            width: 200px !important;
            height: 50px !important;
        }
        
        /* Botão confirmar fora do form - tamanho como no Pygame */
        .stButton > button[key*="confirm"] {
            width: 200px !important;
            height: 50px !important;
        }
        
        /* Forçar centralização do botão */
        .stButton {
            text-align: center !important;
            width: 100% !important;
        }
        
        /* Centralizar o container do botão */
        .stButton > div {
            display: flex !important;
            justify-content: center !important;
            width: 100% !important;
        }
        
        /* Botões não selecionados (secondary) - estilo padrão */
        .stButton > button[data-baseweb="button"][aria-pressed="false"],
        .stButton > button[data-baseweb="button"].secondary {
            background-color: transparent !important;
            color: #00c8ff !important;
            border-color: #00c8ff !important;
        }
        
        /* Botões selecionados (primary) - estilo destacado */
        .stButton > button[data-baseweb="button"][aria-pressed="true"],
        .stButton > button[data-baseweb="button"].primary {
            background-color: #00c8ff !important;
            color: #05050f !important;
            border-color: #00c8ff !important;
            box-shadow: 0 0 10px rgba(0, 200, 255, 0.5) !important;
        }
        
        .stButton > button:hover {
            background-color: #c8ffff !important;
            color: #05050f !important;
            transform: none !important;
            box-shadow: none !important;
        }
        
        /* Input de idade - fundo transparente com texto azul claro */
        .stTextInput > div > div > input {
            background-color: transparent !important;
            color: #c8ffff !important;
            border: 2px solid #00c8ff !important;
            border-radius: 5px !important;
            padding: 10px !important;
            font-family: 'Courier New', monospace !important;
            font-size: 16px !important;
            font-weight: bold !important;
            width: 300px !important;
            height: 50px !important;
            text-align: center !important;
            margin: 0 auto !important;
            display: block !important;
        }
        
        /* Centralizar o container do input de idade */
        .stTextInput {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100% !important;
        }
        
        .stTextInput > div {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100% !important;
        }
        
        /* Centralizar o input de idade especificamente */
        .stTextInput > div > div > input {
            margin: 0 auto !important;
            display: block !important;
        }
        
        /* Forçar que o input tenha largura fixa */
        .stTextInput > div > div > input {
            width: 300px !important;
        }
        
        /* Centralizar o texto da pergunta de idade */
        .stTextInput + div {
            text-align: center !important;
            margin-bottom: 20px !important;
        }
        
        /* Centralizar todos os textos de pergunta */
        .stMarkdown p {
            text-align: center !important;
            margin-bottom: 20px !important;
            font-size: 22px !important;
            color: #c8ffff !important;
        }
        
        /* Centralizar textos específicos usando classes */
        .question-text {
            text-align: center !important;
            margin-bottom: 20px !important;
            font-size: 22px !important;
            color: #c8ffff !important;
        }
        
        /* Radio buttons para gênero - fundo transparente com texto azul claro */
        .stRadio > div > div {
            background-color: transparent !important;
            color: #c8ffff !important;
            border: 2px solid #00c8ff !important;
            border-radius: 5px !important;
            padding: 8px !important;
            margin: 3px 0 !important;
        }
        
        .stRadio > div > div > label {
            color: #c8ffff !important;
            font-family: 'Courier New', monospace !important;
            font-weight: bold !important;
            font-size: 16px !important;
        }
        
        /* Select box para experiência - fundo transparente com texto azul claro */
        .stSelectbox > div > div > select {
            background-color: transparent !important;
            color: #c8ffff !important;
            border: 2px solid #00c8ff !important;
            border-radius: 5px !important;
            font-family: 'Courier New', monospace !important;
            font-weight: bold !important;
            font-size: 16px !important;
            padding: 8px !important;
        }
        
        /* Caixa de informações do caso - fundo transparente com texto azul claro */
        .case-info {
            background-color: transparent !important;
            border: 2px solid #00c8ff !important;
            border-radius: 10px !important;
            padding: 20px !important;
            margin: 20px 0 !important;
            color: #c8ffff !important;
        }
        
        /* Caixa de fragmentos - fundo transparente com texto azul claro */
        .fragment-box {
            background-color: transparent !important;
            border: 2px solid #00c8ff !important;
            border-radius: 10px !important;
            padding: 20px !important;
            margin: 20px 0 !important;
            max-height: 400px !important;
            overflow-y: auto !important;
            color: #c8ffff !important;
        }
        
        /* Texto geral - azul claro EXATO como no Pygame */
        p, div, span {
            color: #c8ffff !important;
            font-family: 'Courier New', monospace !important;
            font-size: 22px !important;
            line-height: 1.4 !important;
            text-align: center !important;
        }
        
        /* Centralizar todo o conteúdo */
        .block-container {
            background-color: #05050f !important;
            padding-top: 1rem !important;
            padding-bottom: 1rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            max-width: 1000px !important;
            margin: 0 auto !important;
            text-align: center !important;
            display: grid !important;
            place-items: center !important;
        }
        
        /* Centralização específica para botões */
        .stButton {
            grid-column: 1 / -1 !important;
            justify-self: center !important;
            width: 300px !important;
        }
        
        /* Info box do Streamlit - fundo transparente com texto azul claro */
        .stAlert {
            background-color: transparent !important;
            border: 2px solid #00c8ff !important;
            color: #c8ffff !important;
            border-radius: 10px !important;
        }
        
        /* Sucesso e alertas com fundo transparente */
        .stSuccess {
            background-color: transparent !important;
            border: 2px solid #32ff96 !important;
            color: #c8ffff !important;
            border-radius: 10px !important;
        }
        
        .stWarning {
            background-color: transparent !important;
            border: 2px solid #ffaa00 !important;
            color: #c8ffff !important;
            border-radius: 10px !important;
        }
        
        .stError {
            background-color: transparent !important;
            border: 2px solid #ff3232 !important;
            color: #c8ffff !important;
            border-radius: 10px !important;
        }
        
        /* Remover elementos padrão do Streamlit */
        #MainMenu {visibility: hidden;}
        footer {visibility: hidden;}
        header {visibility: hidden;}
        
        /* Grid de fundo EXATO ao Pygame */
        body {
            background-image: 
                linear-gradient(rgba(15, 25, 40, 0.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(15, 25, 40, 0.8) 1px, transparent 1px) !important;
            background-size: 20px 20px !important;
            background-color: #05050f !important;
        }
        
        /* Grid adicional no container principal */
        .main {
            background-image: 
                linear-gradient(rgba(15, 25, 40, 0.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(15, 25, 40, 0.8) 1px, transparent 1px) !important;
            background-size: 20px 20px !important;
            background-color: #05050f !important;
        }
        
        /* Grid no container de blocos */
        .block-container {
            background-image: 
                linear-gradient(rgba(15, 25, 40, 0.8) 1px, transparent 1px),
                linear-gradient(90deg, rgba(15, 25, 40, 0.8) 1px, transparent 1px) !important;
            background-size: 20px 20px !important;
            background-color: #05050f !important;
        }
        
        /* Estilo específico para botões de gênero - layout em grid como no Pygame */
        .gender-buttons {
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 20px !important;
            max-width: 800px !important;
            margin: 0 auto !important;
        }
        
        /* Botões de gênero - estilo base */
        .gender-buttons .stButton > button {
            width: 200px !important;
            height: 50px !important;
            font-size: 16px !important;
            background-color: transparent !important;
            color: #00c8ff !important;
            border: 2px solid #00c8ff !important;
            border-radius: 5px !important;
            margin: 5px !important;
            transition: all 0.3s ease !important;
        }
        
        /* Botões de gênero selecionados (primary) */
        .gender-buttons .stButton > button[data-baseweb="button"][aria-pressed="true"],
        .gender-buttons .stButton > button[data-baseweb="button"].primary {
            background-color: #00c8ff !important;
            color: #05050f !important;
            border-color: #00c8ff !important;
            box-shadow: 0 0 10px rgba(0, 200, 255, 0.5) !important;
        }
        
        /* Botões de gênero não selecionados (secondary) */
        .gender-buttons .stButton > button[data-baseweb="button"][aria-pressed="false"],
        .gender-buttons .stButton > button[data-baseweb="button"].secondary {
            background-color: transparent !important;
            color: #00c8ff !important;
            border-color: #00c8ff !important;
        }
        
        .gender-buttons .stButton > button:hover {
            background-color: #c8ffff !important;
            color: #05050f !important;
        }
        
        /* Forçar layout em grid para as colunas */
        .gender-buttons .stButton {
            display: inline-block !important;
            margin: 5px !important;
            width: 200px !important;
        }
        
        /* Forçar quebra de linha após 3 botões */
        .gender-buttons .stButton:nth-child(3n+1) {
            clear: both !important;
        }
        
        /* Forçar que os botões tenham largura fixa */
        .gender-buttons .stButton {
            flex: 0 0 200px !important;
        }
        
        /* Estilo específico para botões de experiência - layout em linha como no Pygame */
        .experience-buttons {
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 30px !important;
            max-width: 800px !important;
            margin: 0 auto !important;
        }
        
        /* Botões de experiência - estilo base */
        .experience-buttons .stButton > button {
            width: 100px !important;
            height: 50px !important;
            font-size: 18px !important;
            background-color: transparent !important;
            color: #00c8ff !important;
            border: 2px solid #00c8ff !important;
            border-radius: 5px !important;
            margin: 5px !important;
            transition: all 0.3s ease !important;
        }
        
        /* Botões de experiência selecionados (primary) */
        .experience-buttons .stButton > button[data-baseweb="button"][aria-pressed="true"],
        .experience-buttons .stButton > button[data-baseweb="button"].primary {
            background-color: #00c8ff !important;
            color: #05050f !important;
            border-color: #00c8ff !important;
            box-shadow: 0 0 10px rgba(0, 200, 255, 0.5) !important;
        }
        
        /* Botões de experiência não selecionados (secondary) */
        .experience-buttons .stButton > button[data-baseweb="button"][aria-pressed="false"],
        .experience-buttons .stButton > button[data-baseweb="button"].secondary {
            background-color: transparent !important;
            color: #00c8ff !important;
            border-color: #00c8ff !important;
        }
        
        .experience-buttons .stButton > button:hover {
            background-color: #c8ffff !important;
            color: #05050f !important;
        }
        
        /* Forçar layout em linha para as colunas */
        .experience-buttons .stButton {
            display: inline-block !important;
            margin: 5px !important;
            width: 100px !important;
        }
        
        /* Forçar que os botões fiquem em linha */
        .experience-buttons .stButton {
            float: left !important;
        }
        
        /* Forçar que os botões tenham largura fixa */
        .experience-buttons .stButton {
            flex: 0 0 100px !important;
        }
        
        /* Botões de decisão - cores específicas como no Pygame */
        .culpado-button .stButton > button {
            border-color: #ff3232 !important;
            color: #ff3232 !important;
            width: 250px !important;
            height: 80px !important;
            font-size: 24px !important;
        }
        
        .culpado-button .stButton > button:hover {
            background-color: #ff3232 !important;
            color: #05050f !important;
        }
        
        .inocente-button .stButton > button {
            border-color: #32ff96 !important;
            color: #32ff96 !important;
            width: 250px !important;
            height: 80px !important;
            font-size: 24px !important;
        }
        
        .inocente-button .stButton > button:hover {
            background-color: #32ff96 !important;
            color: #05050f !important;
        }
        
        /* Estilo para botões selecionados (primary) */
        .stButton > button[data-baseweb="button"] {
            transition: all 0.3s ease !important;
        }
        
        /* Hover para botões secondary */
        .stButton > button[data-baseweb="button"].secondary:hover {
            background-color: #c8ffff !important;
            color: #05050f !important;
        }
        
        /* Centralizar os botões de decisão */
        .culpado-button, .inocente-button {
            display: flex !important;
            justify-content: center !important;
            width: 100% !important;
        }
        
        /* Layout das colunas para os botões de decisão */
        .stColumns {
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 50px !important;
            max-width: 800px !important;
            margin: 0 auto !important;
        }
        
        /* Centralizar cada coluna */
        .stColumns > div {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 250px !important;
        }
        
        /* Forçar que as colunas tenham largura fixa */
        .stColumns > div {
            flex: 0 0 250px !important;
        }
        
        /* Forçar que as colunas tenham largura fixa */
        .stColumns > div {
            flex: 0 0 250px !important;
        }
        
        /* Centralizar o container do input de idade */
        .stTextInput {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100% !important;
        }
        
        .stTextInput > div {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100% !important;
        }
        
        /* Centralizar o input de idade especificamente */
        .stTextInput > div > div > input {
            margin: 0 auto !important;
            display: block !important;
        }
        
        /* Forçar que o input tenha largura fixa */
        .stTextInput > div > div > input {
            width: 300px !important;
        }
        
        /* Centralizar o texto da pergunta de idade */
        .stTextInput + div {
            text-align: center !important;
            margin-bottom: 20px !important;
        }
        
        /* Centralizar todos os textos de pergunta */
        .stMarkdown p {
            text-align: center !important;
            margin-bottom: 20px !important;
            font-size: 22px !important;
            color: #c8ffff !important;
        }
        
        /* Centralizar textos específicos usando classes */
        .question-text {
            text-align: center !important;
            margin-bottom: 20px !important;
            font-size: 22px !important;
            color: #c8ffff !important;
        }
        </style>
    """, unsafe_allow_html=True)
    
    # Initialize session state com ID único por usuário
    if 'user_session_id' not in st.session_state:
        st.session_state.user_session_id = f"SESSAO_{int(time.time())}_{random.randint(1000, 9999)}"
    
    if 'game_state' not in st.session_state:
        st.session_state.game_state = 'version_selection'
        st.session_state.selected_version = None
        st.session_state.player = None
        st.session_state.current_case_index = 0
        st.session_state.round_num = 1
        st.session_state.all_collected_data = []
        st.session_state.player_votes_history = []
    
    # Game state machine
    if st.session_state.game_state == 'version_selection':
        version_selection_screen()
    elif st.session_state.game_state == 'intro':
        intro_screen()
    elif st.session_state.game_state == 'demographics':
        demographics_screen()
    elif st.session_state.game_state == 'voting':
        voting_screen()
    elif st.session_state.game_state == 'final_revelation':
        final_revelation_screen()
    elif st.session_state.game_state == 'game_complete':
        game_complete_screen()

def version_selection_screen():
    st.markdown("<h1>THE CHAMBER</h1>", unsafe_allow_html=True)
    st.markdown("---")
    
    st.markdown("""
    Bem-vindo ao experimento The Chamber.
    
    Por favor, selecione a versão do experimento que você deseja participar:
    """)
    
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("VERSÃO 1 (ORIGINAL)", key="version_1_btn", use_container_width=True):
            st.session_state.selected_version = 1
            st.session_state.game_state = 'intro'
            st.rerun()
    
    with col2:
        if st.button("VERSÃO 2 (ALTERNATIVA)", key="version_2_btn", use_container_width=True):
            st.session_state.selected_version = 2
            st.session_state.game_state = 'intro'
            st.rerun()

def intro_screen():
    st.markdown("<h1>THE CHAMBER</h1>", unsafe_allow_html=True)
    st.markdown("---")
    
    # Show selected version
    version_text = "VERSÃO 1 (ORIGINAL)" if st.session_state.selected_version == 1 else "VERSÃO 2 (ALTERNATIVA)"
    st.info(f"**Versão Selecionada:** {version_text}")
    
    st.markdown("""
    Bem-vindo. Você está prestes a participar de um experimento social sobre 
    tomada de decisão e julgamento sob incerteza.
    
    A cada rodada, um novo fragmento de informação sobre um caso será revelado. 
    Seu papel é julgar o suspeito com base nas evidências apresentadas.
    
    Suas decisões são anônimas e essenciais para a pesquisa. Obrigado por participar.
    """)
    
    if st.button("INICIAR EXPERIMENTO", key="start_btn"):
        st.session_state.game_state = 'demographics'
        st.rerun()

def demographics_screen():
    st.markdown("<h1>DADOS DO PARTICIPANTE</h1>", unsafe_allow_html=True)
    
    # Show selected version
    version_text = "VERSÃO 1 (ORIGINAL)" if st.session_state.selected_version == 1 else "VERSÃO 2 (ALTERNATIVA)"
    st.info(f"**Versão Selecionada:** {version_text}")
    
    # Initialize session state for form data
    if 'temp_age' not in st.session_state:
        st.session_state.temp_age = ""
    if 'temp_gender' not in st.session_state:
        st.session_state.temp_gender = None
    if 'temp_experience' not in st.session_state:
        st.session_state.temp_experience = None
    
    # Age input
    st.markdown('<p class="question-text">Qual sua idade?</p>', unsafe_allow_html=True)
    age = st.text_input("", value=st.session_state.temp_age, key="age_input", label_visibility="collapsed")
    if age != st.session_state.temp_age:
        st.session_state.temp_age = age
        st.rerun()
    
    # Gender selection with custom grid layout
    st.markdown('<p class="question-text">Você é:</p>', unsafe_allow_html=True)
    st.markdown('<div class="gender-buttons">', unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns(3)
    with col1:
        if st.button("Mulher cis", key="gender_1", use_container_width=True, 
                    type="primary" if st.session_state.temp_gender == "Mulher cis" else "secondary"):
            st.session_state.temp_gender = "Mulher cis"
            st.rerun()
        if st.button("Mulher trans", key="gender_4", use_container_width=True,
                    type="primary" if st.session_state.temp_gender == "Mulher trans" else "secondary"):
            st.session_state.temp_gender = "Mulher trans"
            st.rerun()
    
    with col2:
        if st.button("Homem cis", key="gender_2", use_container_width=True,
                    type="primary" if st.session_state.temp_gender == "Homem cis" else "secondary"):
            st.session_state.temp_gender = "Homem cis"
            st.rerun()
        if st.button("Homem trans", key="gender_5", use_container_width=True,
                    type="primary" if st.session_state.temp_gender == "Homem trans" else "secondary"):
            st.session_state.temp_gender = "Homem trans"
            st.rerun()
    
    with col3:
        if st.button("Não binário", key="gender_3", use_container_width=True,
                    type="primary" if st.session_state.temp_gender == "Não binário" else "secondary"):
            st.session_state.temp_gender = "Não binário"
            st.rerun()
        if st.button("Outro", key="gender_6", use_container_width=True,
                    type="primary" if st.session_state.temp_gender == "Outro" else "secondary"):
            st.session_state.temp_gender = "Outro"
            st.rerun()
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Experience selection
    st.markdown('<p class="question-text">Qual seu nível de familiaridade com jogos morais? (1-5)</p>', unsafe_allow_html=True)
    st.markdown('<div class="experience-buttons">', unsafe_allow_html=True)
    
    exp_col1, exp_col2, exp_col3, exp_col4, exp_col5 = st.columns(5)
    with exp_col1:
        if st.button("1", key="exp_1", use_container_width=True,
                    type="primary" if st.session_state.temp_experience == 1 else "secondary"):
            st.session_state.temp_experience = 1
            st.rerun()
    with exp_col2:
        if st.button("2", key="exp_2", use_container_width=True,
                    type="primary" if st.session_state.temp_experience == 2 else "secondary"):
            st.session_state.temp_experience = 2
            st.rerun()
    with exp_col3:
        if st.button("3", key="exp_3", use_container_width=True,
                    type="primary" if st.session_state.temp_experience == 3 else "secondary"):
            st.session_state.temp_experience = 3
            st.rerun()
    with exp_col4:
        if st.button("4", key="exp_4", use_container_width=True,
                    type="primary" if st.session_state.temp_experience == 4 else "secondary"):
            st.session_state.temp_experience = 4
            st.rerun()
    with exp_col5:
        if st.button("5", key="exp_5", use_container_width=True,
                    type="primary" if st.session_state.temp_experience == 5 else "secondary"):
            st.session_state.temp_experience = 5
            st.rerun()
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Confirm button
    if st.session_state.temp_age and st.session_state.temp_gender and st.session_state.temp_experience:
        if st.button("CONFIRMAR", key="confirm_btn", use_container_width=True):
            st.session_state.player = {
                'id': 1,
                'age': st.session_state.temp_age,
                'gender': st.session_state.temp_gender,
                'experience': st.session_state.temp_experience
            }
            st.session_state.current_case_index = 0
            st.session_state.round_num = 1
            st.session_state.game_state = 'voting'
            # Clear temporary data
            st.session_state.temp_age = ""
            st.session_state.temp_gender = None
            st.session_state.temp_experience = None
            st.rerun()
    else:
        st.warning("Por favor, preencha todos os campos antes de confirmar.")

def voting_screen():
    case_pool = get_case_pool_by_version(st.session_state.selected_version)
    case = case_pool[st.session_state.current_case_index]
    round_num = st.session_state.round_num
    
    # Initialize start time for this round if not already set
    if f'round_{round_num}_start_time' not in st.session_state:
        st.session_state[f'round_{round_num}_start_time'] = time.time()
    
    st.markdown(f"<h2>RODADA {round_num} DE {MAX_ROUNDS}</h2>", unsafe_allow_html=True)
    
    # Show selected version
    version_text = "VERSÃO 1 (ORIGINAL)" if st.session_state.selected_version == 1 else "VERSÃO 2 (ALTERNATIVA)"
    st.info(f"**Versão Selecionada:** {version_text}")
    
    case_info = f"Caso #{case['id']} | Gênero do Suspeito: {case['suspect_gender']} | Tipo: {case['type']}"
    st.info(case_info)
    
    # Display fragments up to current round
    st.markdown("<h3>Informações Disponíveis:</h3>", unsafe_allow_html=True)
    
    with st.container():
        st.markdown('<div class="fragment-box">', unsafe_allow_html=True)
        for i in range(round_num):
            st.write(f"**Info {i+1}:** {case['fragments'][i]}")
            if i < round_num - 1:
                st.markdown("---")
        st.markdown('</div>', unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Debug: Show current elapsed time (optional - can be removed in production)
    if f'round_{round_num}_start_time' in st.session_state:
        elapsed_time = round(time.time() - st.session_state[f'round_{round_num}_start_time'], 2)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown('<div class="culpado-button">', unsafe_allow_html=True)
        if st.button("CULPADO (1)", key=f"culpado_{round_num}", use_container_width=True):
            record_vote(1)
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col2:
        st.markdown('<div class="inocente-button">', unsafe_allow_html=True)
        if st.button("INOCENTE (0)", key=f"inocente_{round_num}", use_container_width=True):
            record_vote(0)
        st.markdown('</div>', unsafe_allow_html=True)

def record_vote(decision):
    # Calculate decision time using the stored start time for this round
    round_num = st.session_state.round_num
    start_time = st.session_state.get(f'round_{round_num}_start_time', time.time())
    decision_time = round(time.time() - start_time, 2)
    
    case_pool = get_case_pool_by_version(st.session_state.selected_version)
    case = case_pool[st.session_state.current_case_index]
    
    mudanca_voto = 0
    if round_num > 1 and decision != st.session_state.player_votes_history[-1]:
        mudanca_voto = 1
    
    st.session_state.player_votes_history.append(decision)
    
    # Verifica se já existe um registro para esta rodada específica
    existing_record = next((d for d in st.session_state.all_collected_data 
                           if d['Num_Rodada'] == round_num and d['ID_Caso'] == case['id']), None)
    
    if existing_record:
        st.error(f"⚠️ ATENÇÃO: Já existe um registro para Rodada {round_num} do Caso {case['id']}. Dados duplicados detectados!")
        return
    
    data_row = {
        "ID_Sessao": st.session_state.user_session_id,
        "ID_Participante": f"P{st.session_state.player['id']}",
        "Num_Rodada": round_num,
        "Idade": st.session_state.player['age'],
        "Genero_Participante": st.session_state.player['gender'],
        "Experiencia_com_Jogos": st.session_state.player['experience'],
        "ID_Caso": case['id'],
        "Tipo_de_Historia": case['type'],
        "Genero_Suspeito": case['suspect_gender'],
        "Tempo_de_Decisao_s": decision_time,
        "Decisao_Final": decision,
        "Mudanca_de_Voto": mudanca_voto,
        "Resultado_Real_Caso": case['real_outcome'],
        "Num_Jogadores_Sessao": 1,
        "Versão": st.session_state.selected_version
    }
    
    st.session_state.all_collected_data.append(data_row)
    
    # Debug: Mostrar dados coletados (pode ser removido em produção)
    st.info(f"📊 Dados registrados para Rodada {round_num}: {len([d for d in st.session_state.all_collected_data if d['Num_Rodada'] == round_num and d['ID_Caso'] == case['id']])} registros")
    
    if round_num < MAX_ROUNDS:
        st.session_state.round_num += 1
        st.rerun()
    else:
        st.session_state.game_state = 'final_revelation'
        st.rerun()

def final_revelation_screen():
    case_pool = get_case_pool_by_version(st.session_state.selected_version)
    case = case_pool[st.session_state.current_case_index]
    
    st.markdown("<h1>REVELAÇÃO FINAL</h1>", unsafe_allow_html=True)
    
    # Show selected version
    version_text = "VERSÃO 1 (ORIGINAL)" if st.session_state.selected_version == 1 else "VERSÃO 2 (ALTERNATIVA)"
    st.info(f"**Versão Selecionada:** {version_text}")
    
    st.write(f"**A verdade sobre o Caso #{case['id']}:**")
    st.write(case['full_story'])
    
    st.markdown("---")
    
    outcome_text = "CULPADO" if case['real_outcome'] == 1 else "INOCENTE"
    outcome_color = "🔴" if case['real_outcome'] == 1 else "🟢"
    
    st.markdown(f"<h2>{outcome_color} O suspeito era: {outcome_text}</h2>", unsafe_allow_html=True)
    
    # Salva dados do caso atual no Google Sheets
    save_case_data()
    
    # Move to next case or end game
    if st.session_state.current_case_index < len(case_pool) - 1:
        if st.button("PRÓXIMO CASO", key="next_case_btn"):
            st.session_state.current_case_index += 1
            st.session_state.round_num = 1
            st.session_state.player_votes_history = []
            # Clear round start times for the new case
            for i in range(1, MAX_ROUNDS + 1):
                if f'round_{i}_start_time' in st.session_state:
                    del st.session_state[f'round_{i}_start_time']
            # Clear case saved flag for the new case
            current_case_id = get_case_pool_by_version(st.session_state.selected_version)[st.session_state.current_case_index]['id']
            if f'case_{current_case_id}_saved' in st.session_state:
                del st.session_state[f'case_{current_case_id}_saved']
            st.session_state.game_state = 'voting'
            st.rerun()
    else:
        # All cases completed
        st.session_state.game_state = 'game_complete'
        st.rerun()

def game_complete_screen():
    st.markdown("<h1>EXPERIMENTO CONCLUÍDO</h1>", unsafe_allow_html=True)
    
    # Show selected version
    version_text = "VERSÃO 1 (ORIGINAL)" if st.session_state.selected_version == 1 else "VERSÃO 2 (ALTERNATIVA)"
    st.info(f"**Versão Selecionada:** {version_text}")
    
    st.success("🎉 Parabéns! Você completou todos os 10 casos do experimento.")
    
    st.write(f"**ID da Sessão:** {st.session_state.user_session_id}")
    st.write(f"**Total de decisões registradas:** {len(st.session_state.all_collected_data)}")
    
    
    if st.button("INICIAR NOVA SESSÃO", key="new_session_btn"):
        # Reset for new session
        st.session_state.user_session_id = f"SESSAO_{int(time.time())}_{random.randint(1000, 9999)}"
        st.session_state.game_state = 'version_selection'
        st.session_state.selected_version = None
        st.session_state.player = None
        st.session_state.current_case_index = 0
        st.session_state.round_num = 1
        st.session_state.all_collected_data = []
        st.session_state.player_votes_history = []
        # Clear all round start times
        for i in range(1, MAX_ROUNDS + 1):
            if f'round_{i}_start_time' in st.session_state:
                del st.session_state[f'round_{i}_start_time']
        # Clear all case saved flags
        for i in range(1, 21):  # Assuming max 20 cases
            if f'case_{i}_saved' in st.session_state:
                del st.session_state[f'case_{i}_saved']
        st.rerun()

def save_case_data():
    """Salva os dados do caso atual apenas no Google Sheets"""
    # Filtra apenas os dados do caso atual
    current_case_id = get_case_pool_by_version(st.session_state.selected_version)[st.session_state.current_case_index]['id']
    case_data = [row for row in st.session_state.all_collected_data if row['ID_Caso'] == current_case_id]
    
    if not case_data:
        return
    
    # Verifica se já foi salvo para evitar duplicação
    if f'case_{current_case_id}_saved' in st.session_state:
        return
    
    # Try to save to Google Sheets based on selected version
    if GOOGLE_SHEETS_AVAILABLE:
        try:
            if st.session_state.selected_version == 1:
                sheets_manager = GoogleSheetsManager()
                manager_name = "Google Sheets V1"
            elif st.session_state.selected_version == 2:
                sheets_manager = GoogleSheetsManagerV2()
                manager_name = "Google Sheets V2"
            else:
                sheets_manager = GoogleSheetsManager()  # Default to v1
                manager_name = "Google Sheets V1"
            
            if sheets_manager.service and sheets_manager.append_data(case_data):
                st.success(f"📊 Dados do Caso #{current_case_id} enviados para {manager_name}!")
                # Marca como salvo para evitar duplicação
                st.session_state[f'case_{current_case_id}_saved'] = True
            else:
                st.error(f"❌ Falha ao enviar dados do Caso #{current_case_id} para {manager_name}.")
        except Exception as e:
            st.error(f"❌ Erro ao enviar Caso #{current_case_id} para {manager_name}: {e}")
    else:
        st.error("❌ Google Sheets não disponível - dados não podem ser salvos.")

if __name__ == "__main__":
    main() 