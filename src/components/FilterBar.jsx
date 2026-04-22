export function FilterBar({
  authorValue,
  filters,
  hasActiveFilters,
  moodOptions,
  onChange,
  onReset,
  resultCount,
  themeOptions,
  universeOptions,
}) {
  return (
    <section className="filters-panel">
      <div className="filters-panel__header">
        <div>
          <p className="filters-panel__eyebrow">Curadoria cosmica</p>
          <h2 className="filters-panel__title">Refine a colecao por tema, humor ou universo</h2>
        </div>
        <div className="filters-panel__meta">
          <strong>{resultCount}</strong>
          <span>{resultCount === 1 ? "trecho encontrado" : "trechos encontrados"}</span>
        </div>
      </div>

      <div className="filters-grid">
        <label className="filter-field filter-field--wide">
          <span className="filter-field__label">Autor</span>
          <input
            className="filter-field__input"
            placeholder="Busque por autor ou criador"
            type="text"
            value={authorValue}
            onChange={(event) => onChange("author", event.target.value)}
          />
        </label>

        <label className="filter-field filter-field--theme">
          <span className="filter-field__label">Tema</span>
          <select value={filters.theme} onChange={(event) => onChange("theme", event.target.value)}>
            <option value="todos">Todos os temas</option>
            {themeOptions.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-field filter-field--mood">
          <span className="filter-field__label">Humor</span>
          <select value={filters.mood} onChange={(event) => onChange("mood", event.target.value)}>
            <option value="todos">Todos os humores</option>
            {moodOptions.map((mood) => (
              <option key={mood} value={mood}>
                {mood}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-field filter-field--universe">
          <span className="filter-field__label">Universo</span>
          <select
            value={filters.universe}
            onChange={(event) => onChange("universe", event.target.value)}
          >
            <option value="todos">Todos os universos</option>
            {universeOptions.map((universe) => (
              <option key={universe} value={universe}>
                {universe}
              </option>
            ))}
          </select>
        </label>
      </div>

      {hasActiveFilters ? (
        <div className="filters-panel__actions">
          <button className="button button--ghost" type="button" onClick={onReset}>
            Limpar busca
          </button>
        </div>
      ) : null}
    </section>
  );
}
