export function StatsPanel({
  dailyQuote,
  favoritesCount,
  filteredCount,
  hasActiveFilters,
  quotesCount,
  todayViews,
}) {
  return (
    <section className="panel panel--side">
      <h2 className="panel-title">Panorama rapido</h2>

      <div className="stats">
        <div className="stat">
          <strong>{todayViews}</strong>
          <span>leituras hoje</span>
        </div>
        <div className="stat">
          <strong>{favoritesCount}</strong>
          <span>trechos salvos</span>
        </div>
        <div className="stat">
          <strong>{quotesCount}</strong>
          <span>trechos no acervo</span>
        </div>
      </div>

      {hasActiveFilters ? (
        <p className="panel-note">
          Seu recorte atual revela <strong>{filteredCount}</strong> trecho
          {filteredCount === 1 ? "" : "s"} nesta leitura.
        </p>
      ) : null}

      <div className="daily">
        <h2 className="panel-title">Destaque do dia</h2>
        <p>{dailyQuote.content}</p>
        <p>
          {dailyQuote.author} · {dailyQuote.universe}
        </p>
      </div>
    </section>
  );
}
