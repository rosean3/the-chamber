# The Chamber - Experimento Individual

Uma aplicação web para experimentos sociais sobre tomada de decisão e julgamento sob incerteza.

## 🎯 Sobre o Projeto

The Chamber é um experimento psicológico onde participantes julgam suspeitos com base em fragmentos de informação revelados progressivamente. O experimento coleta dados sobre:

- Tempo de decisão
- Mudanças de voto
- Características demográficas dos participantes
- Resultados das decisões

## ✨ Funcionalidades

- **Interface moderna e responsiva** - Funciona em desktop e mobile
- **Sistema de telas** - Introdução, demografia, votação, revelação final
- **10 casos diferentes** - Mistura de histórias reais e fictícias
- **6 rodadas por caso** - Informação revelada progressivamente
- **Coleta de dados** - Exportação CSV e integração Google Sheets
- **Design cyberpunk** - Interface visual inspirada no jogo original

## 🚀 Deploy Rápido

### Opção 1: Deploy Local (Desenvolvimento)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/the-chamber.git
cd the-chamber

# Inicie um servidor local
python -m http.server 8000

# Abra no navegador
open http://localhost:8000
```

### Opção 2: Deploy no GitHub Pages

1. **Crie um repositório no GitHub**
2. **Faça upload dos arquivos:**
   - `index.html`
   - `styles.css`
   - `script.js`
   - `package.json`
   - `README.md`

3. **Ative o GitHub Pages:**
   - Vá em Settings > Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)

4. **Acesse:** `https://seu-usuario.github.io/the-chamber`

### Opção 3: Deploy no Netlify

1. **Conecte seu repositório GitHub ao Netlify**
2. **Configure o build:**
   - Build command: `echo "Build não necessário"`
   - Publish directory: `.`
3. **Deploy automático a cada push**

### Opção 4: Deploy no Vercel

1. **Conecte seu repositório ao Vercel**
2. **Configure como projeto estático**
3. **Deploy automático**

## 🔧 Configuração do Google Sheets

Para integrar com Google Sheets:

1. **Crie um projeto no Google Cloud Console**
2. **Ative a Google Sheets API**
3. **Crie credenciais de conta de serviço**
4. **Baixe o arquivo JSON de credenciais**
5. **Compartilhe sua planilha com o email da conta de serviço**
6. **Configure no jogo:**
   - Clique em "Configurar Google Sheets"
   - Cole as credenciais JSON
   - Digite o ID da planilha

## 📁 Estrutura do Projeto

```
the-chamber/
├── index.html          # Interface principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica do jogo
├── package.json        # Configuração do projeto
├── README.md           # Este arquivo
└── DEPLOYMENT.md       # Guia detalhado de deploy
```

## 🎮 Como Jogar

1. **Introdução** - Leia as instruções
2. **Demografia** - Preencha idade, gênero e experiência
3. **Votação** - Em 6 rodadas, julgue o suspeito
4. **Revelação** - Descubra a verdade sobre o caso
5. **Próximo Caso** - Continue com outros casos
6. **Conclusão** - Download dos dados coletados

## 📊 Dados Coletados

O experimento coleta:

- **ID da sessão e participante**
- **Dados demográficos** (idade, gênero, experiência)
- **Informações do caso** (ID, tipo, gênero do suspeito)
- **Decisões** (voto, tempo, mudança de voto)
- **Resultado real** do caso

## 🌐 Compatibilidade

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers

## 🔒 Privacidade

- **Dados anônimos** - Não há identificação pessoal
- **Armazenamento local** - Dados ficam no navegador
- **Google Sheets opcional** - Integração configurável
- **Exportação segura** - Download local dos dados

## 🛠️ Desenvolvimento

### Pré-requisitos
- Navegador moderno
- Servidor HTTP local (para desenvolvimento)
- Git (para versionamento)

### Estrutura do Código
- **HTML**: Estrutura das telas
- **CSS**: Estilos e animações
- **JavaScript**: Lógica do jogo e gerenciamento de estado

### Personalização
- **Cores**: Edite as variáveis CSS em `styles.css`
- **Casos**: Modifique o array `CASE_POOL` em `script.js`
- **Rodadas**: Altere `MAX_ROUNDS` em `script.js`

## 📝 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/the-chamber/issues)
- **Email**: seu-email@exemplo.com
- **Documentação**: [Wiki do projeto](https://github.com/seu-usuario/the-chamber/wiki)

## 🔄 Atualizações

- **v1.0.0** - Versão inicial com todas as funcionalidades
- **Próximas** - Melhorias de UI/UX e novos casos

---

**The Chamber** - Transformando experimentos psicológicos em experiências digitais interativas.
