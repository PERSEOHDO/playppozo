// LA TRYBU — Inscription / signup with configurable fields and pack

function WelcomeScreen({ config, onAddPlayer, onGoToHome }) {
  const fields = (config.signupFields || []).filter(f => f.enabled);

  const [form, setForm] = React.useState(() => {
    const init = {};
    fields.forEach(f => init[f.id] = f.type === 'number' ? '' : '');
    init.acceptTerms = false;
    return init;
  });
  const [submitted, setSubmitted] = React.useState(false);

  const setField = (id, val) => setForm(prev => ({ ...prev, [id]: val }));

  const isValid = () => {
    if (!form.acceptTerms) return false;
    return fields.every(f => !f.required || (form[f.id] != null && String(form[f.id]).trim()));
  };

  const submit = () => {
    onAddPlayer({
      nombre: form.nombre || '',
      apellido: form.apellido || '',
      nivel: parseFloat(form.nivel) || 1.5,
      color: '#E5252A',
      pts: 0,
      joined: new Date().toISOString().slice(0,10),
      meta: form,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div data-screen-label="Bienvenida" style={{ maxWidth: 720, margin: '20px auto' }}>
        <div className="welcome" style={{ textAlign: 'center' }}>
          <div className="display" style={{ fontSize: 72, color: 'var(--accent)' }}>¡BIENVENIDO!</div>
          <p className="lead" style={{ margin: '0 auto 18px' }}>
            {form.nombre} ya forma parte de La Trybu. Tu pack de bienvenida está reservado.
          </p>
          {config.welcomePack?.length > 0 && (
            <div className="pack-grid">
              {config.welcomePack.map(it => (
                <div key={it.id} className="pack-item">
                  <span className="n">{it.n}</span>
                  <div className="t">{it.t}</div>
                  <div className="d">{it.d}</div>
                </div>
              ))}
            </div>
          )}
          <button className="btn primary" style={{ marginTop: 24 }} onClick={onGoToHome}>
            Ir al inicio →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div data-screen-label="Bienvenida">
      <div className="page-header">
        <div className="ttl-row">
          <span className="label">Únete al club</span>
          <h1 className="display">Inscripción</h1>
          <div className="sub">Regístrate como jugador. Tras la inscripción recibirás el pack y podrás apuntarte a los pozos.</div>
        </div>
      </div>

      <div className="welcome-grid">
        {(config.welcomePack?.length > 0 || config.membershipFee > 0) && (
          <div className="welcome">
            {config.welcomePack?.length > 0 && (
              <>
                <span className="label" style={{ color: 'rgba(247,244,238,0.6)' }}>Incluye</span>
                <h2>El pack</h2>
                <p className="lead">Tu kit de bienvenida al club.</p>
                <div className="pack-grid">
                  {config.welcomePack.map(it => (
                    <div key={it.id} className="pack-item">
                      <span className="n">{it.n}</span>
                      <div className="t">{it.t}</div>
                      <div className="d">{it.d}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {config.membershipFee > 0 && (
              <div style={{ marginTop: 22, position: 'relative', zIndex: 1, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="mono" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'rgba(247,244,238,0.45)', textTransform: 'uppercase', marginBottom: 6 }}>
                  Cuota de inscripción
                </div>
                <div className="display" style={{ fontSize: 56, color: 'var(--accent)' }}>{config.membershipFee}€</div>
                <div style={{ color: 'rgba(247,244,238,0.6)', fontSize: 13 }}>Pago único · cada pozo se paga por separado</div>
              </div>
            )}
          </div>
        )}

        <div className="card" style={{ padding: 24 }}>
          <h3 className="display" style={{ fontSize: 30, margin: '0 0 18px' }}>Tus datos</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {fields.map(f => (
              <div key={f.id} className="field">
                <label>{f.label} {f.required && <span style={{ color: 'var(--accent)' }}>*</span>}</label>
                {f.type === 'select' ? (
                  <select value={form[f.id] || ''} onChange={e => setField(f.id, e.target.value)}>
                    <option value="">Selecciona...</option>
                    {(f.options || []).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    type={f.type}
                    value={form[f.id] || ''}
                    onChange={e => setField(f.id, e.target.value)}
                  />
                )}
              </div>
            ))}
            <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: 'var(--muted)' }}>
              <input
                type="checkbox"
                checked={form.acceptTerms || false}
                onChange={e => setField('acceptTerms', e.target.checked)}
                style={{ marginTop: 3 }}
              />
              <span>Acepto las normas del club y autorizo el tratamiento de mis datos.</span>
            </label>
            <button
              className="btn primary"
              disabled={!isValid()}
              style={{ justifyContent: 'center', padding: '14px 18px' }}
              onClick={submit}
            >
              Confirmar inscripción {config.membershipFee > 0 ? `· ${config.membershipFee}€` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.WelcomeScreen = WelcomeScreen;
