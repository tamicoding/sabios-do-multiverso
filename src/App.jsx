import { useEffect, useRef, useState } from "react";
import { FilterBar } from "./components/FilterBar";
import { FavoritesPanel } from "./components/FavoritesPanel";
import { HistoryPanel } from "./components/HistoryPanel";
import { QuoteCard } from "./components/QuoteCard";
import { StatsPanel } from "./components/StatsPanel";
import { quotes as localQuotes } from "./data/quotes";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { translateQuoteContent } from "./services/translate";
import { fetchRemoteQuotes } from "./services/zenquotes";

const STORAGE_KEYS = {
  favorites: "sabios:favorites",
  viewsByDay: "sabios:views-by-day",
  lastQuoteId: "sabios:last-quote-id",
  history: "sabios:history",
  remoteQuotes: "sabios:remote-quotes",
  remoteQuotesUpdatedAt: "sabios:remote-quotes-updated-at",
  translations: "sabios:translations",
};

function getTodayKey() {
  return new Date().toLocaleDateString("pt-BR");
}

function getDailyQuoteFromCollection(collection) {
  if (collection.length === 0) {
    return localQuotes[0];
  }

  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return collection[dayOfYear % collection.length];
}

function matchesFilters(quote, filters) {
  const themeMatch = filters.theme === "todos" || quote.tags.includes(filters.theme);
  const moodMatch = filters.mood === "todos" || quote.mood === filters.mood;
  const universeMatch = filters.universe === "todos" || quote.universe === filters.universe;
  const authorQuery = filters.author.trim().toLowerCase();
  const authorMatch = authorQuery === "" || quote.author.toLowerCase().includes(authorQuery);
  return themeMatch && moodMatch && universeMatch && authorMatch;
}

function getRandomQuoteFromPool(pool, excludeId) {
  const availableQuotes = pool.filter((quote) => quote.id !== excludeId);
  const choices = availableQuotes.length > 0 ? availableQuotes : pool;
  return choices[Math.floor(Math.random() * choices.length)];
}

function getQuoteAccent(quote) {
  const moodAccents = {
    afeto: {
      glow: "rgba(255, 155, 205, 0.18)",
      line: "rgba(255, 155, 205, 0.28)",
      badgeFrom: "#ffcad4",
      badgeTo: "#ff8fab",
      badgeText: "#4a1121",
      meta: "#ffcad4",
    },
    clareza: {
      glow: "rgba(120, 220, 255, 0.2)",
      line: "rgba(120, 220, 255, 0.24)",
      badgeFrom: "#90e0ef",
      badgeTo: "#48cae4",
      badgeText: "#06243a",
      meta: "#90e0ef",
    },
    impulso: {
      glow: "rgba(255, 180, 95, 0.2)",
      line: "rgba(255, 180, 95, 0.24)",
      badgeFrom: "#ffd166",
      badgeTo: "#ff9f1c",
      badgeText: "#10202b",
      meta: "#ffd166",
    },
    surpresa: {
      glow: "rgba(173, 132, 255, 0.2)",
      line: "rgba(173, 132, 255, 0.24)",
      badgeFrom: "#cdb4ff",
      badgeTo: "#9d4edd",
      badgeText: "#21103a",
      meta: "#d7c3ff",
    },
    reflexao: {
      glow: "rgba(128, 255, 219, 0.18)",
      line: "rgba(128, 255, 219, 0.22)",
      badgeFrom: "#b7efc5",
      badgeTo: "#80ffdb",
      badgeText: "#0e2d2a",
      meta: "#80ffdb",
    },
  };

  return (
    moodAccents[quote.mood] || {
      glow: "rgba(255, 209, 102, 0.18)",
      line: "rgba(255, 209, 102, 0.22)",
      badgeFrom: "#ffd166",
      badgeTo: "#ff9f1c",
      badgeText: "#10202b",
      meta: "#80ffdb",
    }
  );
}

