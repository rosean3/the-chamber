// Configuração do The Chamber
// Este arquivo centraliza todas as configurações do jogo

const CONFIG = {
    // Configurações do Experimento
    EXPERIMENT: {
        MAX_ROUNDS: 6,
        SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
        AUTO_SAVE_INTERVAL: 5 * 60 * 1000, // 5 minutos
        MAX_CASES_PER_SESSION: 10
    },

    // Configurações de UI
    UI: {
        ANIMATION_DURATION: 300,
        SCROLL_SPEED: 30,
        BUTTON_HOVER_DELAY: 100,
        LOADING_TIMEOUT: 10000
    },

    // Configurações de Cores
    COLORS: {
        PRIMARY: '#00c8ff',
        SECONDARY: '#c8ffff',
        BACKGROUND: '#05050f',
        DANGER: '#ff3232',
        SUCCESS: '#32ff96',
        WARNING: '#ffaa00',
        SCROLLBAR: '#0096c8',
        GRID: 'rgba(15, 25, 40, 0.3)'
    },

    // Configurações de Fontes
    FONTS: {
        PRIMARY: 'JetBrains Mono, Courier New, monospace',
        SIZES: {
            LARGE: '3rem',
            MEDIUM: '1.1rem',
            SMALL: '0.9rem'
        }
    },

    // Configurações de Google Sheets
    GOOGLE_SHEETS: {
        ENABLED: true,
        API_VERSION: 'v4',
        DISCOVERY_DOC: 'https://sheets.googleapis.com/$discovery/rest?version=v4',
        SCOPE: 'https://www.googleapis.com/auth/spreadsheets',
        TIMEOUT: 10000,
        MAX_RETRIES: 3,
        BATCH_SIZE: 100,
        SPREADSHEET_ID: '1PcAveY4HB4sAu-alSXaGArkqErY1Xa5J2VKZlM52xHs', // V1 (padrão)
        SPREADSHEET_ID_V2: '1iEZZ6iUJqmyp8FDGZXw4nX_Q_1XQJWFmH1q3S0LenOg', // V2
        CREDENTIALS_FILE: 'credentials.json'
    },

    // Configurações de Armazenamento Local
    STORAGE: {
        PREFIX: 'theChamber_',
        BACKUP_INTERVAL: 60 * 1000, // 1 minuto
        MAX_LOCAL_DATA: 10000, // 10k registros
        AUTO_CLEANUP: true
    },

    // Configurações de Analytics
    ANALYTICS: {
        ENABLED: false,
        TRACK_DECISIONS: true,
        TRACK_TIMING: true,
        TRACK_ERRORS: true,
        PRIVACY_MODE: true
    },

    // Configurações de Debug
    DEBUG: {
        ENABLED: false,
        LOG_LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
        SHOW_PERFORMANCE: false,
        SHOW_STATE: false
    },

    // Configurações de Performance
    PERFORMANCE: {
        THROTTLE_SCROLL: true,
        DEBOUNCE_RESIZE: true,
        LAZY_LOAD: true,
        MEMORY_LIMIT: 50 * 1024 * 1024 // 50MB
    },

    // Configurações de Acessibilidade
    ACCESSIBILITY: {
        HIGH_CONTRAST: false,
        LARGE_TEXT: false,
        SCREEN_READER: true,
        KEYBOARD_NAVIGATION: true,
        FOCUS_INDICATORS: true
    },

    // Configurações de Localização
    LOCALIZATION: {
        DEFAULT_LANGUAGE: 'pt-BR',
        SUPPORTED_LANGUAGES: ['pt-BR', 'en-US', 'es-ES'],
        DATE_FORMAT: 'DD/MM/YYYY',
        TIME_FORMAT: 'HH:mm:ss'
    },

    // Configurações de Validação
    VALIDATION: {
        MIN_AGE: 13,
        MAX_AGE: 120,
        REQUIRED_FIELDS: ['age', 'gender', 'experience'],
        MAX_TEXT_LENGTH: 1000
    }
};

