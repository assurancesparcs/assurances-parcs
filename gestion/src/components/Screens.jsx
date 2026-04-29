import { useState } from 'react';

const SECRET = 'Cabinetpl';

export function PinScreen({ onUnlock }) {
  const [val, setVal] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (val === SECRET) {
      sessionStorage.setItem('unlocked', '1');
      onUnlock();
    } else {
      setError(true);
      setVal('');
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div className="user-screen">
      <div className="user-card">
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h2>Accès privé</h2>
        <p>Entrez le code d'accès pour continuer.</p>
        <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
          <input
            className="form-control"
            type="password"
            value={val}
            onChange={e => setVal(e.target.value)}
            placeholder="Code d'accès"
            autoFocus
            style={{ textAlign: 'center', fontSize: 18, letterSpacing: 4, marginBottom: 12 }}
          />
          {error && <p style={{ color: '#f87171', fontSize: 13, marginBottom: 8 }}>Code incorrect</p>}
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>
            Entrer
          </button>
        </form>
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

export function UserNameScreen({ onSelect }) {
  return (
    <div className="user-screen">
      <div className="user-card">
        <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
        <h2>Qui êtes-vous ?</h2>
        <p>Choisissez votre profil pour synchroniser vos données.</p>
        <div className="user-btns">
          <button className="user-btn patron" onClick={() => onSelect('Johann')}>👨‍💼 Johann</button>
          <button className="user-btn assistante" onClick={() => onSelect('Collaboratrice')}>👩‍💼 Collaboratrice</button>
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
VITE_FIREBASE_APP_ID=...`}
        </pre>
      </div>
    </div>
  );
}
