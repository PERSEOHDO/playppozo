// LA TRYBU — App shell + state + admin mode + mobile nav

const { useState, useEffect, useMemo, useRef } = React;

function App() {
  const [tweaks, setTweak] = window.useTweaks
    ? window.useTweaks(window.TWEAK_DEFAULTS)
    : [window.TWEAK_DEFAULTS, () => {}];

  // Apply tweak CSS vars
  useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty('--accent', tweaks.accent);
    r.setProperty('--ink', tweaks.ink);
    r.setProperty('--paper', tweaks.paper);
    r.setProperty('--skew', tweaks.italicSkew + 'deg');
  }, [tweaks]);

  // ── State
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState({ name: 'home' });
  const [players, setPlayers] = useState(window.SEED_PLAYERS);
  const [pairs] = useState(window.SEED_PAIRS);
  const [pozos, setPozos] = useState(window.SEED_POZOS);
  const [config, setConfig] = useState(window.SEED_CLUB_CONFIG);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const currentUser = players.find(p => p.id === window.CURRENT_USER_ID) || players[0];

  // ── Actions
  const updatePozo = (next) => setPozos(prev => prev.map(p => p.id === next.id ? next : p));
  const openPozo = (id) => setView({ name: 'pozo', id });
  const newPozo = (isoDate) => {
    const id = 'pz-' + Math.random().toString(36).slice(2, 7);
    const empty = {}; for (let i = 0; i < 7; i++) empty[i] = [null, null];
    const date = isoDate || new Date().toISOString().slice(0,10);
    const newPz = {
      id, name: `Pozo ${new Date(date).toLocaleDateString('es-ES', { day:'numeric', month:'short' })}`,
      date, type: 'ranking', status: 'upcoming',
      fee: config.defaultFee, capacity: config.defaultCapacity,
      registered: [], waitlist: [], payments: {},
      assignment: empty, results: {}, announcements: [],
    };
    setPozos([...pozos, newPz]);
    setView({ name: 'pozo', id });
  };

  const joinPozo = (pozoId, playerId = currentUser.id) => {
    setPozos(prev => prev.map(p => {
      if (p.id !== pozoId) return p;
      const reg = p.registered || [];
      const wait = p.waitlist || [];
      if (reg.includes(playerId) || wait.includes(playerId)) return p;
      if (reg.length < (p.capacity || 28)) {
        return { ...p, registered: [...reg, playerId], payments: { ...(p.payments || {}), [playerId]: 'pending' } };
      } else {
        return { ...p, waitlist: [...wait, playerId] };
      }
    }));
  };

  const leavePozo = (pozoId, playerId = currentUser.id) => {
    setPozos(prev => prev.map(p => {
      if (p.id !== pozoId) return p;
      const wasReg = p.registered?.includes(playerId);
      let reg = (p.registered || []).filter(id => id !== playerId);
      let wait = (p.waitlist || []).filter(id => id !== playerId);
      // promote first waitlist to registered if a spot opened
      if (wasReg && wait.length > 0 && reg.length < (p.capacity || 28)) {
        const promoted = wait[0]; wait = wait.slice(1); reg.push(promoted);
      }
      const payments = { ...(p.payments || {}) };
      delete payments[playerId];
      return { ...p, registered: reg, waitlist: wait, payments };
    }));
  };

  const updatePlayer = (id, data) => setPlayers(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  const addPlayer = (data) => {
    const id = 'p' + (Date.now()).toString(36);
    setPlayers([...players, { id, pts: 0, ...data }]);
  };
  const deletePlayer = (id) => setPlayers(prev => prev.filter(p => p.id !== id));

  // ── Nav
  const playerNav = [
    { id: 'home',    label: 'Inicio',   icon: '◰' },
    { id: 'ranking', label: 'Ranking',  icon: '★' },
    { id: 'profile', label: 'Perfil',   icon: '◉' },
    { id: 'history', label: 'Historial',icon: '◷' },
  ];
  const adminExtras = [
    { id: 'calendar', label: 'Calendario', icon: '▦' },
    { id: 'players',  label: 'Jugadores',  icon: '◉◉' },
    { id: 'settings', label: 'Ajustes',    icon: '⚙' },
  ];
  // Mobile bottom nav (5 max)
  const mobilePlayer = [
    { id: 'home',    label: 'Inicio',   icon: '◰' },
    { id: 'pozo-next', label: 'Pozo',   icon: '▦' },
    { id: 'ranking', label: 'Ranking',  icon: '★' },
    { id: 'profile', label: 'Perfil',   icon: '◉' },
    { id: 'more',    label: 'Más',      icon: '☰' },
  ];
  const mobileAdmin = [
    { id: 'home',    label: 'Inicio',    icon: '◰' },
    { id: 'calendar',label: 'Calendar.', icon: '▦' },
    { id: 'players', label: 'Jugadores', icon: '◉' },
    { id: 'ranking', label: 'Ranking',   icon: '★' },
    { id: 'more',    label: 'Más',       icon: '☰' },
  ];

  // ── Render screen
  const renderScreen = () => {
    if (view.name === 'pozo') {
      const pozo = pozos.find(p => p.id === view.id);
      if (!pozo) return null;
      return (
        <PozoScreen
          pozo={pozo}
          players={players}
          pairs={pairs}
          isAdmin={isAdmin}
          currentUser={currentUser}
          onUpdate={updatePozo}
          onBack={() => setView({ name: 'home' })}
          onJoin={joinPozo}
          onLeave={leavePozo}
        />
      );
    }
    if (view.name === 'pozo-next') {
      // shortcut: open the next pozo
      const today = '2026-05-26';
      const next = pozos.filter(p => p.status !== 'completed' && p.date >= today).sort((a,b) => a.date.localeCompare(b.date))[0];
      if (!next) return <CalendarScreen pozos={pozos} players={players} onOpenPozo={openPozo} onNewPozo={isAdmin ? newPozo : null} />;
      return (
        <PozoScreen
          pozo={next}
          players={players}
          pairs={pairs}
          isAdmin={isAdmin}
          currentUser={currentUser}
          onUpdate={updatePozo}
          onBack={() => setView({ name: 'home' })}
          onJoin={joinPozo}
          onLeave={leavePozo}
        />
      );
    }
    if (view.name === 'calendar') {
      return <CalendarScreen pozos={pozos} players={players} onOpenPozo={openPozo} onNewPozo={isAdmin ? newPozo : null} />;
    }
    if (view.name === 'ranking') {
      return <RankingScreen pozos={pozos} players={players} pairs={pairs} />;
    }
    if (view.name === 'players') {
      return (
        <PlayersScreen
          players={players}
          pairs={pairs}
          isAdmin={isAdmin}
          onUpdatePlayer={updatePlayer}
          onAddPlayer={addPlayer}
          onDeletePlayer={deletePlayer}
        />
      );
    }
    if (view.name === 'history') {
      return <HistoryScreen pozos={pozos} players={players} pairs={pairs} onOpenPozo={openPozo} />;
    }
    if (view.name === 'welcome') {
      return <WelcomeScreen config={config} onAddPlayer={addPlayer} onGoToHome={() => setView({ name: 'home' })} />;
    }
    if (view.name === 'profile') {
      return <ProfileScreen player={currentUser} pozos={pozos} players={players} pairs={pairs} onEditPlayer={setEditingPlayer} />;
    }
    if (view.name === 'settings') {
      return <SettingsScreen config={config} onUpdateConfig={setConfig} />;
    }
    if (view.name === 'more') {
      return <MoreScreen isAdmin={isAdmin} onNav={(name) => setView({ name })} />;
    }
    return (
      <HomeScreen
        pozos={pozos}
        players={players}
        currentUser={currentUser}
        isAdmin={isAdmin}
        onOpenPozo={openPozo}
        onJoinPozo={joinPozo}
        onLeavePozo={leavePozo}
      />
    );
  };

  const allNavItems = [...playerNav, ...(isAdmin ? adminExtras : [])];

  return (
    <div className="app">
      {/* ── Desktop sidebar ─────────────────────────────── */}
      <aside className="sidebar">
        <Logo size={26} color="#F7F4EE" accent={tweaks.accent} />

        {/* Role toggle */}
        <div className="role-toggle">
          <button className={!isAdmin ? 'active' : ''} onClick={() => setIsAdmin(false)}>Jugador</button>
          <button className={isAdmin ? 'active' : ''} onClick={() => setIsAdmin(true)}>Admin</button>
        </div>

        <nav className="nav">
          {allNavItems.map(n => (
            <button
              key={n.id}
              className={view.name === n.id ? 'active' : ''}
              onClick={() => setView({ name: n.id })}
            >
              <span style={{ width: 18, textAlign: 'center', opacity: 0.7 }}>{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>

        {/* User card */}
        <div className="side-user">
          <Avatar player={currentUser} size={36} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--paper)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser.nombre}
            </div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'rgba(247,244,238,0.5)' }}>
              {isAdmin ? '★ ADMIN' : 'JUGADOR'}
            </div>
          </div>
        </div>

        <div className="foot">
          @latribudelpadel<br />
          Temporada 2026
        </div>
      </aside>

      {/* ── Mobile top bar ─────────────────────────────── */}
      <header className="mobile-bar">
        <button className="mobile-menu" onClick={() => setMobileNavOpen(o => !o)}>☰</button>
        <Logo size={20} color="var(--paper)" accent={tweaks.accent} />
        <Avatar player={currentUser} size={32} />
      </header>

      {/* Mobile drawer */}
      {mobileNavOpen && (
        <div className="mobile-drawer-bg" onClick={() => setMobileNavOpen(false)}>
          <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <div className="role-toggle">
              <button className={!isAdmin ? 'active' : ''} onClick={() => setIsAdmin(false)}>Jugador</button>
              <button className={isAdmin ? 'active' : ''} onClick={() => setIsAdmin(true)}>Admin</button>
            </div>
            <nav className="nav">
              {allNavItems.map(n => (
                <button
                  key={n.id}
                  className={view.name === n.id ? 'active' : ''}
                  onClick={() => { setView({ name: n.id }); setMobileNavOpen(false); }}
                >
                  <span style={{ width: 18, opacity: 0.7 }}>{n.icon}</span>
                  {n.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* ── Main ───────────────────────────────────────── */}
      <main className="main">
        {renderScreen()}
      </main>

      {/* ── Mobile bottom nav ──────────────────────────── */}
      <nav className="bottom-nav">
        {(isAdmin ? mobileAdmin : mobilePlayer).map(n => (
          <button
            key={n.id}
            className={view.name === n.id || (n.id === 'pozo-next' && view.name === 'pozo') ? 'active' : ''}
            onClick={() => setView({ name: n.id })}
          >
            <span className="bn-icon">{n.icon}</span>
            <span className="bn-label">{n.label}</span>
          </button>
        ))}
      </nav>

      {/* Player edit modal */}
      {editingPlayer && (
        <PlayerEditModal
          player={editingPlayer}
          onClose={() => setEditingPlayer(null)}
          onSave={(data) => { updatePlayer(editingPlayer.id, data); setEditingPlayer(null); }}
          onDelete={null}
        />
      )}

      {/* Tweaks panel */}
      {window.TweaksPanel && (
        <TweaksPanel title="Tweaks">
          <TweakSection title="Color">
            <TweakColor
              label="Acento"
              value={tweaks.accent}
              onChange={v => setTweak('accent', v)}
              options={['#E5252A', '#FF6B35', '#1F8A5B', '#2A6FDB', '#9355C4', '#0E0E0E']}
            />
            <TweakColor
              label="Tinta"
              value={tweaks.ink}
              onChange={v => setTweak('ink', v)}
              options={['#0E0E0E', '#1B1F24', '#2E1A1A', '#0A2540']}
            />
            <TweakColor
              label="Papel"
              value={tweaks.paper}
              onChange={v => setTweak('paper', v)}
              options={['#F7F4EE', '#FFFFFF', '#F2EDE2', '#EFEFEC']}
            />
          </TweakSection>
          <TweakSection title="Tipografía">
            <TweakSlider
              label="Inclinación italic"
              value={tweaks.italicSkew}
              onChange={v => setTweak('italicSkew', v)}
              min={-16}
              max={0}
              step={1}
            />
          </TweakSection>
        </TweaksPanel>
      )}
    </div>
  );
}

// "Más" screen — for mobile drawer to expose extra nav
function MoreScreen({ isAdmin, onNav }) {
  const items = [
    { id: 'calendar', label: 'Calendario',  desc: 'Ver todos los pozos', icon: '▦' },
    { id: 'history',  label: 'Historial',   desc: 'Pozos finalizados',   icon: '◷' },
    { id: 'welcome',  label: 'Inscripción', desc: 'Únete al club',       icon: '+' },
  ];
  const adminItems = [
    { id: 'players',  label: 'Jugadores',    desc: 'Base de datos',  icon: '◉' },
    { id: 'settings', label: 'Configuración',desc: 'Precios, pack, formulario', icon: '⚙' },
  ];
  const list = isAdmin ? [...items, ...adminItems] : items;
  return (
    <div data-screen-label="Más">
      <div className="page-header">
        <div className="ttl-row">
          <span className="label">Atajos</span>
          <h1 className="display">Más</h1>
        </div>
      </div>
      <div className="more-list">
        {list.map(it => (
          <button key={it.id} className="more-item" onClick={() => onNav(it.id)}>
            <span className="more-icon">{it.icon}</span>
            <div>
              <div className="more-label">{it.label}</div>
              <div className="more-desc">{it.desc}</div>
            </div>
            <span className="more-arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
