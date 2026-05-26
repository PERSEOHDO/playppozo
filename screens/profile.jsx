// LA TRYBU — Player profile: Playtomic-style stats

function ProfileScreen({ player, pozos, players, pairs, onEditPlayer }) {
  // Compute personal stats
  const stats = React.useMemo(() => {
    let pozosPlayed = 0;
    let wins = 0;
    let podiums = 0;
    let totalPts = 0;
    let bestCourt = 8; // lower is better
    const history = []; // {date, pozoName, courtIdx, pts, win}

    pozos.filter(p => p.status === 'completed').forEach(pozo => {
      Object.entries(pozo.assignment || {}).forEach(([ci, slots]) => {
        const idx = parseInt(ci, 10);
        slots.forEach(pairId => {
          if (!pairId) return;
          const pair = pairs.find(p => p.id === pairId);
          if (!pair?.playerIds.includes(player.id)) return;
          pozosPlayed++;
          const pts = window.COURT_POINTS[idx];
          totalPts += pts;
          if (idx < bestCourt) bestCourt = idx;
          const win = pozo.results?.[ci] === pairId;
          if (win) wins++;
          if (idx <= 2) podiums++;
          history.push({
            date: pozo.date,
            pozoName: pozo.name,
            courtIdx: idx,
            pts,
            win,
            pairId,
          });
        });
      });
    });

    return {
      pozosPlayed,
      wins,
      podiums,
      totalPts,
      bestCourt: bestCourt === 8 ? null : bestCourt,
      winRate: pozosPlayed > 0 ? Math.round((wins / pozosPlayed) * 100) : 0,
      history: history.sort((a,b) => b.date.localeCompare(a.date)),
    };
  }, [player, pozos, pairs]);

  // Pair info
  const myPair = pairs.find(p => p.playerIds.includes(player.id));
  const partner = myPair ? players.find(pl => pl.id === myPair.playerIds.find(id => id !== player.id)) : null;

  // Ranking position
  const allRanked = React.useMemo(() => {
    return [...players].sort((a, b) => b.pts - a.pts);
  }, [players]);
  const rankPos = allRanked.findIndex(p => p.id === player.id) + 1;

  return (
    <div data-screen-label="Perfil">
      <div className="page-header" style={{ borderBottom: 0, paddingBottom: 0, marginBottom: 18 }}>
        <div className="ttl-row">
          <span className="label">Mi ficha</span>
          <h1 className="display">Perfil</h1>
        </div>
        <div className="actions">
          <button className="btn ghost sm" onClick={() => onEditPlayer(player)}>✎ Editar</button>
        </div>
      </div>

      {/* Header card */}
      <div className="profile-hero">
        <div className="profile-id">
          <Avatar player={player} size={96} />
          <div>
            <div className="display" style={{ fontSize: 48, lineHeight: 0.95 }}>{player.nombre}</div>
            <div className="display" style={{ fontSize: 32, color: 'var(--muted)' }}>{player.apellido}</div>
            {myPair && (
              <div className="tag" style={{ marginTop: 12 }}>
                ◆ Pareja: {partner ? `${partner.nombre} ${partner.apellido}` : myPair.name}
              </div>
            )}
          </div>
        </div>

        <div className="profile-quick">
          <div className="pq-item">
            <div className="display" style={{ fontSize: 42, color: 'var(--accent)' }}>#{rankPos}</div>
            <div className="label">Posición</div>
          </div>
          <div className="pq-item">
            <div className="display" style={{ fontSize: 42 }}>{player.pts}</div>
            <div className="label">Puntos</div>
          </div>
          <div className="pq-item">
            <div className="display" style={{ fontSize: 42 }}>{player.nivel}</div>
            <div className="label">Nivel</div>
          </div>
        </div>
      </div>

      {/* Stat grid */}
      <div className="stat-strip" style={{ marginTop: 18 }}>
        <div className="stat-card">
          <div className="k">Pozos jugados</div>
          <div className="v">{stats.pozosPlayed}</div>
        </div>
        <div className="stat-card">
          <div className="k">Pista Reina ganada</div>
          <div className="v">{stats.wins}<span className="unit"> 🏆</span></div>
        </div>
        <div className="stat-card">
          <div className="k">% Victorias</div>
          <div className="v">{stats.winRate}<span className="unit">%</span></div>
        </div>
        <div className="stat-card">
          <div className="k">Mejor pista</div>
          <div className="v">{stats.bestCourt != null ? (stats.bestCourt + 1) + 'ª' : '—'}</div>
        </div>
      </div>

      {/* Progression chart */}
      <div className="card" style={{ padding: 18, marginTop: 18 }}>
        <div className="section-head" style={{ marginBottom: 12 }}>
          <div className="label">Evolución de puntos</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
            Últimos {Math.min(stats.history.length, 10)} pozos
          </div>
        </div>
        <ProgressionChart history={[...stats.history].reverse()} />
      </div>

      {/* Match history */}
      <div className="card" style={{ padding: 18, marginTop: 18 }}>
        <div className="section-head" style={{ marginBottom: 12 }}>
          <div className="label">Historial personal</div>
        </div>
        {stats.history.length === 0 ? (
          <div className="empty" style={{ padding: 30 }}>
            <div className="mono" style={{ fontSize: 12, letterSpacing: '0.14em' }}>SIN PARTIDOS TODAVÍA</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Apúntate al próximo pozo para empezar tu historial.</div>
          </div>
        ) : (
          <div className="match-list">
            {stats.history.map((m, i) => (
              <div key={i} className="match-row">
                <div className="match-date">
                  {new Date(m.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                </div>
                <div className="match-name">{m.pozoName}</div>
                <div className="match-court">
                  <span className="tag">{m.courtIdx === 0 ? '★ Pista Reina' : `Pista ${m.courtIdx + 1}`}</span>
                </div>
                <div className="match-pts">+{m.pts} pts</div>
                <div className="match-res">
                  {m.win ? <span className="tag accent">🏆 GANADOR</span> : <span className="tag ghost">2º pista</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressionChart({ history }) {
  // Cumulative pts over time as area chart
  const cum = [];
  let running = 0;
  history.forEach(h => { running += h.pts; cum.push({ ...h, total: running }); });
  if (cum.length === 0) {
    return <div className="empty" style={{ padding: 30 }}>
      <div className="mono" style={{ fontSize: 12, letterSpacing: '0.14em' }}>SIN DATOS AÚN</div>
    </div>;
  }

  const W = 720, H = 160, PAD = 20;
  const maxY = Math.max(...cum.map(c => c.total), 200);
  const points = cum.map((c, i) => {
    const x = PAD + (cum.length === 1 ? (W - PAD*2)/2 : (i / (cum.length - 1)) * (W - PAD*2));
    const y = H - PAD - (c.total / maxY) * (H - PAD * 2);
    return { x, y, ...c };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length-1].x},${H - PAD} L ${points[0].x},${H - PAD} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <defs>
        <linearGradient id="prog-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* y axis lines */}
      {[0, 0.5, 1].map((t, i) => (
        <line key={i} x1={PAD} x2={W-PAD} y1={H - PAD - t * (H - PAD * 2)} y2={H - PAD - t * (H - PAD * 2)} stroke="var(--line)" strokeDasharray="2,3" />
      ))}
      <path d={areaPath} fill="url(#prog-grad)" />
      <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="var(--accent)" stroke="#fff" strokeWidth="2" />
          <text x={p.x} y={H - 4} textAnchor="middle" fontSize="9" fill="var(--muted)" fontFamily="var(--font-mono)">
            {new Date(p.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
          </text>
        </g>
      ))}
    </svg>
  );
}

window.ProfileScreen = ProfileScreen;
