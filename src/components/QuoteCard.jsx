export function QuoteCard({
  accent,
  canToggleOriginal,
  displayContent,
  isFavorite,
  isInstagramSharing,
  isRemoteQuote,
  isTranslating,
  isTransitioning,
  onCopy,
  onFavoriteToggle,
  onInstagramShare,
  onNewQuote,
  onShareCard,
  onSurprise,
  onTranslate,
  onToggleOriginal,
  onWhatsAppShare,
  onXShare,
  quote,
  quoteStage,
  showOriginal,
}) {
  return (
    <section
      className="quote-card"
      aria-live="polite"
      style={{
        "--quote-accent-glow": accent.glow,
        "--quote-accent-line": accent.line,
        "--quote-badge-from": accent.badgeFrom,
        "--quote-badge-to": accent.badgeTo,
        "--quote-badge-text": accent.badgeText,
        "--quote-meta-accent": accent.meta,
      }}
    >
      <div className={`quote-shell ${quoteStage}`}>
        <span className="quote-mark">"</span>
        <div className="translation-toolbar">
          <span className="translation-toolbar__label">
            {isRemoteQuote ? "Idioma da leitura" : "Texto atual"}
          </span>
          <div className="translation-toolbar__actions">
            {isRemoteQuote ? (
              <div className="export-segmented" role="tablist" aria-label="Idioma da frase">
                <button
                  aria-selected={!showOriginal}
                  className="export-segmented__button"
                  data-active={!showOriginal ? "true" : "false"}
                  disabled={isTransitioning || isTranslating}
                  type="button"
                  onClick={() => {
                    if (canToggleOriginal) {
                      onToggleOriginal(false);
                      return;
                    }

                    onTranslate();
                  }}
                >
                  {isTranslating ? "Traduzindo..." : "Em portugues"}
                </button>
                <button
                  aria-selected={showOriginal}
                  className="export-segmented__button"
                  data-active={showOriginal ? "true" : "false"}
                  disabled={isTransitioning}
                  type="button"
                  onClick={() => onToggleOriginal(true)}
                >
                  Original
                </button>
              </div>
            ) : (
              <span className="translation-note">Leitura disponivel em portugues.</span>
            )}
          </div>
        </div>

        <blockquote className="quote">{displayContent}</blockquote>

        <p className="translation-note">
            {!isRemoteQuote
              ? "Este trecho ja faz parte da colecao em portugues."
              : isTranslating
                ? "Preparando a leitura em portugues."
                : canToggleOriginal && !showOriginal
                  ? "Voce esta lendo a versao em portugues. Use Original para comparar."
                  : canToggleOriginal && showOriginal
                    ? "Voce esta lendo o texto original. Use Em portugues para alternar."
                    : "Este trecho esta no original. Use Ver em portugues se quiser traduzir."}
        </p>

        <div className="quote-meta">
          <strong className="quote-author">{quote.author}</strong>
          <span className="quote-universe">{quote.universe}</span>
        </div>

        <ul className="tags">
          {quote.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>

      <div className="share-toolbar">
        <span className="share-toolbar__label">Levar adiante</span>
        <div className="share-toolbar__actions" aria-label="Redes sociais">
          <button
            aria-label="Compartilhar no WhatsApp"
            className="share-icon-button"
            disabled={isTransitioning}
            type="button"
            onClick={onWhatsAppShare}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M19.05 4.91A9.82 9.82 0 0 0 12.07 2C6.65 2 2.25 6.38 2.25 11.79c0 1.73.45 3.42 1.31 4.91L2 22l5.45-1.42a9.88 9.88 0 0 0 4.62 1.17h.01c5.42 0 9.82-4.38 9.82-9.79 0-2.61-1.02-5.06-2.85-6.95ZM12.08 20.1h-.01a8.23 8.23 0 0 1-4.19-1.14l-.3-.18-3.24.85.87-3.15-.2-.32a8.12 8.12 0 0 1-1.25-4.35c0-4.5 3.7-8.16 8.25-8.16 2.2 0 4.26.85 5.81 2.39a8.07 8.07 0 0 1 2.41 5.77c0 4.5-3.7 8.16-8.15 8.16Zm4.47-6.08c-.24-.12-1.42-.7-1.64-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06a6.62 6.62 0 0 1-1.95-1.19 7.31 7.31 0 0 1-1.36-1.69c-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.41-.54-.42h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.09 3.62.57.25 1.02.4 1.37.51.58.18 1.1.15 1.52.09.46-.07 1.42-.58 1.62-1.13.2-.55.2-1.02.14-1.13-.06-.11-.22-.18-.46-.3Z" />
            </svg>
            <span>WhatsApp</span>
          </button>
          <button
            aria-label="Preparar story para Instagram"
            className="share-icon-button"
            disabled={isTransitioning}
            type="button"
            onClick={onInstagramShare}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M7.75 2h8.5C19.42 2 22 4.58 22 7.75v8.5C22 19.42 19.42 22 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5C2 4.58 4.58 2 7.75 2Zm-.19 1.8A3.76 3.76 0 0 0 3.8 7.56v8.88c0 2.08 1.68 3.76 3.76 3.76h8.88c2.08 0 3.76-1.68 3.76-3.76V7.56c0-2.08-1.68-3.76-3.76-3.76H7.56Zm8.99 1.35a1.09 1.09 0 1 1 0 2.18 1.09 1.09 0 0 1 0-2.18ZM12 6.86A5.14 5.14 0 1 1 6.86 12 5.15 5.15 0 0 1 12 6.86Zm0 1.8A3.34 3.34 0 1 0 15.34 12 3.34 3.34 0 0 0 12 8.66Z" />
            </svg>
            <span>{isInstagramSharing ? "Montando..." : "Instagram"}</span>
          </button>
          <button
            aria-label="Compartilhar no X"
            className="share-icon-button"
            disabled={isTransitioning}
            type="button"
            onClick={onXShare}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.27l-4.9-7.41L5.54 22H2.43l7.24-8.28L1.6 2h6.42l4.43 6.76L18.9 2Zm-1.09 18.13h1.72L7.09 3.78H5.24l12.57 16.35Z" />
            </svg>
            <span>X</span>
          </button>
        </div>
      </div>

      <div className="actions">
        <button
          className="button button--primary"
          disabled={isTransitioning}
          type="button"
          onClick={onNewQuote}
        >
          Nova frase
        </button>
        <button
          aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          className="button button--ghost"
          data-active={isFavorite ? "true" : "false"}
          disabled={isTransitioning}
          type="button"
          onClick={onFavoriteToggle}
        >
          {isFavorite ? "Na selecao" : "Salvar"}
        </button>
        <button className="button button--ghost" disabled={isTransitioning} type="button" onClick={onCopy}>
          Copiar trecho
        </button>
        <button
          className="button button--ghost"
          disabled={isTransitioning}
          type="button"
          onClick={onShareCard}
        >
          Baixar card
        </button>
        <button
          className="button button--ghost"
          disabled={isTransitioning}
          type="button"
          onClick={onSurprise}
        >
          Surpresa em portugues
        </button>
      </div>
    </section>
  );
}