// Funções de configuração
const ConfigManager = {
    // Obtém uma configuração
    get(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], CONFIG);
    },

    // Define uma configuração
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, CONFIG);
        target[lastKey] = value;
    },

    // Carrega configurações do localStorage
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('theChamberConfig');
            if (stored) {
                const parsed = JSON.parse(stored);
                Object.assign(CONFIG, parsed);
            }
        } catch (error) {
            console.warn('Erro ao carregar configurações:', error);
        }
    },

    // Salva configurações no localStorage
    saveToStorage() {
        try {
            localStorage.setItem('theChamberConfig', JSON.stringify(CONFIG));
        } catch (error) {
            console.warn('Erro ao salvar configurações:', error);
        }
    },

    // Reseta para configurações padrão
    reset() {
        localStorage.removeItem('theChamberConfig');
        location.reload();
    },

    // Valida configurações
    validate() {
        const errors = [];
        
        if (CONFIG.EXPERIMENT.MAX_ROUNDS < 1) {
            errors.push('MAX_ROUNDS deve ser maior que 0');
        }
        
        if (CONFIG.VALIDATION.MIN_AGE < 0) {
            errors.push('MIN_AGE deve ser maior ou igual a 0');
        }
        
        if (CONFIG.VALIDATION.MAX_AGE < CONFIG.VALIDATION.MIN_AGE) {
            errors.push('MAX_AGE deve ser maior que MIN_AGE');
        }
        
        return errors;
    },

    // Aplica configurações de acessibilidade
    applyAccessibility() {
        const body = document.body;
        
        if (CONFIG.ACCESSIBILITY.HIGH_CONTRAST) {
            body.classList.add('high-contrast');
        } else {
            body.classList.remove('high-contrast');
        }
        
        if (CONFIG.ACCESSIBILITY.LARGE_TEXT) {
            body.classList.add('large-text');
        } else {
            body.classList.remove('large-text');
        }
    },

    // Aplica configurações de tema
    applyTheme() {
        const root = document.documentElement;
        
        // Define variáveis CSS customizadas
        root.style.setProperty('--color-primary', CONFIG.COLORS.PRIMARY);
        root.style.setProperty('--color-secondary', CONFIG.COLORS.SECONDARY);
        root.style.setProperty('--color-background', CONFIG.COLORS.BACKGROUND);
        root.style.setProperty('--color-danger', CONFIG.COLORS.DANGER);
        root.style.setProperty('--color-success', CONFIG.COLORS.SUCCESS);
        root.style.setProperty('--font-primary', CONFIG.FONTS.PRIMARY);
    }
};

// Configurações específicas por ambiente
const ENV_CONFIG = {
    development: {
        DEBUG: { ENABLED: true, LOG_LEVEL: 'debug' },
        GOOGLE_SHEETS: { ENABLED: true },
        ANALYTICS: { ENABLED: false }
    },
    
    production: {
        DEBUG: { ENABLED: false, LOG_LEVEL: 'error' },
        GOOGLE_SHEETS: { ENABLED: true },
        ANALYTICS: { ENABLED: true }
    },
    
    testing: {
        DEBUG: { ENABLED: true, LOG_LEVEL: 'debug' },
        GOOGLE_SHEETS: { ENABLED: false },
        EXPERIMENT: { MAX_CASES_PER_SESSION: 2 }
    }
};

// Detecta ambiente automaticamente
function detectEnvironment() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'development';
    } else if (window.location.hostname.includes('test') || window.location.hostname.includes('staging')) {
        return 'testing';
    } else {
        return 'production';
    }
}

// Aplica configurações do ambiente
function applyEnvironmentConfig() {
    const env = detectEnvironment();
    const envConfig = ENV_CONFIG[env] || {};
    
    Object.entries(envConfig).forEach(([section, settings]) => {
        Object.entries(settings).forEach(([key, value]) => {
            ConfigManager.set(`${section}.${key}`, value);
        });
    });
    
    console.log(`🌍 Ambiente detectado: ${env}`);
}

// Inicialização automática
document.addEventListener('DOMContentLoaded', () => {
    // Carrega configurações salvas
    ConfigManager.loadFromStorage();
    
    // Aplica configurações do ambiente
    applyEnvironmentConfig();
    
    // Valida configurações
    const errors = ConfigManager.validate();
    if (errors.length > 0) {
        console.warn('⚠️ Configurações inválidas:', errors);
    }
    
    // Aplica configurações visuais
    ConfigManager.applyTheme();
    ConfigManager.applyAccessibility();
    
    // Salva configurações
    ConfigManager.saveToStorage();
    
    console.log('⚙️ Configurações carregadas com sucesso');
});

// Exporta para uso global
window.CONFIG = CONFIG;
window.ConfigManager = ConfigManager; 