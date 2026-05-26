// LA TRYBU — Admin settings: club config (fee, capacity, welcome pack, signup fields)

function SettingsScreen({ config, onUpdateConfig }) {
  const [c, setC] = React.useState(config);

  React.useEffect(() => { setC(config); }, [config]);

  const save = () => onUpdateConfig(c);

  // Welcome pack management
  const addPackItem = () => {
    const id = 'w' + Date.now();
    const n = String((c.welcomePack?.length || 0) + 1).padStart(2, '0');
    setC({ ...c, welcomePack: [...(c.welcomePack || []), { id, n, t: 'Nuevo item', d: '' }] });
  };
  const updatePackItem = (id, patch) => {
    setC({ ...c, welcomePack: c.welcomePack.map(it => it.id === id ? { ...it, ...patch } : it) });
  };
  const removePackItem = (id) => {
    setC({ ...c, welcomePack: c.welcomePack.filter(it => it.id !== id) });
  };

  // Signup field toggles
  const toggleField = (id, key, val) => {
    setC({ ...c, signupFields: c.signupFields.map(f => f.id === id ? { ...f, [key]: val } : f) });
  };
  const addField = () => {
    const id = 'f' + Date.now();
    setC({ ...c, signupFields: [...c.signupFields, { id, label: 'Nuevo campo', required: false, type: 'text', enabled: true }] });
  };
  const removeField = (id) => {
    setC({ ...c, signupFields: c.signupFields.filter(f => f.id !== id) });
  };

  return (
    <div data-screen-label="Ajustes">
      <div className="page-header">
        <div className="ttl-row">
          <span className="label">Solo administrador</span>
          <h1 className="display">Configuración</h1>
          <div className="sub">Define precios por defecto, pack de bienvenida y los campos del formulario de inscripción.</div>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={save}>Guardar cambios</button>
        </div>
      </div>

      {/* General */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 className="display" style={{ fontSize: 28, margin: '0 0 16px' }}>General</h3>
        <div className="settings-grid">
          <div className="field">
            <label>Precio por defecto (€)</label>
            <input type="number" value={c.defaultFee} onChange={e => setC({ ...c, defaultFee: parseInt(e.target.value) || 0 })} />
          </div>
          <div className="field">
            <label>Capacidad por pozo</label>
            <input type="number" value={c.defaultCapacity} onChange={e => setC({ ...c, defaultCapacity: parseInt(e.target.value) || 28 })} />
          </div>
          <div className="field">
            <label>Cuota de inscripción al club (€)</label>
            <input type="number" value={c.membershipFee} onChange={e => setC({ ...c, membershipFee: parseInt(e.target.value) || 0 })} />
          </div>
        </div>
      </div>

      {/* Court points (read-only, fixed by user spec) */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 className="display" style={{ fontSize: 28, margin: '0 0 6px' }}>Puntos por pista</h3>
        <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.14em', marginBottom: 14 }}>
          PISTA REINA = 200 PTS · ESCALA DESCENDENTE
        </div>
        <div className="court-pts-grid">
          {window.COURT_NAMES.map((n, i) => (
            <div key={i} className="cpt-row">
              <div className={`cpt-num ${i === 0 ? 'reina' : ''}`}>{i+1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{n}</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{i === 0 ? 'PISTA REINA' : `PISTA ${i+1}`}</div>
              </div>
              <div className="display" style={{ fontSize: 28, color: i === 0 ? 'var(--accent)' : 'var(--ink)' }}>
                +{window.COURT_POINTS[i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Welcome pack */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div className="section-head" style={{ marginBottom: 14 }}>
          <h3 className="display" style={{ fontSize: 28, margin: 0 }}>Pack de bienvenida</h3>
          <button className="btn ghost sm" onClick={addPackItem}>＋ Añadir item</button>
        </div>
        <div className="pack-edit-grid">
          {(c.welcomePack || []).map((it, idx) => (
            <div key={it.id} className="pack-edit-item">
              <div className="pack-edit-num">{String(idx+1).padStart(2,'0')}</div>
              <div className="pack-edit-fields">
                <input
                  className="pack-edit-title"
                  value={it.t}
                  onChange={e => updatePackItem(it.id, { t: e.target.value })}
                  placeholder="Nombre del item"
                />
                <input
                  className="pack-edit-desc"
                  value={it.d}
                  onChange={e => updatePackItem(it.id, { d: e.target.value })}
                  placeholder="Descripción"
                />
              </div>
              <button className="kebab" onClick={() => removePackItem(it.id)}>×</button>
            </div>
          ))}
          {(!c.welcomePack || c.welcomePack.length === 0) && (
            <div className="empty" style={{ padding: 20 }}>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em' }}>SIN ITEMS</div>
            </div>
          )}
        </div>
      </div>

      {/* Signup fields */}
      <div className="card" style={{ padding: 20 }}>
        <div className="section-head" style={{ marginBottom: 14 }}>
          <h3 className="display" style={{ fontSize: 28, margin: 0 }}>Formulario de inscripción</h3>
          <button className="btn ghost sm" onClick={addField}>＋ Añadir campo</button>
        </div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.14em', marginBottom: 14 }}>
          Activa/desactiva campos. Los campos obligatorios se marcan con ★.
        </div>
        <div className="field-edit-list">
          {c.signupFields.map(f => (
            <div key={f.id} className={`field-edit-row ${!f.enabled ? 'disabled' : ''}`}>
              <button
                className={`toggle ${f.enabled ? 'on' : 'off'}`}
                onClick={() => toggleField(f.id, 'enabled', !f.enabled)}
              >
                <span className="toggle-knob"></span>
              </button>
              <input
                className="field-edit-label"
                value={f.label}
                onChange={e => toggleField(f.id, 'label', e.target.value)}
              />
              <select value={f.type} onChange={e => toggleField(f.id, 'type', e.target.value)}>
                <option value="text">Texto</option>
                <option value="email">Email</option>
                <option value="tel">Teléfono</option>
                <option value="number">Número</option>
                <option value="select">Opciones</option>
              </select>
              <label className="req-toggle">
                <input
                  type="checkbox"
                  checked={f.required}
                  onChange={e => toggleField(f.id, 'required', e.target.checked)}
                />
                <span>Obligatorio</span>
              </label>
              {!['nombre','apellido'].includes(f.id) && (
                <button className="kebab" onClick={() => removeField(f.id)}>×</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.SettingsScreen = SettingsScreen;
