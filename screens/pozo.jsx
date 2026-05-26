// LA TRYBU — Pozo: tabs (Inscritos, Pistas, Resultados, Anuncios)

function PozoScreen({ pozo, players, pairs, isAdmin, currentUser, onUpdate, onBack, onJoin, onLeave }) {
  // Default tab based on status & role
  const [tab, setTab] = React.useState(() => {
    if (pozo.status === 'completed') return 'pistas';
    return 'inscritos';
  });

  const isRegistered = pozo.registered?.includes(currentUser.id);
  const isWaitlisted = pozo.waitlist?.includes(currentUser.id);

  const tabs = [
    { id: 'inscritos', label: 'Inscritos', count: pozo.registered?.length || 0 },
    { id: 'pistas',    label: 'Pistas',    count: pozo.status === 'completed' ? '✓' : null },
    { id: 'resultados',label: 'Resultados',count: pozo.status === 'completed' ? '🏆' : null },
    { id: 'anuncios',  label: 'Anuncios',  count: pozo.announcements?.length || 0 },
  ];

  return (
    <div data-screen-label="Pozo">
      <div className="page-header">
        <div className="ttl-row">
          <button className="label back-link" onClick={onBack}>← Atrás</button>
          <h1 className="display">{pozo.name}</h1>
          <div className="flex gap-8" style={{ marginTop: 4, flexWrap: 'wrap' }}>
            <span className="tag ink">
              {new Date(pozo.date + 'T00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className={`tag ${pozo.type === 'ranking' ? 'accent' : ''}`}>
              {pozo.type === 'ranking' ? '★ Suma ranking' : '○ Libre'}
            </span>
            <span className="tag ghost">{pozo.fee}€</span>
          </div>
        </div>
        <div className="actions">
          {!isAdmin && pozo.status !== 'completed' && (
            isRegistered || isWaitlisted
              ? <button className="btn ghost" onClick={() => onLeave(pozo.id)}>Cancelar inscripción</button>
              : <button className="btn primary" onClick={() => onJoin(pozo.id)}>Apuntarme · {pozo.fee}€</button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map(t => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
            {t.count != null && <span className="tab-count">{t.count}</span>}
          </button>
        ))}
      </div>

      {tab === 'inscritos' && <InscritosTab pozo={pozo} players={players} isAdmin={isAdmin} currentUser={currentUser} onUpdate={onUpdate} />}
      {tab === 'pistas' && <PistasTab pozo={pozo} players={players} pairs={pairs} isAdmin={isAdmin} onUpdate={onUpdate} onGoToResults={() => setTab('resultados')} />}
      {tab === 'resultados' && <ResultadosTab pozo={pozo} players={players} pairs={pairs} isAdmin={isAdmin} onUpdate={onUpdate} />}
      {tab === 'anuncios' && <AnunciosTab pozo={pozo} isAdmin={isAdmin} onUpdate={onUpdate} />}
    </div>
  );
}

// ── INSCRITOS ───────────────────────────────────────────────────────────────
function InscritosTab({ pozo, players, isAdmin, currentUser, onUpdate }) {
  const placesLeft = (pozo.capacity || 28) - (pozo.registered?.length || 0);

  const togglePayment = (pid) => {
    if (!isAdmin) return;
    const payments = { ...(pozo.payments || {}) };
    payments[pid] = payments[pid] === 'paid' ? 'pending' : 'paid';
    onUpdate({ ...pozo, payments });
  };

  const removeFromList = (pid, list) => {
    const updated = { ...pozo };
    updated[list] = updated[list].filter(id => id !== pid);
    // If removing from registered, promote first waitlist
    if (list === 'registered' && updated.waitlist?.length > 0) {
      const promoted = updated.waitlist[0];
      updated.registered.push(promoted);
      updated.waitlist = updated.waitlist.slice(1);
    }
    onUpdate(updated);
  };

  const paidCount = pozo.registered?.filter(pid => pozo.payments?.[pid] === 'paid').length || 0;
  const collected = paidCount * pozo.fee;
  const expected = (pozo.registered?.length || 0) * pozo.fee;

  return (
    <div>
      {/* Inscription stats */}
      <div className="stat-strip stat-strip-3">
        <div className="stat-card">
          <div className="k">Inscritos</div>
          <div className="v">{pozo.registered?.length || 0}<span className="unit">/{pozo.capacity}</span></div>
        </div>
        <div className="stat-card">
          <div className="k">Lista espera</div>
          <div className="v">{pozo.waitlist?.length || 0}</div>
        </div>
        {isAdmin ? (
          <div className="stat-card">
            <div className="k">Recaudado</div>
            <div className="v">{collected}<span className="unit">/ {expected}€</span></div>
          </div>
        ) : (
          <div className="stat-card">
            <div className="k">Plazas libres</div>
            <div className="v">{Math.max(0, placesLeft)}</div>
          </div>
        )}
      </div>

      <div className="section-head" style={{ marginTop: 22, marginBottom: 12 }}>
        <h3 className="display" style={{ fontSize: 28, margin: 0 }}>Inscritos</h3>
        {isAdmin && <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.12em' }}>Toca el chip de pago para alternar</div>}
      </div>

      <div className="inscritos-grid">
        {(pozo.registered || []).map((pid, idx) => {
          const p = players.find(pl => pl.id === pid);
          if (!p) return null;
          const paid = pozo.payments?.[pid] === 'paid';
          const isMe = pid === currentUser.id;
          return (
            <div key={pid} className={`inscrito-card ${isMe ? 'me' : ''}`}>
              <div className="inscrito-num">{String(idx+1).padStart(2,'0')}</div>
              <Avatar player={p} size={42} />
              <div className="inscrito-info">
                <div className="nm">{p.nombre} {p.apellido} {isMe && <span className="mono" style={{ fontSize: 10, color: 'var(--accent)' }}>· TÚ</span>}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>Nivel {p.nivel}</div>
              </div>
              <button
                className={`pay-chip ${paid ? 'paid' : 'pending'}`}
                onClick={() => togglePayment(pid)}
                disabled={!isAdmin}
              >
                {paid ? '✓ Pagado' : '⏱ Pendiente'}
              </button>
              {isAdmin && (
                <button className="kebab" onClick={() => removeFromList(pid, 'registered')} title="Quitar">×</button>
              )}
            </div>
          );
        })}
      </div>

      {pozo.waitlist?.length > 0 && (
        <>
          <div className="section-head" style={{ marginTop: 26, marginBottom: 12 }}>
            <h3 className="display" style={{ fontSize: 28, margin: 0 }}>Lista de espera</h3>
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.12em' }}>{pozo.waitlist.length} EN COLA</span>
          </div>
          <div className="inscritos-grid waitlist-grid">
            {pozo.waitlist.map((pid, idx) => {
              const p = players.find(pl => pl.id === pid);
              if (!p) return null;
              const isMe = pid === currentUser.id;
              return (
                <div key={pid} className={`inscrito-card waitlist ${isMe ? 'me' : ''}`}>
                  <div className="inscrito-num">#{idx+1}</div>
                  <Avatar player={p} size={42} />
                  <div className="inscrito-info">
                    <div className="nm">{p.nombre} {p.apellido} {isMe && <span className="mono" style={{ fontSize: 10, color: 'var(--accent)' }}>· TÚ</span>}</div>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>En espera</div>
                  </div>
                  {isAdmin && (
                    <button className="kebab" onClick={() => removeFromList(pid, 'waitlist')}>×</button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ── PISTAS (drag & drop for admin, read-only for players) ──────────────────
function PistasTab({ pozo, players, pairs, isAdmin, onUpdate, onGoToResults }) {
  const [dragInfo, setDragInfo] = React.useState(null);
  const [hoverCourt, setHoverCourt] = React.useState(null);

  const assignedIds = React.useMemo(() => {
    const s = new Set();
    Object.values(pozo.assignment || {}).forEach(arr => arr.forEach(id => id && s.add(id)));
    return s;
  }, [pozo.assignment]);

  // Pairs eligible = those where BOTH members are registered to this pozo
  const eligible = pairs.filter(pair =>
    pair.playerIds.every(pid => pozo.registered?.includes(pid))
  );
  const availablePairs = eligible.filter(p => !assignedIds.has(p.id));

  const dropToCourt = (courtIdx, slotIdx) => {
    if (!dragInfo || !isAdmin) return;
    const newAssign = JSON.parse(JSON.stringify(pozo.assignment || {}));
    for (let i = 0; i < 7; i++) newAssign[i] = newAssign[i] || [null, null];
    const target = newAssign[courtIdx][slotIdx];
    if (dragInfo.fromCourt != null) {
      newAssign[dragInfo.fromCourt][dragInfo.fromSlot] = target || null;
    }
    newAssign[courtIdx][slotIdx] = dragInfo.pairId;
    onUpdate({ ...pozo, assignment: newAssign });
    setDragInfo(null);
    setHoverCourt(null);
  };

  const dropToPool = () => {
    if (!dragInfo || dragInfo.fromCourt == null || !isAdmin) { setDragInfo(null); return; }
    const newAssign = JSON.parse(JSON.stringify(pozo.assignment || {}));
    newAssign[dragInfo.fromCourt][dragInfo.fromSlot] = null;
    onUpdate({ ...pozo, assignment: newAssign });
    setDragInfo(null); setHoverCourt(null);
  };

  const shuffleByRanking = () => {
    if (!isAdmin) return;
    const sorted = [...eligible].sort((a, b) => {
      const sumA = a.playerIds.reduce((s, id) => s + (players.find(p=>p.id===id)?.pts || 0), 0);
      const sumB = b.playerIds.reduce((s, id) => s + (players.find(p=>p.id===id)?.pts || 0), 0);
      return sumB - sumA;
    });
    const newAssign = {};
    for (let i = 0; i < 7; i++) newAssign[i] = [sorted[i*2]?.id || null, sorted[i*2+1]?.id || null];
    onUpdate({ ...pozo, assignment: newAssign });
  };
  const randomShuffle = () => {
    if (!isAdmin) return;
    const shuffled = [...eligible].sort(() => Math.random() - 0.5);
    const newAssign = {};
    for (let i = 0; i < 7; i++) newAssign[i] = [shuffled[i*2]?.id || null, shuffled[i*2+1]?.id || null];
    onUpdate({ ...pozo, assignment: newAssign });
  };
  const clearAll = () => {
    if (!isAdmin) return;
    const newAssign = {};
    for (let i = 0; i < 7; i++) newAssign[i] = [null, null];
    onUpdate({ ...pozo, assignment: newAssign });
  };

  const assignedCount = [...assignedIds].length;
  const allFilled = assignedCount === 14;

  return (
    <div>
      {isAdmin && (
        <div className="pistas-toolbar">
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.12em' }}>
            {assignedCount}/14 PAREJAS ASIGNADAS · {eligible.length - assignedCount} DISPONIBLES
          </div>
          <div className="flex gap-8">
            <button className="btn ghost sm" onClick={clearAll}>Vaciar</button>
            <button className="btn ghost sm" onClick={randomShuffle}>🎲 Sortear</button>
            <button className="btn ghost sm" onClick={shuffleByRanking}>↧ Por ranking</button>
            {allFilled && (
              <button className="btn primary sm" onClick={onGoToResults}>
                {pozo.status === 'completed' ? 'Resultados →' : 'Cerrar pozo →'}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="pozo-board">
        <div className="courts">
          {window.COURT_NAMES.map((name, i) => {
            const slots = pozo.assignment?.[i] || [null, null];
            const courtPairs = slots.map(id => pairs.find(p => p.id === id));
            const isReina = i === 0;
            const winner = pozo.results?.[i];
            return (
              <div
                key={i}
                className={`court ${isReina ? 'reina' : ''} ${hoverCourt === i ? 'drop-target' : ''}`}
                onDragOver={(e) => { if (isAdmin) { e.preventDefault(); setHoverCourt(i); } }}
                onDragLeave={() => setHoverCourt(null)}
              >
                <div className="court-head">
                  <div className="court-num">
                    <span className="n">{i + 1}</span>
                    <span className="label-line">
                      <span className="l1">{isReina ? 'Reina · 1ª' : `Pista nº ${i+1}`}</span>
                      <span className="l2">{name}</span>
                    </span>
                  </div>
                  <div className="pts">+{window.COURT_POINTS[i]}<span className="pts-unit">pts</span></div>
                </div>
                <div className="pairs">
                  {[0,1].map(slotIdx => {
                    const p = courtPairs[slotIdx];
                    const isWinner = winner && p && p.id === winner;
                    return (
                      <div
                        key={slotIdx}
                        onDragOver={(e) => isAdmin && e.preventDefault()}
                        onDrop={(e) => { if (!isAdmin) return; e.preventDefault(); e.stopPropagation(); dropToCourt(i, slotIdx); }}
                      >
                        <PairTile
                          pair={p}
                          players={players}
                          points={p ? window.COURT_POINTS[i] : null}
                          isWinner={isWinner}
                          draggable={isAdmin}
                          onDragStart={() => p && isAdmin && setDragInfo({ pairId: p.id, fromCourt: i, fromSlot: slotIdx })}
                          onDragEnd={() => setDragInfo(null)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {isAdmin && (
          <div
            className="pool-panel"
            onDragOver={(e) => e.preventDefault()}
            onDrop={dropToPool}
          >
            <h3>Parejas</h3>
            <div className="label" style={{ marginBottom: 10 }}>
              {availablePairs.length} disponibles · arrastra a una pista
            </div>
            <div className="pool-list">
              {availablePairs.length === 0 && (
                <div className="empty" style={{ padding: 20 }}>
                  <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em' }}>todas asignadas ✓</div>
                </div>
              )}
              {availablePairs.map(pair => {
                const ps = pair.playerIds.map(id => players.find(p => p.id === id));
                return (
                  <div
                    key={pair.id}
                    className="pool-pair"
                    draggable
                    onDragStart={() => setDragInfo({ pairId: pair.id, fromCourt: null, fromSlot: null })}
                    onDragEnd={() => setDragInfo(null)}
                  >
                    <div className="avs" style={{ display: 'flex' }}>
                      {ps.map(p => <Avatar key={p.id} player={p} size={30} />)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pair.name}</div>
                      <div className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>
                        {ps.reduce((s,p)=> s + (p?.pts||0), 0)} pts acumulados
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--line-2)' }}>
              <div className="label" style={{ marginBottom: 8 }}>Puntos por pista</div>
              <div className="mono" style={{ fontSize: 12, lineHeight: 1.9 }}>
                {window.COURT_NAMES.map((n, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{i === 0 ? '★ ' : ''}{n}</span>
                    <span style={{ fontWeight: 600, color: i === 0 ? 'var(--accent)' : 'var(--ink)' }}>+{window.COURT_POINTS[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── RESULTADOS ──────────────────────────────────────────────────────────────
function ResultadosTab({ pozo, players, pairs, isAdmin, onUpdate }) {
  const setWinner = (courtIdx, pairId) => {
    if (!isAdmin) return;
    const newResults = { ...(pozo.results || {}) };
    if (newResults[courtIdx] === pairId) delete newResults[courtIdx];
    else newResults[courtIdx] = pairId;
    onUpdate({ ...pozo, results: newResults });
  };

  const allSet = Object.keys(pozo.results || {}).length === 7;

  const finalize = () => {
    onUpdate({ ...pozo, status: 'completed' });
  };

  const reopen = () => {
    onUpdate({ ...pozo, status: 'upcoming' });
  };

  return (
    <div>
      {isAdmin && (
        <div className="pistas-toolbar">
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.12em' }}>
            {Object.keys(pozo.results || {}).length}/7 PISTAS DECIDIDAS
          </div>
          <div className="flex gap-8">
            {pozo.status !== 'completed'
              ? <button className="btn primary sm" disabled={!allSet} onClick={finalize} style={!allSet ? { opacity: 0.5, cursor: 'not-allowed' } : {}}>
                  {allSet ? '✓ Cerrar pozo' : `Faltan ${7 - Object.keys(pozo.results || {}).length}`}
                </button>
              : <button className="btn ghost sm" onClick={reopen}>↺ Reabrir</button>
            }
          </div>
        </div>
      )}

      {window.COURT_NAMES.map((name, i) => {
        const slots = pozo.assignment?.[i] || [null, null];
        const courtPairs = slots.map(id => pairs.find(p => p.id === id));
        const winnerId = pozo.results?.[i];
        return (
          <div key={i} className="result-court">
            <div className="head">
              <div className="court-num">
                <span className="n" style={{ color: i === 0 ? 'var(--accent)' : 'var(--ink)' }}>{i+1}</span>
                <span className="label-line">
                  <span className="l1">{i === 0 ? 'Reina · 1ª' : `Pista nº ${i+1}`}</span>
                  <span className="l2">{name}</span>
                </span>
              </div>
              <span className="tag accent">+{window.COURT_POINTS[i]} pts</span>
            </div>
            <div className="pair-pick">
              {courtPairs.map((p, idx) => {
                if (!p) return (
                  <div key={idx} className="pick empty">
                    <div className="crown">SIN ASIGNAR</div>
                  </div>
                );
                const isWinner = winnerId === p.id;
                const ps = p.playerIds.map(id => players.find(pl => pl.id === id));
                return (
                  <div
                    key={p.id}
                    className={`pick ${isWinner ? 'winner' : ''}`}
                    onClick={() => setWinner(i, p.id)}
                    style={!isAdmin ? { cursor: 'default' } : {}}
                  >
                    <div className="crown">{isWinner ? '🏆 GANADORES' : (isAdmin ? 'TOCAR PARA ELEGIR' : '—')}</div>
                    <div className="flex gap-12" style={{ alignItems: 'center' }}>
                      <div className="avs" style={{ display: 'flex' }}>
                        {ps.map(pl => <Avatar key={pl.id} player={pl} size={32} />)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{p.name}</div>
                        <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
                          {ps.map(pl => pl?.nombre).join(' · ')}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── ANUNCIOS ────────────────────────────────────────────────────────────────
function AnunciosTab({ pozo, isAdmin, onUpdate }) {
  const [text, setText] = React.useState('');
  const post = () => {
    if (!text.trim()) return;
    const a = {
      id: 'a' + Date.now(),
      from: 'Admin',
      date: '2026-05-26',
      text: text.trim(),
    };
    onUpdate({ ...pozo, announcements: [...(pozo.announcements || []), a] });
    setText('');
  };

  const ann = pozo.announcements || [];

  return (
    <div className="ann-tab">
      {isAdmin && (
        <div className="ann-composer">
          <div className="ann-avatar">A</div>
          <textarea
            placeholder="Escribe un anuncio para los jugadores del pozo..."
            value={text}
            rows={2}
            onChange={e => setText(e.target.value)}
          />
          <button className="btn primary sm" disabled={!text.trim()} onClick={post}>Publicar</button>
        </div>
      )}
      <div className="ann-list" style={{ marginTop: 14 }}>
        {ann.length === 0 ? (
          <div className="empty" style={{ padding: 40 }}>
            <div className="mono" style={{ fontSize: 12, letterSpacing: '0.14em' }}>SIN ANUNCIOS TODAVÍA</div>
          </div>
        ) : (
          [...ann].reverse().map(a => (
            <div key={a.id} className="ann-item">
              <div className="ann-avatar">A</div>
              <div className="ann-body">
                <div className="ann-from">
                  {a.from} <span className="mono" style={{ color: 'var(--muted)', fontSize: 10 }}>{new Date(a.date).toLocaleDateString('es-ES', { day:'numeric', month:'short' })}</span>
                </div>
                <div className="ann-text">{a.text}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

window.PozoScreen = PozoScreen;
