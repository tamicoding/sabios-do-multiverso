🇺🇸 English

# Sábios do Multiverso

Web application for inspirational quotes automatically translated to Brazilian Portuguese.  
Responsive glassmorphism interface with AJAX interactions and optimized deployment on Render.

## Demo (Live):  
https://sabios-do-multiverso.onrender.com

### About the Project

Sábios do Multiverso is a web application that generates inspirational quotes and automatically translates them into Brazilian Portuguese.

The project focuses on asynchronous interactions, UI animation, client-side persistence, and deployment optimization.

### Features

- Instant generation of new quotes via AJAX with animation  
- Native sharing to WhatsApp and Twitter/X  
- Favorites system using LocalStorage (maximum of 50 items)  
- Persistent view counter  
- Automatic translation (English → Brazilian Portuguese)  
- Fully responsive glassmorphism design  

### Technology Stack

- Node.js  
- Express.js  
- EJS Templates  
- ZenQuotes API  
- Google Translate API (free, unofficial)  
- Vanilla JavaScript  
- CSS3  
- LocalStorage  
- Render (free tier)  

### Project Structure

sabios-do-multiverso/
├── app.js (Express server and routes)
├── services/
│ └── quoteService.js (quotes and translation)
├── views/
│ └── index.ejs (main template)
├── public/
│ └── css/style.css (glassmorphism styling)
├── package.json
└── README.md

### Local Installation

git clone https://github.com/YOUR-USERNAME/sabios-do-multiverso.git
cd sabios-do-multiverso
npm install
npm start
Access:
http://localhost:3000

Production Deployment
Configured for Render (free tier):

Build Command: npm install

Start Command: node app.js

URL: https://sabios-do-multiverso.onrender.com

## How It Works

Main route (/) renders an EJS template with a translated quote

AJAX endpoint (/api/nova) returns JSON with new quotes

quoteService.js consumes ZenQuotes API and handles translation

Frontend manages animations, sharing, and LocalStorage

CSS implements glassmorphism using backdrop-filter

Key Challenges Solved
JavaScript syntax corrections in the service layer

Robust fallback handling for translation failures

Responsive layout for buttons and long text

Multi-environment configuration (local + Render)

Optimized asynchronous loading with async/await

## Technical Highlights

Asynchronous loading with error handling

CSS animations with cubic-bezier timing functions

Semantic HTML5 elements (blockquote, cite)

Prepared for PWA (service worker ready)

Optimized performance (25KB gzipped)

## Notes 

Developed as a portfolio study project in January 2026.

PT-BR

# Sábios do Multiverso

## Sobre o Projeto

Sábios do Multiverso é uma aplicação web que gera frases inspiradoras e as traduz automaticamente para português brasileiro.

O projeto tem como foco interações assíncronas, animações de interface, persistência no cliente e otimização para deploy.

## Demo (Live):  
https://sabios-do-multiverso.onrender.com

## Funcionalidades

Geração instantânea de novas frases via AJAX com animação

Compartilhamento nativo para WhatsApp e Twitter/X

Sistema de favoritos com LocalStorage (máximo de 50)

Contador persistente de visualizações

Tradução automática (inglês → português brasileiro)

Design glassmorphism totalmente responsivo

## Stack Tecnológica

Node.js

Express.js

EJS Templates

ZenQuotes API

Google Translate API (gratuita, não-oficial)

Vanilla JavaScript

CSS3

LocalStorage

Render (plano gratuito)

## Estrutura do Projeto

sabios-do-multiverso/
├── app.js (servidor Express + rotas)
├── services/
│   └── quoteService.js (quotes + tradução)
├── views/
│   └── index.ejs (template principal)
├── public/
│   └── css/style.css (estilo glassmorphism)
├── package.json
└── README.md

## Instalação Local

git clone https://github.com/SEUUSER/sabios-do-multiverso.git
cd sabios-do-multiverso
npm install
npm start
Acessar:
http://localhost:3000

Deploy em Produção
Configurado para Render (plano gratuito):

Build Command: npm install

Start Command: node app.js

URL: https://sabios-do-multiverso.onrender.com

## Como Funciona

Rota principal (/) renderiza EJS com frase traduzida

Endpoint AJAX (/api/nova) retorna JSON

quoteService.js consome ZenQuotes + tradução

Frontend gerencia animações, compartilhamento e LocalStorage

CSS implementa glassmorphism com backdrop-filter

## Principais Desafios Resolvidos

Correções de sintaxe JavaScript na camada de serviços

Fallback robusto para falhas de tradução

Layout responsivo para textos longos

Configuração multiplataforma (local + Render)

Otimização de carregamento assíncrono

## Destaques Técnicos

Carregamento assíncrono com tratamento de erros

Animações CSS com cubic-bezier

HTML5 semântico (blockquote, cite)

Preparado para PWA

Performance otimizada

## Notas

Projeto desenvolvido para estudo e portfólio em Janeiro de 2026.
