const axios = require("axios");
const { translate } = require('google-translate-api-x'); // ← NOVO

// Busca frase em inglês
async function getRandomQuote() {
  const response = await axios.get("https://zenquotes.io/api/random", {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json"
    }
  });

  const quote = response.data?.[0];
  return {
    content: quote?.q || "",
    author: quote?.a || "Autor desconhecido"
  };
}

// Traduz com Google
async function translateToPT(text) {
  try {
    const result = await translate(text, {
      from: 'en',
      to: 'pt',
      tld: 'pt' // usa google.com.br pra PT-BR
    });
    
    console.log("Google traduziu:", result.text);
    return result.text;
  } catch (error) {
    console.log("Google falhou:", error.message);
    return text; // fallback inglês
  }
}

// Função principal
async function getRandomQuoteTranslated() {
  const { content, author } = await getRandomQuote();

  if (!content || content.trim() === "") {
    return {
      content: "A sabedoria do multiverso está em silêncio hoje.",
      author: "Sistema"
    };
  }

  try {
    const translatedContent = await translateToPT(content);
    return { content: translatedContent, author };
  } catch (error) {
    return { content, author };
  }
}

module.exports = {
  getRandomQuoteTranslated
};