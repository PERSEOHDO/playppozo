// LA TRYBU — Brand + shared components

// ── Logo wordmark (no copyrighted glyph copying; original take on the brand name)
function Logo({ size = 28, color = 'currentColor', accent = '#E5252A' }) {
  return (
    <div className="brand-block" style={{ gap: size * 0.32 }}>
      <PaddleIcon size={size * 1.05} color={color} accent={accent} />
      <span
        className="display"
        style={{
          fontSize: size,
          color,
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap',
        }}
      >
        LA TRYBU
      </span>
    </div>
  );
}

function PaddleIcon({ size = 28, color = '#0E0E0E', accent = '#E5252A' }) {
  // Simple paddle shape — head + handle
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: 'block' }}>
      <rect x="14" y="20" width="4" height="10" rx="1.5" fill={color} />
      <ellipse cx="16" cy="13" rx="10" ry="11" fill={color} />
      <circle cx="16" cy="13" r="3.5" fill={accent} />
      <circle cx="11" cy="9" r="0.9" fill={accent} opacity="0.5" />
      <circle cx="21" cy="9" r="0.9" fill={accent} opacity="0.5" />
      <circle cx="11" cy="17" r="0.9" fill={accent} opacity="0.5" />
      <circle cx="21" cy="17" r="0.9" fill={accent} opacity="0.5" />
    </svg>
  );
}

// ── Avatar: initials + colored bg, fallback for images
function Avatar({ player, size = 32 }) {
  if (!player) return <div className="avatar" style={{ '--size': size + 'px' }}>?</div>;
  const initials = (player.nombre || '').slice(0,1) + (player.apellido || '').slice(0,1);
  return (
    <div
      className="avatar"
      style={{
        '--size': size + 'px',
        background: player.color || '#999',
        color: '#fff',
      }}
      title={`${player.nombre} ${player.apellido}`}
    >
      {player.photo
        ? <img src={player.photo} alt={initials} />
        : initials.toUpperCase()}
    </div>
  );
}

// ── Pair tile (used in pool list and in court slots)
function PairTile({ pair, players, points, isWinner, onDragStart, onDragEnd, draggable = true, compact = false }) {
  if (!pair) {
    return (
      <div className="pair-slot empty">
        Suelta una pareja
      </div>
    );
  }
  const ps = pair.playerIds.map(id => players.find(p => p.id === id));
  return (
    <div
      className={`pair-slot filled ${isWinner ? 'winner' : ''}`}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="avs">
        {ps.map(p => <Avatar key={p.id} player={p} size={compact ? 28 : 34} />)}
      </div>
      <div className="ppl">
        <div className="name">{pair.name}</div>
        {points != null && (
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
            +{points} pts {isWinner ? '· 🏆' : ''}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Modal helper
function Modal({ children, onClose, title }) {
  React.useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="btn icon ghost" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, {
  Logo, PaddleIcon, Avatar, PairTile, Modal,
});
