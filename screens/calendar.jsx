// LA TRYBU — Calendar screen

function CalendarScreen({ pozos, onOpenPozo, onNewPozo, players }) {
  const [month, setMonth] = React.useState({ y: 2026, m: 4 }); // May 2026
  const today = new Date('2026-05-26');

  const monthName = new Date(month.y, month.m, 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const first = new Date(month.y, month.m, 1);
  const firstDow = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(month.y, month.m + 1, 0).getDate();
  const totalCells = Math.ceil((firstDow + daysInMonth) / 7) * 7;

  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - firstDow + 1;
    if (dayNum < 1 || dayNum > daysInMonth) {
      cells.push({ off: true, key: i });
    } else {
      const date = new Date(month.y, month.m, dayNum);
      const iso = date.toISOString().slice(0,10);
      const dayPozos = pozos.filter(p => p.date === iso);
      const isToday = (date.toDateString() === today.toDateString());
      cells.push({ off: false, key: i, dayNum, iso, dayPozos, isToday });
    }
  }

  const stepMonth = (delta) => {
    let { y, m } = month;
    m += delta;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setMonth({ y, m });
  };

  // Upcoming pozo (for hero strip)
  const upcoming = pozos
    .filter(p => p.status !== 'completed' && p.date >= '2026-05-26')
    .sort((a,b) => a.date.localeCompare(b.date))[0];

  const totalPlayers = players.length;
  const totalPozos = pozos.length;
  const totalPozosCompleted = pozos.filter(p => p.status === 'completed').length;

  return (
    <div data-screen-label="Calendario">
      <div className="page-header">
        <div className="ttl-row">
          <span className="label">Vista general</span>
          <h1 className="display">Calendario</h1>
          <div className="sub">Organiza los pozos del club. Cada pozo son 7 pistas, 14 parejas, 28 jugadores.</div>
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={() => stepMonth(-1)}>← {new Date(month.y, month.m - 1, 1).toLocaleDateString('es-ES', { month: 'short' })}</button>
          <button className="btn ghost" onClick={() => stepMonth(1)}>{new Date(month.y, month.m + 1, 1).toLocaleDateString('es-ES', { month: 'short' })} →</button>
          {onNewPozo && <button className="btn primary" onClick={onNewPozo}>＋ Nuevo pozo</button>}
        </div>
      </div>

      {/* Stat strip */}
      <div className="stat-strip">
        <div className="stat-card">
          <div className="k">Pozos en {monthName}</div>
          <div className="v">{pozos.filter(p => p.date.startsWith(`${month.y}-${String(month.m+1).padStart(2,'0')}`)).length}</div>
        </div>
        <div className="stat-card">
          <div className="k">Total temporada</div>
          <div className="v">{totalPozosCompleted}<span className="unit">/ {totalPozos}</span></div>
        </div>
        <div className="stat-card">
          <div className="k">Jugadores activos</div>
          <div className="v">{totalPlayers}</div>
        </div>
        <div className="stat-card">
          <div className="k">Próximo pozo</div>
          <div className="v" style={{ fontSize: 24 }}>
            {upcoming ? new Date(upcoming.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }) : '—'}
          </div>
        </div>
      </div>

      {/* Hero: next pozo */}
      {upcoming && (
        <div
          className="card"
          style={{ padding: 22, marginBottom: 26, display: 'grid', gridTemplateColumns: '1fr auto', gap: 18, alignItems: 'center', borderColor: 'var(--ink)', borderWidth: 1.5 }}
          onClick={() => onOpenPozo(upcoming.id)}
        >
          <div>
            <div className="label" style={{ marginBottom: 6 }}>Próximo en juego</div>
            <h2 className="display" style={{ fontSize: 56, margin: '0 0 8px' }}>{upcoming.name}</h2>
            <div className="flex gap-8" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="tag ink">{new Date(upcoming.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              <span className={`tag ${upcoming.type === 'ranking' ? 'accent' : ''}`}>
                {upcoming.type === 'ranking' ? '★ Suma ranking' : '○ Pozo libre'}
              </span>
              <span className="tag ghost">{upcoming.fee}€ por jugador</span>
            </div>
          </div>
          <button className="btn primary" onClick={(e) => { e.stopPropagation(); onOpenPozo(upcoming.id); }}>
            Abrir pozo →
          </button>
        </div>
      )}

      <div className="toolbar">
        <h3 className="display" style={{ fontSize: 36, margin: 0, textTransform: 'capitalize' }}>{monthName}</h3>
        <div className="chips">
          <span className="chip active">Mes</span>
          <span className="chip">Lista</span>
        </div>
      </div>

      <div className="cal-head">
        {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="cal-grid">
        {cells.map(c => c.off
          ? <div key={c.key} className="cal-cell off"></div>
          : (
            <div
              key={c.key}
              className={`cal-cell ${c.isToday ? 'today' : ''}`}
              onClick={() => c.dayPozos[0] ? onOpenPozo(c.dayPozos[0].id) : onNewPozo && onNewPozo(c.iso)}
            >
              <div className="day">{c.dayNum}</div>
              {c.dayPozos.map(p => (
                <div key={p.id} className={`pozo-pill ${p.type === 'ranking' ? 'ranking' : ''}`}>
                  <div className="pname">{p.name}</div>
                  <div className="pmeta">{p.status === 'completed' ? '✓ finalizado' : p.status === 'upcoming' ? '14 parejas' : 'borrador'}</div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

window.CalendarScreen = CalendarScreen;
