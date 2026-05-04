import { useState, useEffect } from 'react';

const SECRET        = import.meta.env.VITE_APP_SECRET || 'Cabinetpl';
const MAX_ATTEMPTS  = 5;
const LOCKOUT_MS    = 15 * 60 * 1000; // 15 minutes
const STORAGE_KEY   = 'pin_lockout';

function getLockoutState() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { attempts: 0, lockedUntil: null };
    return JSON.parse(raw);
  } catch { return { attempts: 0, lockedUntil: null }; }
}

function saveLockoutState(state) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function fmtCountdown(ms) {
  const m = Math.ceil(ms / 60000);
  return `${m} minute${m > 1 ? 's' : ''}`;
}

export function PinScreen({ onUnlock }) {
  const [val, setVal]         = useState('');
  const [error, setError]     = useState('');
  const [locked, setLocked]   = useState(false);
  const [remaining, setRemaining] = useState('');
  const [attempts, setAttempts]   = useState(0);

  // Vérification état de blocage au montage et toutes les secondes
  useEffect(() => {
    const check = () => {
      const state = getLockoutState();
      if (state.lockedUntil && Date.now() < state.lockedUntil) {
        setLocked(true);
        setRemaining(fmtCountdown(state.lockedUntil - Date.now()));
        setAttempts(state.attempts);
      } else {
        if (state.lockedUntil && Date.now() >= state.lockedUntil) {
          saveLockoutState({ attempts: 0, lockedUntil: null });
        }
        setLocked(false);
        setAttempts(state.attempts);
      }
    };
    check();
    const timer = setInterval(check, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (locked) return;

    if (val === SECRET) {
      saveLockoutState({ attempts: 0, lockedUntil: null });
      sessionStorage.setItem('unlocked', '1');
      onUnlock();
    } else {
      const state  = getLockoutState();
      const newAtt = (state.attempts || 0) + 1;
      const remaining = MAX_ATTEMPTS - newAtt;

      if (newAtt >= MAX_ATTEMPTS) {
        const lockedUntil = Date.now() + LOCKOUT_MS;
        saveLockoutState({ attempts: newAtt, lockedUntil });
        setLocked(true);
        setError('');
      } else {
        saveLockoutState({ attempts: newAtt, lockedUntil: null });
        setAttempts(newAtt);
        setError(`Code incorrect — ${remaining} tentative${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}`);
        setVal('');
        setTimeout(() => setError(''), 2500);
      }
    }
  };

  return (
    <div className="user-screen">
      <div className="user-card">
        <div style={{ fontSize: 48, marginBottom: 16 }}>{locked ? '🚫' : '🔒'}</div>
        <h2>{locked ? 'Accès bloqué' : 'Accès privé'}</h2>

        {locked ? (
          <div style={{ marginTop: 16 }}>
            <p style={{ color: '#f87171', fontSize: 13, lineHeight: 1.6 }}>
              Trop de tentatives incorrectes.<br />
              Accès bloqué pendant <strong>{remaining}</strong>.
            </p>
            <p style={{ color: 'var(--text-dim)', fontSize: 11, marginTop: 12 }}>
              Contactez Johann si vous avez oublié le code.
            </p>
          </div>
        ) : (
          <>
            <p>Entrez le code d'accès pour continuer.</p>
            <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
              <input
                className="form-control"
                type="password"
                value={val}
                onChange={e => setVal(e.target.value)}
                placeholder="Code d'accès"
                autoFocus
                autoComplete="current-password"
                style={{ textAlign: 'center', fontSize: 18, letterSpacing: 4, marginBottom: 12 }}
              />
              {error && (
                <p style={{ color: '#f87171', fontSize: 12, marginBottom: 8, lineHeight: 1.4 }}>{error}</p>
              )}
              {attempts > 0 && !error && (
                <p style={{ color: '#fbbf24', fontSize: 11, marginBottom: 8 }}>
                  {MAX_ATTEMPTS - attempts} tentative{MAX_ATTEMPTS - attempts > 1 ? 's' : ''} restante{MAX_ATTEMPTS - attempts > 1 ? 's' : ''} avant blocage
                </p>
              )}
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>
                Entrer
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-icon">⚡</div>
      <div className="loading-text">Connexion en cours…</div>
      <div className="loading-bar"><div className="loading-fill" /></div>
    </div>
  );
}

const TEAM = [
  { name: 'Johann',     icon: '👨‍💼', cls: 'patron' },
  { name: 'E.Poncey',   icon: '👨‍💼', cls: 'patron' },
  { name: 'Ombeline',   icon: '👩‍💼', cls: 'assistante' },
  { name: 'Julie',      icon: '👩‍💼', cls: 'assistante' },
  { name: 'Priscillia', icon: '👩‍💼', cls: 'assistante' },
  { name: 'Amélie',     icon: '👩‍💼', cls: 'assistante' },
  { name: 'Justine',    icon: '👩‍💼', cls: 'assistante' },
  { name: 'Wiam',       icon: '👩‍💼', cls: 'assistante' },
  { name: 'Wendy',      icon: '👩‍💼', cls: 'assistante' },
];

export function UserNameScreen({ onSelect }) {
  return (
    <div className="user-screen">
      <div className="user-card" style={{ maxWidth: 520 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
        <h2>Qui êtes-vous ?</h2>
        <p>Choisissez votre profil pour accéder à l'espace.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
          {TEAM.map(u => (
            <button key={u.name} className={`user-btn ${u.cls}`} onClick={() => onSelect(u.name)}>
              {u.icon} {u.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ConfigScreen() {
  return (
    <div className="user-screen">
      <div className="user-card">
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚙️</div>
        <h2>Configuration Firebase requise</h2>
        <p style={{ textAlign: 'left', fontSize: 13, lineHeight: 1.7 }}>
          <strong>1.</strong> Créez un projet sur <a href="https://console.firebase.google.com" target="_blank" rel="noopener" style={{color:'#ff6b35'}}>console.firebase.google.com</a><br/>
          <strong>2.</strong> Ajoutez une app Web → copiez la config<br/>
          <strong>3.</strong> Activez <em>Firestore Database</em> (mode test)<br/>
          <strong>4.</strong> Activez <em>Authentication → Anonymous</em><br/>
          <strong>5.</strong> Sur Netlify → <em>Site settings → Environment variables</em>, ajoutez :
        </p>
        <pre style={{ background: '#0d0f1a', padding: 12, borderRadius: 8, fontSize: 11, textAlign: 'left', overflow: 'auto', marginTop: 12 }}>
{`VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_APP_SECRET=VotreNouveauCode`}
        </pre>
      </div>
    </div>
  );
}
