(function () {
  const STORAGE_KEY = 'assuraudio_chat';

  const style = document.createElement('style');
  style.textContent = `
    #aa-chat-btn {
      position: fixed; bottom: 90px; right: 28px; z-index: 9998;
      width: 52px; height: 52px; border-radius: 50%;
      background: linear-gradient(135deg, #1a73e8, #00897b);
      border: none; cursor: pointer;
      box-shadow: 0 4px 20px rgba(26,115,232,0.4);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.4rem; transition: transform .2s, box-shadow .2s;
    }
    #aa-chat-btn:hover { transform: scale(1.1); box-shadow: 0 8px 28px rgba(26,115,232,0.5); }
    #aa-chat-box {
      position: fixed; bottom: 156px; right: 28px; z-index: 9999;
      width: 340px; max-height: 480px;
      background: #fff; border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,0.18);
      display: none; flex-direction: column; overflow: hidden;
      font-family: 'Inter', sans-serif;
    }
    #aa-chat-box.open { display: flex; }
    #aa-chat-header {
      background: linear-gradient(135deg, #1a73e8, #00897b);
      color: #fff; padding: 14px 16px;
      display: flex; align-items: center; justify-content: space-between;
    }
    #aa-chat-header .aa-title { font-weight: 700; font-size: 0.9rem; }
    #aa-chat-header .aa-sub { font-size: 0.75rem; opacity: 0.8; }
    #aa-chat-close {
      background: none; border: none; color: #fff;
      font-size: 1.2rem; cursor: pointer; padding: 0 4px;
    }
    #aa-chat-messages {
      flex: 1; overflow-y: auto; padding: 14px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .aa-msg {
      max-width: 85%; padding: 9px 13px; border-radius: 12px;
      font-size: 0.85rem; line-height: 1.5;
    }
    .aa-msg.bot {
      background: #f0f4ff; color: #1a1a2e; align-self: flex-start;
      border-bottom-left-radius: 4px;
    }
    .aa-msg.user {
      background: linear-gradient(135deg, #1a73e8, #00897b);
      color: #fff; align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .aa-msg.typing { color: #888; font-style: italic; }
    #aa-chat-input-wrap {
      padding: 10px 12px; border-top: 1px solid #eee;
      display: flex; gap: 8px;
    }
    #aa-chat-input {
      flex: 1; border: 1.5px solid #dde3ec; border-radius: 8px;
      padding: 8px 12px; font-size: 0.85rem; font-family: inherit;
      outline: none; transition: border-color .2s;
    }
    #aa-chat-input:focus { border-color: #1a73e8; }
    #aa-chat-send {
      background: linear-gradient(135deg, #1a73e8, #00897b);
      color: #fff; border: none; border-radius: 8px;
      padding: 8px 14px; cursor: pointer; font-size: 0.85rem;
      font-weight: 600; transition: opacity .2s;
    }
    #aa-chat-send:disabled { opacity: 0.5; cursor: not-allowed; }
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.id = 'aa-chat-btn';
  btn.title = 'Assistant AssurAudio';
  btn.innerHTML = '💬';

  const box = document.createElement('div');
  box.id = 'aa-chat-box';
  box.innerHTML = `
    <div id="aa-chat-header">
      <div>
        <div class="aa-title">Assistant AssurAudio</div>
        <div class="aa-sub">Répond en quelques secondes</div>
      </div>
      <button id="aa-chat-close">✕</button>
    </div>
    <div id="aa-chat-messages"></div>
    <div id="aa-chat-input-wrap">
      <input id="aa-chat-input" type="text" placeholder="Votre question…" maxlength="400" />
      <button id="aa-chat-send">Envoyer</button>
    </div>
  `;

  document.body.appendChild(btn);
  document.body.appendChild(box);

  const messagesEl = document.getElementById('aa-chat-messages');
  const input = document.getElementById('aa-chat-input');
  const sendBtn = document.getElementById('aa-chat-send');

  let history = [];

  function loadHistory() {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) history = JSON.parse(saved);
    } catch (_) {}
  }

  function saveHistory() {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history)); } catch (_) {}
  }

  function addMessage(text, role) {
    const el = document.createElement('div');
    el.className = `aa-msg ${role}`;
    el.textContent = text;
    messagesEl.appendChild(el);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return el;
  }

  function renderHistory() {
    messagesEl.innerHTML = '';
    history.forEach(m => addMessage(m.content, m.role === 'assistant' ? 'bot' : 'user'));
  }

  function showWelcome() {
    if (history.length === 0) {
      addMessage('Bonjour ! Je suis l\'assistant AssurAudio. Je peux vous aider sur vos besoins en mutuelle santé, prévoyance, multirisque ou assurance emprunteur. Comment puis-je vous aider ?', 'bot');
    }
  }

  btn.addEventListener('click', () => {
    box.classList.toggle('open');
    if (box.classList.contains('open')) {
      loadHistory();
      renderHistory();
      showWelcome();
      input.focus();
    }
  });

  document.getElementById('aa-chat-close').addEventListener('click', () => {
    box.classList.remove('open');
  });

  async function send() {
    const text = input.value.trim();
    if (!text || sendBtn.disabled) return;

    input.value = '';
    sendBtn.disabled = true;
    addMessage(text, 'user');
    history.push({ role: 'user', content: text });

    const typing = addMessage('…', 'bot typing');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });
      const data = await res.json();
      typing.remove();
      const reply = data.reply || 'Désolé, une erreur est survenue. Contactez-nous à assuraudio@gmail.com';
      addMessage(reply, 'bot');
      history.push({ role: 'assistant', content: reply });
      saveHistory();
    } catch (_) {
      typing.remove();
      addMessage('Désolé, je ne suis pas disponible pour l\'instant. Écrivez-nous à assuraudio@gmail.com', 'bot');
    }

    sendBtn.disabled = false;
    input.focus();
  }

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
})();
