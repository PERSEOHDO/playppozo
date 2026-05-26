// LA TRYBU — History of past pozos

function HistoryScreen({ pozos, players, pairs, onOpenPozo }) {
  const completed = pozos
    .filter(p => p.status === 'completed')
    .sort((a, b) => b.date.localeCompare(a.date));

  const upcoming = pozos
    .filter(p => p.status !== 'completed')
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div data-screen-label="Historial">
      <div className="page-header">
        <div className="ttl-row">
          <span className="label">Histórico</span>
          <h1 className="display">Historial de Pozos</h1>
          <div className="sub">Todos los pozos celebrados. Toca uno para revisar la asignación de pistas y los resultados.</div>
        </div>
        <div className="actions">
          <button className="btn ghost sm">⤓ Exportar todo</button>
        </div>
      </div>

      <div className="stat-strip" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="k">Pozos finalizados</div>
          <div className="v">{completed.length}</div>
        </div>
        <div className="stat-card">
          <div className="k">Próximos / Borradores</div>
          <div className="v">{upcoming.length}</div>
        </div>
        <div className="stat-card">
          <div className="k">Recaudado total</div>
          <div className="v">
            {completed.reduce((s, p) => s + (p.fee * 28), 0)}
            <span className="unit">€</span>
          </div>
        </div>
      </div>

      {upcoming.length > 0 && (
        <>
          <h3 className="display" style={{ fontSize: 28, margin: '8px 0 12px' }}>Próximos</h3>
          <div className="hist-list" style={{ marginBottom: 26 }}>
            {upcoming.map(p => (
              <HistRow key={p.id} pozo={p} players={players} pairs={pairs} onOpenPozo={onOpenPozo} />
            ))}
          </div>
        </>
      )}

      <h3 className="display" style={{ fontSize: 28, margin: '8px 0 12px' }}>Finalizados</h3>
      <div className="hist-list">
        {completed.map(p => (
          <HistRow key={p.id} pozo={p} players={players} pairs={pairs} onOpenPozo={onOpenPozo} />
        ))}
        {completed.length === 0 && (
          <div className="empty">
            <div className="big">VACÍO</div>
            <div>Cuando termines un pozo, aparecerá aquí.</div>
          </div>
        )}
      </div>
    </div>
  );
}

function HistRow({ pozo, players, pairs, onOpenPozo }) {
  const d = new Date(pozo.date + 'T00:00');
  // winning pair on pista reina
  const reinaWinnerId = pozo.results?.[0];
  const reinaWinner = pairs.find(p => p.id === reinaWinnerId);
  const winnerPlayers = reinaWinner?.playerIds.map(id => players.find(p => p.id === id)) || [];

  return (
    <div className="hist-row" onClick={() => onOpenPozo(pozo.id)}>
      <div className="date">
        {d.getDate()}
        <small>{d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }).toUpperCase()}</small>
      </div>
      <div className="ttl">
        {pozo.name}
        <div className="sub mono" style={{ fontSize: 11, letterSpacing: '0.1em' }}>
          {pozo.type === 'ranking' ? '★ RANKING' : '○ LIBRE'} · {pozo.fee}€/jugador
        </div>
      </div>
      <div className="winners">
        {reinaWinner ? (
          <>
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>👑 Pista Reina</span>
            <div className="av">
              {winnerPlayers.map(p => <Avatar key={p.id} player={p} size={28} />)}
            </div>
            <span style={{ fontWeight: 600, fontSize: 13 }}>{reinaWinner.name}</span>
          </>
        ) : (
          <span className="tag ghost">{pozo.status === 'upcoming' ? 'Próximo' : 'Borrador'}</span>
        )}
      </div>
      <div className="muted">→</div>
    </div>
  );
}

window.HistoryScreen = HistoryScreen;
