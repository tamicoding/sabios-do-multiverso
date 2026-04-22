function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function inferMood(author, content) {
  const authorText = author.toLowerCase();
  const quoteText = content.toLowerCase();

  if (
    authorText.includes("angelou") ||
    authorText.includes("rumi") ||
    quoteText.includes("heart") ||
    quoteText.includes("love")
  ) {
    return "afeto";
  }

  if (
    authorText.includes("einstein") ||
    authorText.includes("da vinci") ||
    quoteText.includes("truth") ||
    quoteText.includes("knowledge")
  ) {
    return "clareza";
  }

  if (
    authorText.includes("gandhi") ||
    authorText.includes("churchill") ||
    quoteText.includes("future") ||
    quoteText.includes("success")
  ) {
    return "impulso";
  }

  if (
    authorText.includes("edison") ||
    authorText.includes("tesla") ||
    quoteText.includes("imagination")
  ) {
    return "surpresa";
  }

  return "reflexao";
}

function inferUniverse(author) {
  const authorText = author.toLowerCase();

  if (authorText.includes("einstein") || authorText.includes("tesla")) {
    return "Ciencia";
  }

  if (authorText.includes("rumi") || authorText.includes("seneca")) {
    return "Filosofia";
  }

  if (authorText.includes("angelou") || authorText.includes("poe")) {
    return "Literatura";
  }

  if (authorText.includes("gandhi") || authorText.includes("churchill")) {
    return "Lideranca";
  }

  return "ZenQuotes Archive";
}

function buildTags(author, content) {
  const baseTags = ["inspiracao"];
  const authorText = author.toLowerCase();
  const quoteText = content.toLowerCase();

  if (authorText.includes("einstein") || quoteText.includes("imagination")) {
    baseTags.push("criatividade", "ideias");
  }

  if (quoteText.includes("future") || quoteText.includes("success")) {
    baseTags.push("futuro", "acao");
  }

  if (quoteText.includes("heart") || quoteText.includes("love")) {
    baseTags.push("afeto", "relacoes");
  }

  if (quoteText.includes("truth") || quoteText.includes("wisdom")) {
    baseTags.push("sabedoria", "clareza");
  }

  return [...new Set(baseTags)].slice(0, 4);
}

function normalizeQuote(quote, index) {
  const originalContent = quote.q?.trim();
  const content = originalContent;
  const author = quote.a?.trim();

  if (!originalContent || !content || !author) {
    return null;
  }

  return {
    id: `zen-${slugify(author)}-${slugify(originalContent) || index}`,
    content,
    originalContent,
    author,
    universe: inferUniverse(author),
    tags: buildTags(author, originalContent),
    mood: inferMood(author, originalContent),
  };
}

export async function fetchRemoteQuotes() {
  try {
    const response = await fetch("/api/quotes");
    if (!response.ok) {
      return [];
    }

    const payload = await response.json();
    const quotes = Array.isArray(payload) ? payload : payload.quotes;

    if (!Array.isArray(quotes)) {
      return [];
    }

    const seenIds = new Set();

    return quotes
      .map((quote, index) => normalizeQuote(quote, index))
      .filter(Boolean)
      .filter((quote) => {
        if (seenIds.has(quote.id)) {
          return false;
        }

        seenIds.add(quote.id);
        return true;
      });
  } catch {
    return [];
  }
}
