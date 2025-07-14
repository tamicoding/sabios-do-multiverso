const express = require("express");
const axios = require("axios");
const app = express();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://api.quotable.io/random");
    const { content, author } = response.data;

    res.render("index", { content, author });
  } catch (error) {
    console.error("Erro ao buscar a frase:", error.message);
    res.render("index", {
      content: "Não foi possível acessar a sabedoria do multiverso.",
      author: "Sistema"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});