// Importa o framework Express para criação do servidor web
const express = require("express");

// Importa a função responsável por buscar e preparar a frase da API
// A lógica de consumo da API fica isolada no service
const { getRandomQuoteTranslated } = require("./services/quoteService");

// Inicializa a aplicação Express
const app = express();


// --------------------
// Configurações globais da aplicação
// --------------------

// Define o EJS como template engine para renderização das views
app.set("view engine", "ejs");

// Define a pasta 'public' como diretório de arquivos estáticos (CSS, imagens, etc.)
app.use(express.static("public"));


// --------------------
// Rotas
// --------------------

// Rota principal: busca uma frase aleatória e renderiza a página inicial
app.get("/", async (req, res) => {
  try {
    // Obtém a frase preparada pelo service
      const { content, author } = await getRandomQuoteTranslated();

    // Renderiza a view 'index.ejs' com os dados recebidos
    res.render("index", { content, author });
  } catch (error) {
    // Em caso de erro, exibe uma mensagem padrão para o usuário
    res.render("index", {
      content: "Não foi possível acessar a sabedoria do multiverso.",
      author: "Sistema"
    });
  }
});


// --------------------
// Inicialização do servidor
// --------------------

// Define a porta do servidor (prioriza variável de ambiente)
const PORT = process.env.PORT || 3000;

// Inicia o servidor HTTP
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});