function wrapCanvasText(context, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (context.measureText(testLine).width <= maxWidth) {
      currentLine = testLine;
      return;
    }

    if (currentLine) {
      lines.push(currentLine);
    }
    currentLine = word;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function loadCanvasFont(fontValue) {
  if (!("fonts" in document)) {
    return Promise.resolve();
  }

  return document.fonts.load(fontValue).then(() => undefined);
}

async function buildQuoteCardBlob(quote, format, quoteContent) {
  const accent = getQuoteAccent(quote);
  await Promise.all([
    loadCanvasFont('700 38px "Syne"'),
    loadCanvasFont('600 22px "Source Sans 3"'),
    loadCanvasFont('400 18px "Source Sans 3"'),
  ]);

  const canvas = document.createElement("canvas");
  const isStory = format === "story";
  canvas.width = isStory ? 1080 : 1200;
  canvas.height = isStory ? 1920 : 1500;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("canvas-unavailable");
  }

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#06131d");
  gradient.addColorStop(1, "#123149");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = accent.glow;
  context.beginPath();
  context.arc(isStory ? 220 : 180, 180, isStory ? 210 : 160, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "rgba(128, 255, 219, 0.12)";
  context.beginPath();
  context.arc(isStory ? 850 : 980, isStory ? 1600 : 1240, isStory ? 280 : 220, 0, Math.PI * 2);
  context.fill();

  const cardX = isStory ? 72 : 90;
  const cardY = isStory ? 180 : 120;
  const cardWidth = isStory ? 936 : 1020;
  const cardHeight = isStory ? 1450 : 1120;
  const cardRadius = 36;

  context.fillStyle = "rgba(7, 27, 41, 0.88)";
  context.strokeStyle = accent.line;
  context.lineWidth = 2;
  context.beginPath();
  context.roundRect(cardX, cardY, cardWidth, cardHeight, cardRadius);
  context.fill();
  context.stroke();

  const badgeGradient = context.createLinearGradient(cardX, cardY, cardX + 210, cardY + 70);
  badgeGradient.addColorStop(0, accent.badgeFrom);
  badgeGradient.addColorStop(1, accent.badgeTo);
  context.fillStyle = badgeGradient;
  context.beginPath();
  context.roundRect(cardX + 64, cardY + 60, 210, 72, 28);
  context.fill();

  context.fillStyle = accent.badgeText;
  context.font = `700 ${isStory ? 44 : 42}px "Syne"`;
  context.fillText('"', cardX + 146, cardY + 110);

  context.fillStyle = accent.meta;
  context.font = `700 ${isStory ? 22 : 20}px "Source Sans 3"`;
  context.fillText("ARQUIVO COSMICO DE FRASES", cardX + 64, cardY + 180);

  context.fillStyle = "#f3fbff";
  context.font = `700 ${isStory ? 76 : 72}px "Syne"`;
  context.fillText("Sabios do Multiverso", cardX + 64, cardY + 260);

  context.font = `700 ${isStory ? 42 : 38}px "Syne"`;
  const quoteLines = wrapCanvasText(context, quoteContent, cardWidth - 128);
  let currentY = cardY + (isStory ? 430 : 390);
  quoteLines.forEach((line) => {
    context.fillText(line, cardX + 64, currentY);
    currentY += isStory ? 64 : 58;
  });

  context.fillStyle = accent.meta;
  context.font = `600 ${isStory ? 28 : 26}px "Source Sans 3"`;
  context.fillText(`${quote.author} · ${quote.universe}`, cardX + 64, currentY + 50);

  let tagX = cardX + 64;
  let tagY = currentY + 110;
  context.font = `600 ${isStory ? 22 : 20}px "Source Sans 3"`;
  quote.tags.forEach((tag) => {
    const tagWidth = context.measureText(tag).width + 42;
    if (tagX + tagWidth > cardX + cardWidth - 64) {
      tagX = cardX + 64;
      tagY += 58;
    }

    context.fillStyle = "rgba(255, 255, 255, 0.08)";
    context.beginPath();
    context.roundRect(tagX, tagY, tagWidth, isStory ? 44 : 40, 20);
    context.fill();

    context.fillStyle = "#96b9cb";
    context.fillText(tag, tagX + 20, tagY + (isStory ? 29 : 26));
    tagX += tagWidth + 12;
  });

  context.fillStyle = "#96b9cb";
  context.font = `400 ${isStory ? 26 : 24}px "Source Sans 3"`;
  context.fillText("book notes · tamiris reis", cardX + 64, cardY + cardHeight - 60);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("blob-generation-failed"));
        return;
      }
      resolve(blob);
    }, "image/png");
  });
}

function getShareCopy(content, quote) {
  return `"${content}" — ${quote.author} · ${quote.universe}`;
}

function getSharePageUrl() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.location.href;
}

