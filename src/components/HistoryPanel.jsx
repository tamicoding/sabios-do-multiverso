export function HistoryPanel({ history, onSelect }) {
  return (
    <section className="panel panel--side">
      <h2 className="panel-title">Lidos recentemente</h2>

      {history.length === 0 ? (
        <p className="empty-state">Os proximos trechos lidos vao aparecer aqui.</p>
      ) : (
        <div className="history-list">
          {history.map((quote, index) => (
            <article key={quote.id} className="history-item">
              <span className="history-item__index">{String(index + 1).padStart(2, "0")}</span>
              <div className="history-item__body">
                <p className="history-item__content">{quote.content}</p>
                <p className="history-item__meta">
                  {quote.author} · {quote.universe}
                </p>
              </div>
              <button
                className="history-item__action"
                type="button"
                onClick={() => onSelect(quote.id)}
              >
                Revisitar
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
