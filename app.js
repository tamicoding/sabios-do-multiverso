const express = require("express");
const { getRandomQuoteTranslated } = require("./services/quoteService");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const { content, author } = await getRandomQuoteTranslated();
    res.render("index", { content, author });
  } catch (error) {
    res.render("index", { 
      content: "Não foi possível acessar a sabedoria do multiverso.", 
      author: "Sistema" 
    });
  }
});

// NOVA ROTA AJAX
app.get("/api/nova", async (req, res) => {
  try {
    const { content, author } = await getRandomQuoteTranslated();
    res.json({ content, author });
  } catch {
    res.status(500).json({ error: "Erro ao carregar frase" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌌 Servidor em http://localhost:${PORT}`);
});