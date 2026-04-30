'use strict';

/* ===== FORMULAIRE DE CONTACT (Formspree) ===== */
const form = document.getElementById('contact-form');

if (form) {
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.textContent = 'Envoi en cours…';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        document.getElementById('form-wrap').style.display = 'none';
        document.getElementById('success').style.display = 'block';
      } else {
        btn.disabled = false;
        btn.textContent = '🚀 Envoyer ma demande';
        alert('Une erreur est survenue. Veuillez réessayer ou nous appeler directement.');
      }
    } catch {
      btn.disabled = false;
      btn.textContent = '🚀 Envoyer ma demande';
      alert('Connexion impossible. Veuillez réessayer.');
    }
  });
}

/* ===== POP-UP INTENTION DE SORTIE ===== */
let exitShown = false;

document.addEventListener('mouseleave', function (e) {
  if (e.clientY <= 5 && !exitShown) {
    exitShown = true;
    document.getElementById('exit-overlay').classList.add('show');
  }
});

function closeExit() {
  document.getElementById('exit-overlay').classList.remove('show');
}

function submitExit() {
  const emailInput = document.getElementById('exit-email');
  const email = emailInput.value.trim();

  if (!email || !email.includes('@')) {
    emailInput.style.border = '1px solid #ff6b35';
    emailInput.focus();
    return;
  }

  /* Envoi optionnel à Formspree pour les leads exit-intent */
  fetch('https://formspree.io/f/xpwzgkqv', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, source: 'exit-intent', _subject: 'Audit gratuit demandé' }),
  }).catch(() => {});

  document.getElementById('exit-content').style.display = 'none';
  document.getElementById('exit-thanks').style.display = 'block';
  setTimeout(closeExit, 2500);
}

/* Fermer en cliquant sur l'overlay */
document.getElementById('exit-overlay').addEventListener('click', function (e) {
  if (e.target === this) closeExit();
});

/* Fermer avec Échap */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeExit();
});
