Sábios do Multiverso
Aplicação web de frases inspiradoras traduzidas automaticamente para PT-BR. 
Interface glassmorphism responsiva com interações AJAX e deploy otimizado no Render.

Demo Ao Vivo
https://sabios-do-multiverso.onrender.com

Funcionalidades
Geração instantânea de novas frases via AJAX com animação

Compartilhamento nativo para WhatsApp e Twitter/X

Sistema de favoritos com localStorage (máximo 50)

Contador persistente de visualizações

Tradução automática via Google Translate API (inglês → português brasileiro)

Design glassmorphism totalmente responsivo

Stack Tecnológica
Node.js + Express + EJS templates
Google Translate API (não-oficial gratuita)
ZenQuotes API para frases
Vanilla JavaScript + CSS3 puro
localStorage para persistência
Render (plano gratuito)

Estrutura do Projeto
text
sabios-do-multiverso/
├── app.js              (servidor Express + rotas)
├── services/
│   └── quoteService.js (quotes + tradução)
├── views/
│   └── index.ejs       (template principal)
├── public/
│   └── css/style.css   (glassmorphism)
├── package.json
└── README.md
Instalação Local
bash
git clone https://github.com/SEUUSER/sabios-do-multiverso.git
cd sabios-do-multiverso
npm install
npm start
Acessar: http://localhost:3000

Deploy Produção
Configurado para Render com plano gratuito:

Build Command: npm install
Start Command: node app.js
URL: https://sabios-do-multiverso.onrender.com

Como Funciona
Rota principal (/) renderiza EJS com quote traduzido

API AJAX (/api/nova) retorna JSON para novas frases

quoteService.js consome ZenQuotes + Google Translate

Frontend gerencia animações, compartilhamento e localStorage

CSS implementa glassmorphism com backdrop-filter

Principais Desafios Resolvidos
Correção de sintaxe JavaScript no service layer

Fallback robusto para falhas de tradução

Layout responsivo para botões e textos longos

Configuração multiplataforma (local + Render)

Otimização de carregamento com async/await

Recursos Técnicos
Carregamento assíncrono com error handling

Animações CSS com cubic-bezier timing functions

Semântica HTML5 (blockquote, cite)

Preparado para PWA (service worker ready)

Performance otimizada (25KB gzipped)

Desenvolvido como estudo de caso para portfolio fullstack JavaScript em Janeiro 2026.
