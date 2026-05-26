// LA TRYBU — Ranking acumulado de la temporada

function RankingScreen({ pozos, players, pairs }) {
  const [filter, setFilter] = React.useState('all');

  // Compute season points from completed ranking-type pozos
  const seasonPoints = React.useMemo(() => {
    const tally = {}; // playerId -> { pts, pozosPlayed, wins, podiums }
    const ranked = pozos.filter(p => p.status === 'completed' && (filter === 'all' ? p.type === 'ranking' : p.type === 'ranking'));
    ranked.forEach(pozo => {
      Object.entries(pozo.assignment || {}).forEach(([courtIdx, slotPair]) => {
        const ci = parseInt(courtIdx, 10);
        const pts = window.COURT_POINTS[ci];
        slotPair.forEach(pairId => {
          if (!pairId) return;
          const pair = pairs.find(p => p.id === pairId);
          if (!pair) return;
          pair.playerIds.forEach(pid => {
            if (!tally[pid]) tally[pid] = { pts: 0, pozos: 0, wins: 0, podiums: 0 };
            tally[pid].pts += pts;
            tally[pid].pozos += 1;
            if (pozo.results?.[ci] === pairId) tally[pid].wins += 1;
            if (ci <= 2 && pozo.results?.[ci] === pairId) tally[pid].podiums += 1;
            if (ci === 0) tally[pid].podiums = Math.max(tally[pid].podiums, 1);
          });
        });
      });
    });
    return tally;
  }, [pozos, pairs, filter]);

  const ranked = [...players].map(p => ({
    ...p,
    season: seasonPoints[p.id] || { pts: 0, pozos: 0, wins: 0, podiums: 0 },
  })).sort((a, b) => b.season.pts - a.season.pts);

  // Decorate: only show players with at least 1 pozo or pts
  const withActivity = ranked.filter(r => r.season.pozos > 0 || r.season.pts > 0);
  const idle = ranked.filter(r => !(r.season.pozos > 0 || r.season.pts > 0));

  return (
    <div data-screen-label="Ranking">
      <div className="page-header">
        <div className="ttl-row">
          <span className="label">Temporada 2026 · Nivel 0–3</span>
          <h1 className="display">Clasificación Ranking</h1>
          <div className="sub">Acumulado de todos los pozos de tipo <em>Ranking</em>. El ganador final se lleva el premio del club.</div>
        </div>
        <div className="actions">
          <button className="btn ghost sm">📷 Exportar imagen</button>
          <button className="btn ghost sm">⤓ CSV</button>
        </div>
      </div>

      {/* Podium */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 22 }}>
        {[1,0,2].map(i => {
          const r = withActivity[i];
          if (!r) return <div key={i}></div>;
          const place = i + 1;
          const height = place === 1 ? 180 : place === 2 ? 150 : 130;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
              <div style={{ marginBottom: 8 }}>
                <Avatar player={r} size={place === 1 ? 80 : 64} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{r.nombre}</div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{r.apellido}</div>
              <div
                className="display"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  padding: '14px 0 18px',
                  marginTop: 10,
                  background: place === 1 ? 'var(--accent)' : 'var(--ink)',
                  color: 'var(--paper)',
                  borderRadius: '12px 12px 4px 4px',
                  height: height,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
              >
                <div className="display" style={{ fontSize: 42, lineHeight: 1 }}>{place}º</div>
                <div className="mono" style={{ transform: 'skewX(0)', fontSize: 11, opacity: 0.7, marginTop: 6 }}>
                  {r.season.pts} PTS
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rank-table">
        <div className="rank-row head">
          <div>Posición</div>
          <div>Jugador</div>
          <div>Pozos</div>
          <div style={{ textAlign: 'right' }}>Puntos</div>
        </div>
        {withActivity.map((r, idx) => (
          <div key={r.id} className={`rank-row ${idx === 0 ? 'top1' : ''}`}>
            <div className="pos">{idx + 1}</div>
            <div className="player">
              <Avatar player={r} size={36} />
              <div>
                <div className="name">{r.nombre} {r.apellido}</div>
                <div className="meta">{r.season.wins} 🏆 · {r.season.podiums} podiums</div>
              </div>
            </div>
            <div className="pozos">{r.season.pozos} jugados</div>
            <div className="pts">{r.season.pts}</div>
          </div>
        ))}
        {idle.length > 0 && (
          <div className="rank-row" style={{ background: 'var(--paper)' }}>
            <div></div>
            <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.14em' }}>
              + {idle.length} JUGADORES SIN ACTIVIDAD
            </div>
            <div></div>
            <div></div>
          </div>
        )}
      </div>
    </div>
  );
}

window.RankingScreen = RankingScreen;
