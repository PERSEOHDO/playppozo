// LA TRYBU — Players CRUD with photo upload

function PlayersScreen({ players, pairs, onUpdatePlayer, onAddPlayer, onDeletePlayer }) {
  const [editing, setEditing] = React.useState(null); // player or 'new'
  const [search, setSearch] = React.useState('');

  const filtered = players.filter(p =>
    (p.nombre + ' ' + p.apellido).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div data-screen-label="Jugadores">
      <div className="page-header">
        <div className="ttl-row">
          <span className="label">{players.length} jugadores · {pairs.length} parejas fijas</span>
          <h1 className="display">Jugadores</h1>
          <div className="sub">Base de datos del club. Edita nombre, foto, nivel y la pareja fija.</div>
        </div>
        <div className="actions">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              background: '#fff', border: '1px solid var(--line)',
              borderRadius: 999, padding: '10px 16px', fontSize: 13, width: 200,
            }}
          />
          <button className="btn primary" onClick={() => setEditing('new')}>＋ Nuevo jugador</button>
        </div>
      </div>

      <div className="players-grid">
        {filtered.map(p => {
          const pair = pairs.find(pa => pa.playerIds.includes(p.id));
          return (
            <div key={p.id} className="player-card" onClick={() => setEditing(p)}>
              <Avatar player={p} size={64} />
              <div className="name">{p.nombre}</div>
              <div className="surname">{p.apellido}</div>
              {pair && (
                <div className="tag" style={{ marginTop: 2 }}>
                  ◆ {pair.name}
                </div>
              )}
              <div className="stat">
                <div className="col">
                  <div className="v">{p.nivel}</div>
                  <div className="k">Nivel</div>
                </div>
                <div className="col">
                  <div className="v">{p.pts}</div>
                  <div className="k">Pts</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <PlayerEditModal
          player={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSave={(data) => {
            if (editing === 'new') onAddPlayer(data);
            else onUpdatePlayer(editing.id, data);
            setEditing(null);
          }}
          onDelete={editing !== 'new' ? () => { onDeletePlayer(editing.id); setEditing(null); } : null}
        />
      )}
    </div>
  );
}

function PlayerEditModal({ player, onClose, onSave, onDelete }) {
  const [form, setForm] = React.useState({
    nombre: player?.nombre || '',
    apellido: player?.apellido || '',
    nivel: player?.nivel || 2.0,
    photo: player?.photo || '',
    color: player?.color || '#E5252A',
  });

  const palette = ['#E5252A', '#0E0E0E', '#1F8A5B', '#2A6FDB', '#9355C4', '#D97757', '#B81E22'];

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, photo: reader.result });
    reader.readAsDataURL(file);
  };

  return (
    <Modal title={player ? 'Editar jugador' : 'Nuevo jugador'} onClose={onClose}>
      <div className="modal-body">
        <div className="flex gap-16" style={{ alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Avatar
              player={{ ...form, id: '_preview' }}
              size={88}
            />
            <label
              style={{
                position: 'absolute', bottom: -2, right: -2,
                background: 'var(--ink)', color: 'var(--paper)',
                width: 32, height: 32, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', border: '2px solid var(--paper)',
                fontSize: 14,
              }}
            >
              📷
              <input type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
            </label>
          </div>
          <div style={{ flex: 1 }}>
            <div className="label" style={{ marginBottom: 6 }}>Color de tarjeta</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {palette.map(c => (
                <button
                  key={c}
                  onClick={() => setForm({ ...form, color: c })}
                  style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: c, cursor: 'pointer',
                    border: form.color === c ? '2px solid var(--ink)' : '2px solid transparent',
                    boxShadow: form.color === c ? '0 0 0 2px var(--paper)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="row2">
          <div className="field">
            <label>Nombre</label>
            <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
          </div>
          <div className="field">
            <label>Apellido</label>
            <input value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} />
          </div>
        </div>
        <div className="field">
          <label>Nivel de juego (0–5)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={form.nivel}
            onChange={e => setForm({ ...form, nivel: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
      <div className="modal-foot">
        {onDelete && <button className="btn danger" onClick={onDelete}>Eliminar</button>}
        <button className="btn ghost" onClick={onClose}>Cancelar</button>
        <button
          className="btn primary"
          onClick={() => onSave(form)}
          disabled={!form.nombre}
        >
          Guardar
        </button>
      </div>
    </Modal>
  );
}

window.PlayersScreen = PlayersScreen;
window.PlayerEditModal = PlayerEditModal;
