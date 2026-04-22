export function FavoritesPanel({ favorites, onRemove }) {
  return (
    <section className="panel panel--side">
      <h2 className="panel-title">Sua selecao</h2>

      {favorites.length === 0 ? (
        <p className="empty-state">Salve os trechos que merecem voltar para a sua leitura.</p>
      ) : (
        <div className="favorites">
          {favorites.map((quote) => (
            <article key={quote.id} className="favorite-item">
              <p className="favorite-item__content">{quote.content}</p>
              <p className="favorite-item__meta">
                {quote.author} · {quote.universe}
              </p>
              <button
                className="favorite-item__remove"
                type="button"
                onClick={() => onRemove(quote.id)}
              >
                Remover da selecao
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