function App() {
  const [favorites, setFavorites] = useLocalStorage(STORAGE_KEYS.favorites, []);
  const [history, setHistory] = useLocalStorage(STORAGE_KEYS.history, []);
  const [cachedRemoteQuotes, setCachedRemoteQuotes] = useLocalStorage(STORAGE_KEYS.remoteQuotes, []);
  const [cachedRemoteQuotesUpdatedAt, setCachedRemoteQuotesUpdatedAt] = useLocalStorage(
    STORAGE_KEYS.remoteQuotesUpdatedAt,
    0,
  );
  const [translatedQuotesById, setTranslatedQuotesById] = useLocalStorage(STORAGE_KEYS.translations, {});
  const [viewsByDay, setViewsByDay] = useLocalStorage(STORAGE_KEYS.viewsByDay, {});
  const [lastQuoteId, setLastQuoteId] = useLocalStorage(STORAGE_KEYS.lastQuoteId, null);
  const [quoteCollection, setQuoteCollection] = useState(() =>
    cachedRemoteQuotes.length > 0 ? [...localQuotes, ...cachedRemoteQuotes] : localQuotes,
  );
  const [currentQuote, setCurrentQuote] = useState(() =>
    getDailyQuoteFromCollection(cachedRemoteQuotes.length > 0 ? [...localQuotes, ...cachedRemoteQuotes] : localQuotes),
  );
  const [quoteStage, setQuoteStage] = useState("is-visible");
  const [showOriginalQuote, setShowOriginalQuote] = useState(true);
  const [isInstagramSharing, setIsInstagramSharing] = useState(false);
  const [isTranslatingQuote, setIsTranslatingQuote] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [filters, setFilters] = useState({
    author: "",
    theme: "todos",
    mood: "todos",
    universe: "todos",
  });
  const animationTimeoutRef = useRef();

  useEffect(() => {
    let isMounted = true;

    async function loadQuotes() {
      const twoHoursInMs = 1000 * 60 * 60 * 2;
      const shouldRefresh = Date.now() - Number(cachedRemoteQuotesUpdatedAt || 0) > twoHoursInMs;

      if (!shouldRefresh && cachedRemoteQuotes.length > 0) {
        return;
      }

      const remoteQuotes = await fetchRemoteQuotes();
      if (!isMounted || remoteQuotes.length === 0) {
        return;
      }

      setCachedRemoteQuotes(remoteQuotes);
      setCachedRemoteQuotesUpdatedAt(Date.now());
      setQuoteCollection((previous) => {
        const knownIds = new Set(previous.map((quote) => quote.id));
        const merged = [...previous];

        remoteQuotes.forEach((quote) => {
          if (!knownIds.has(quote.id)) {
            merged.push(quote);
          }
        });

        return merged;
      });
    }

    loadQuotes();

    return () => {
      isMounted = false;
    };
  }, [
    cachedRemoteQuotes.length,
    cachedRemoteQuotesUpdatedAt,
    setCachedRemoteQuotes,
    setCachedRemoteQuotesUpdatedAt,
  ]);

  useEffect(() => {
    return () => {
      window.clearTimeout(animationTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!toastMessage) return undefined;

    const timeoutId = window.setTimeout(() => {
      setToastMessage("");
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const dailyQuote = getDailyQuoteFromCollection(quoteCollection);
  const todayViews = viewsByDay[getTodayKey()] || 0;
  const isFavorite = favorites.some((quote) => quote.id === currentQuote.id);
  const themeOptions = [...new Set(quoteCollection.flatMap((quote) => quote.tags))].sort();
  const moodOptions = [...new Set(quoteCollection.map((quote) => quote.mood))].sort();
  const universeOptions = [...new Set(quoteCollection.map((quote) => quote.universe))].sort();
  const filteredQuotes = quoteCollection.filter((quote) => matchesFilters(quote, filters));
  const hasActiveFilters =
    filters.author.trim() !== "" ||
    filters.theme !== "todos" ||
    filters.mood !== "todos" ||
    filters.universe !== "todos";
  const quoteAccent = getQuoteAccent(currentQuote);
  const isRemoteQuote = typeof currentQuote.id === "string" && currentQuote.id.startsWith("zen-");
  const originalQuoteContent = currentQuote.originalContent || currentQuote.content;
  const translatedQuoteContent = translatedQuotesById[currentQuote.id] || currentQuote.content;
  const canToggleOriginal = translatedQuoteContent !== originalQuoteContent;
  const displayedQuoteContent =
    !canToggleOriginal || showOriginalQuote ? originalQuoteContent : translatedQuoteContent;

  useEffect(() => {
    if (filteredQuotes.length === 0) {
      return;
    }

    if (!matchesFilters(currentQuote, filters)) {
      transitionToQuote(filteredQuotes[0]);
    }
  }, [currentQuote, filteredQuotes, filters]);

  function transitionToQuote(nextQuote) {
    window.clearTimeout(animationTimeoutRef.current);
    setShowOriginalQuote(true);
    setIsTranslatingQuote(false);
    setQuoteStage("is-exiting");

    animationTimeoutRef.current = window.setTimeout(() => {
      setCurrentQuote(nextQuote);
      setQuoteStage("is-entering");

      animationTimeoutRef.current = window.setTimeout(() => {
        setQuoteStage("is-visible");
      }, 240);
    }, 180);
  }

  function incrementViews() {
    const todayKey = getTodayKey();
    setViewsByDay((previous) => ({
      ...previous,
      [todayKey]: (previous[todayKey] || 0) + 1,
    }));
  }

  function addToHistory(quote) {
    setHistory((previous) => {
      const nextHistory = [quote, ...previous.filter((item) => item.id !== quote.id)];
      return nextHistory.slice(0, 8);
    });
  }

  function showNextQuote() {
    const pool = filteredQuotes.length > 0 ? filteredQuotes : quoteCollection;
    const nextQuote = getRandomQuoteFromPool(pool, lastQuoteId);
    transitionToQuote(nextQuote);
    setLastQuoteId(nextQuote.id);
    addToHistory(nextQuote);
    incrementViews();
  }

  function surpriseMe() {
    const pool = filteredQuotes.length > 0 ? filteredQuotes : quoteCollection;
    const surpriseQuote =
      pool.find((quote) => quote.mood === "surpresa" && quote.id !== currentQuote.id) ||
      getRandomQuoteFromPool(pool, currentQuote.id);

    transitionToQuote(surpriseQuote);
    setLastQuoteId(surpriseQuote.id);
    addToHistory(surpriseQuote);
    incrementViews();
    setToastMessage("Nova rota aberta na colecao.");
  }

  async function copyCurrentQuote() {
    const text = `"${displayedQuoteContent}" — ${currentQuote.author} (${currentQuote.universe})`;

    try {
      await navigator.clipboard.writeText(text);
      setToastMessage("Trecho copiado com sucesso.");
    } catch {
      setToastMessage("Nao deu para copiar automaticamente.");
    }
  }

  async function shareQuoteCard() {
    try {
      const blob = await buildQuoteCardBlob(currentQuote, "post", displayedQuoteContent);
      const filename = `sabios-${currentQuote.id}-post.png`;
      const file = new File([blob], filename, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
        await navigator.share({
          files: [file],
          title: "Sabios do Multiverso",
          text: `"${displayedQuoteContent}" — ${currentQuote.author}`,
        });
        setToastMessage("Card pronto para compartilhar.");
        return;
      }

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      setToastMessage("Card baixado em PNG.");
    } catch {
      setToastMessage("Nao foi possivel gerar o card agora.");
    }
  }

  function shareToWhatsApp() {
    const shareText = `${getShareCopy(displayedQuoteContent, currentQuote)}\n\n${getSharePageUrl()}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
  }

  function shareToX() {
    const text = getShareCopy(displayedQuoteContent, currentQuote);
    const url = getSharePageUrl();
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function shareToInstagram() {
    try {
      setIsInstagramSharing(true);
      const caption = `${getShareCopy(displayedQuoteContent, currentQuote)}\n\n${getSharePageUrl()}`;
      const blob = await buildQuoteCardBlob(currentQuote, "story", displayedQuoteContent);
      const filename = `sabios-${currentQuote.id}-story.png`;
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);

      try {
        await navigator.clipboard.writeText(caption);
        setToastMessage("Story baixado e legenda pronta para colar.");
      } catch {
        setToastMessage("Story baixado. A legenda pode ser copiada manualmente.");
      }
    } catch {
      setToastMessage("Nao foi possivel preparar o story agora.");
    } finally {
      setIsInstagramSharing(false);
    }
  }

  async function translateCurrentQuote() {
    if (!isRemoteQuote || canToggleOriginal || isTranslatingQuote) {
      return;
    }

    try {
      setIsTranslatingQuote(true);
      const translatedText = await translateQuoteContent(originalQuoteContent);

      if (translatedText && translatedText !== originalQuoteContent) {
        setTranslatedQuotesById((previous) => ({
          ...previous,
          [currentQuote.id]: translatedText,
        }));
        setShowOriginalQuote(false);
        setToastMessage("Traducao pronta para leitura.");
        return;
      }

      setToastMessage("A traducao nao esta disponivel neste ambiente.");
    } catch {
      setToastMessage("A traducao nao esta disponivel neste ambiente.");
    } finally {
      setIsTranslatingQuote(false);
    }
  }

  function toggleFavorite() {
    if (isFavorite) {
      setFavorites((previous) => previous.filter((quote) => quote.id !== currentQuote.id));
      setToastMessage("Trecho removido da sua selecao.");
      return;
    }

    setFavorites((previous) => [currentQuote, ...previous].slice(0, 12));
    setToastMessage("Trecho salvo na sua selecao.");
  }

  function removeFavorite(id) {
    setFavorites((previous) => previous.filter((quote) => quote.id !== id));
    setToastMessage("Trecho removido da sua selecao.");
  }

  function updateFilter(key, value) {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function resetFilters() {
    setFilters({
      author: "",
      theme: "todos",
      mood: "todos",
      universe: "todos",
    });
  }

  function revisitQuote(id) {
    const selectedQuote = quoteCollection.find((quote) => quote.id === id);
    if (!selectedQuote || selectedQuote.id === currentQuote.id) {
      return;
    }

    transitionToQuote(selectedQuote);
    setLastQuoteId(selectedQuote.id);
    addToHistory(selectedQuote);
    incrementViews();
    setToastMessage("Trecho recuperado do historico.");
  }

  return (
    <>
      <main className="shell">
        <header className="site-header">
          <div className="site-header__brand">
            <span className="site-header__orb" aria-hidden="true" />
            <div>
              <p className="site-header__eyebrow">Uma colecao para reler, salvar e compartilhar</p>
              <h2 className="site-header__title">Sabios do Multiverso</h2>
            </div>
          </div>
        </header>

        <section className="hero">
          <article className="panel panel--main">
            <p className="eyebrow">Selecao de frases marcantes</p>
            <h1 className="title">Sabios do Multiverso</h1>
            <p className="subtitle">
              Explore ideias marcantes por tema, humor ou autor e encontre o trecho certo para o
              momento que voce quer guardar, compartilhar ou revisitar.
            </p>

            <FilterBar
              authorValue={filters.author}
              filters={filters}
              hasActiveFilters={hasActiveFilters}
              moodOptions={moodOptions}
              onChange={updateFilter}
              onReset={resetFilters}
              resultCount={filteredQuotes.length}
              themeOptions={themeOptions}
              universeOptions={universeOptions}
            />

            {filteredQuotes.length > 0 ? (
              <QuoteCard
                accent={quoteAccent}
                canToggleOriginal={canToggleOriginal}
                displayContent={displayedQuoteContent}
                isFavorite={isFavorite}
                isInstagramSharing={isInstagramSharing}
                isRemoteQuote={isRemoteQuote}
                isTranslating={isTranslatingQuote}
                isTransitioning={quoteStage !== "is-visible"}
                onCopy={copyCurrentQuote}
                onFavoriteToggle={toggleFavorite}
                onInstagramShare={shareToInstagram}
                onNewQuote={showNextQuote}
                onShareCard={shareQuoteCard}
                onSurprise={surpriseMe}
                onTranslate={translateCurrentQuote}
                onToggleOriginal={setShowOriginalQuote}
                onWhatsAppShare={shareToWhatsApp}
                onXShare={shareToX}
                quote={currentQuote}
                quoteStage={quoteStage}
                showOriginal={showOriginalQuote}
              />
            ) : (
              <section className="quote-card quote-card--empty">
                <span className="quote-mark">!</span>
                <h2 className="empty-title">Nenhum trecho apareceu com essa combinacao.</h2>
                <p className="empty-copy">
                  Ajuste autor, tema, humor ou universo para descobrir novos caminhos dentro da
                  colecao.
                </p>
                <div className="actions">
                  <button className="button button--primary" type="button" onClick={resetFilters}>
                    Limpar busca
                  </button>
                </div>
              </section>
            )}
          </article>

          <aside className="grid">
            <StatsPanel
              dailyQuote={dailyQuote}
              favoritesCount={favorites.length}
              filteredCount={filteredQuotes.length}
              hasActiveFilters={hasActiveFilters}
              quotesCount={quoteCollection.length}
              todayViews={todayViews}
            />

            <FavoritesPanel favorites={favorites} onRemove={removeFavorite} />
            <HistoryPanel history={history} onSelect={revisitQuote} />
          </aside>
        </section>

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Sabios do Multiverso · criado por Tamiris Reis</p>
        </footer>
      </main>

      <div
        aria-live="assertive"
        className="toast"
        data-visible={toastMessage ? "true" : "false"}
      >
        {toastMessage}
      </div>
    </>
  );
}

export default App;
