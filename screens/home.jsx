// LA TRYBU — Minimal home: logo + next pozo

function HomeScreen({ pozos, players, currentUser, isAdmin, onOpenPozo, onJoinPozo, onLeavePozo }) {
  const today = '2026-05-26';
  const nextPozo = pozos
    .filter(p => p.status !== 'completed' && p.date >= today)
    .sort((a,b) => a.date.localeCompare(b.date))[0];

  const lastPozo = pozos
    .filter(p => p.status === 'completed')
    .sort((a,b) => b.date.localeCompare(a.date))[0];

  if (!nextPozo) {
    return (
      <div data-screen-label="Inicio" className="home-empty">
        <Logo size={56} />
        <div className="empty" style={{ paddingTop: 80 }}>
          <div className="big">SIN POZO</div>
          <div>No hay ningún pozo programado todavía.</div>
        </div>
      </div>
    );
  }

  const isRegistered = nextPozo.registered?.includes(currentUser.id);
  const isWaitlisted = nextPozo.waitlist?.includes(currentUser.id);
  const placesLeft = (nextPozo.capacity || 28) - (nextPozo.registered?.length || 0);
  const d = new Date(nextPozo.date + 'T00:00');

  const dayDigits = String(d.getDate()).padStart(2, '0');
  const monthName = d.toLocaleDateString('es-ES', { month: 'long' });
  const weekdayName = d.toLocaleDateString('es-ES', { weekday: 'long' });
  const daysToGo = Math.ceil((d - new Date(today + 'T00:00')) / 86400000);

  return (
    <div data-screen-label="Inicio" className="home">
      <div className="home-logo">
        <Logo size={42} />
      </div>

      <div className="home-hero">
        <div className="home-eyebrow">
          <span className="label">Próximo pozo</span>
          <span className="tag accent">
            {daysToGo === 0 ? 'HOY' : daysToGo === 1 ? 'MAÑANA' : `EN ${daysToGo} DÍAS`}
          </span>
        </div>

        <div className="home-date">
          <div className="home-day">{dayDigits}</div>
          <div className="home-month">
            <div className="m1">{monthName}</div>
            <div className="m2">{weekdayName} · {d.getFullYear()}</div>
          </div>
        </div>

        <h1 className="display home-title">{nextPozo.name}</h1>

        <div className="home-meta">
          <span className={`tag ${nextPozo.type === 'ranking' ? 'accent' : ''}`}>
            {nextPozo.type === 'ranking' ? '★ Suma ranking' : '○ Pozo libre'}
          </span>
          <span className="tag">{nextPozo.fee}€ por jugador</span>
          <span className="tag">7 pistas · 28 plazas</span>
        </div>

        {/* Registration status / CTA */}
        <div className="home-cta">
          {isRegistered ? (
            <div className="home-status registered">
              <div>
                <div className="label" style={{ color: '#fff' }}>Estás dentro ✓</div>
                <div style={{ fontSize: 13, marginTop: 4, opacity: 0.85 }}>
                  Pago: {nextPozo.payments?.[currentUser.id] === 'paid' ? '✓ Confirmado' : '⏱ Pendiente'}
                </div>
              </div>
              <div className="flex gap-8">
                <button className="btn ghost sm" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }} onClick={() => onLeavePozo(nextPozo.id)}>
                  Cancelar
                </button>
                <button className="btn primary" onClick={() => onOpenPozo(nextPozo.id)}>
                  Ver pozo →
                </button>
              </div>
            </div>
          ) : isWaitlisted ? (
            <div className="home-status waitlist">
              <div>
                <div className="label" style={{ color: '#fff' }}>En lista de espera</div>
                <div style={{ fontSize: 13, marginTop: 4, opacity: 0.85 }}>
                  Posición #{nextPozo.waitlist.indexOf(currentUser.id) + 1}. Te avisaremos si entra una plaza.
                </div>
              </div>
              <button className="btn ghost sm" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }} onClick={() => onLeavePozo(nextPozo.id)}>
                Salir
              </button>
            </div>
          ) : (
            <div className="home-status open">
              <div>
                <div className="label">
                  {placesLeft > 0 ? `Quedan ${placesLeft} plazas` : 'Plazas completas'}
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                  {nextPozo.registered?.length || 0}/{nextPozo.capacity} inscritos
                  {nextPozo.waitlist?.length ? ` · ${nextPozo.waitlist.length} en espera` : ''}
                </div>
              </div>
              <button className="btn primary" onClick={() => onJoinPozo(nextPozo.id)}>
                {placesLeft > 0 ? 'Apuntarme · ' + nextPozo.fee + '€' : 'Lista de espera'}
              </button>
            </div>
          )}
        </div>

        {/* Mini progress: registered avatars row */}
        <div className="home-roster">
          <div className="roster-fill" style={{ width: `${Math.min(100, (nextPozo.registered.length / nextPozo.capacity) * 100)}%` }}></div>
          <div className="roster-avs">
            {nextPozo.registered.slice(0, 10).map(pid => {
              const p = players.find(pp => pp.id === pid);
              return p ? <Avatar key={pid} player={p} size={28} /> : null;
            })}
            {nextPozo.registered.length > 10 && (
              <div className="avatar" style={{ '--size':'28px', background:'var(--ink)', color:'var(--paper)', fontSize: 11 }}>
                +{nextPozo.registered.length - 10}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Last pozo recap (only if there is one) */}
      {lastPozo && (
        <div className="home-section">
          <div className="section-head">
            <div className="label">Último pozo</div>
            <button className="btn ghost sm" onClick={() => onOpenPozo(lastPozo.id)}>Ver detalle →</button>
          </div>
          <LastPozoSummary pozo={lastPozo} players={players} />
        </div>
      )}

      {/* Announcements feed for next pozo */}
      {nextPozo.announcements?.length > 0 && (
        <div className="home-section">
          <div className="section-head">
            <div className="label">Anuncios</div>
          </div>
          <div className="ann-list">
            {nextPozo.announcements.map(a => (
              <div key={a.id} className="ann-item">
                <div className="ann-avatar">A</div>
                <div className="ann-body">
                  <div className="ann-from">
                    {a.from} <span className="mono" style={{ color: 'var(--muted)', fontSize: 10 }}>{new Date(a.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <div className="ann-text">{a.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LastPozoSummary({ pozo, players }) {
  const winnerPairId = pozo.results?.[0];
  const winnerSlot = pozo.assignment?.[0] || [];
  return (
    <div className="last-pozo">
      <div className="lp-head">
        <div>
          <div className="display" style={{ fontSize: 32 }}>{pozo.name}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.14em' }}>
            {new Date(pozo.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }).toUpperCase()}
          </div>
        </div>
        <span className="tag accent">★ COMPLETADO</span>
      </div>

      <div className="lp-courts">
        {pozo.assignment && Object.entries(pozo.assignment).slice(0,3).map(([ci, slots]) => {
          const idx = parseInt(ci, 10);
          const winnerId = pozo.results?.[idx];
          return (
            <div key={ci} className={`lp-court ${idx === 0 ? 'reina' : ''}`}>
              <div className="lp-rank">
                <span className="display" style={{ fontSize: 36, color: idx === 0 ? 'var(--accent)' : 'var(--ink)' }}>{idx + 1}º</span>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '0.14em' }}>+{window.COURT_POINTS[idx]} PTS</div>
              </div>
              <div className="lp-winner">
                {winnerId && (() => {
                  const pair = window.SEED_PAIRS.find(p => p.id === winnerId);
                  if (!pair) return null;
                  const ps = pair.playerIds.map(id => players.find(pl => pl.id === id));
                  return (
                    <>
                      <div className="avs">
                        {ps.map(p => <Avatar key={p.id} player={p} size={32} />)}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{pair.name}</div>
                    </>
                  );
                })()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.HomeScreen = HomeScreen;
