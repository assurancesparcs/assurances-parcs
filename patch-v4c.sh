#!/bin/bash
# Patch v4c — chatbot frontend + proxy serverless Anthropic
set -e
echo "Application du patch v4c..."
mkdir -p api templates

echo "  templates/chatbot.html"
cat > 'templates/chatbot.html' << 'PATCH_EOF_TEMPLATES_CHATBOT_HTML'
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Assistant {{fullName}}</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Helvetica Neue', Arial, sans-serif; background: transparent; }
#chat-btn { position: fixed; bottom: 28px; right: 28px; width: 60px; height: 60px; background: linear-gradient(135deg, #0d1b4b, #2d6a3f); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 20px rgba(13,27,75,0.35); z-index: 9999; transition: transform 0.2s; border: none; }
#chat-btn:hover { transform: scale(1.07); }
#chat-btn .icon-close { display: none; }
#chat-notif { position: fixed; bottom: 76px; right: 28px; background: #0d1b4b; color: white; font-size: 12px; padding: 7px 14px; border-radius: 20px; white-space: nowrap; z-index: 9998; box-shadow: 0 2px 10px rgba(0,0,0,0.2); }
#chat-window { position: fixed; bottom: 100px; right: 28px; width: 360px; max-height: 540px; background: #fff; border-radius: 16px; box-shadow: 0 8px 40px rgba(13,27,75,0.2); display: flex; flex-direction: column; z-index: 9998; overflow: hidden; opacity: 0; pointer-events: none; transform: translateY(16px) scale(0.97); transition: opacity 0.25s, transform 0.25s; }
#chat-window.open { opacity: 1; pointer-events: all; transform: translateY(0) scale(1); }
@media(max-width: 420px) { #chat-window { width: calc(100vw - 32px); right: 16px; bottom: 88px; } #chat-btn { right: 16px; bottom: 16px; } #chat-notif { right: 16px; bottom: 64px; } }
.chat-header { background: linear-gradient(135deg, #0d1b4b, #162e1a); padding: 16px 18px; display: flex; align-items: center; gap: 12px; }
.chat-avatar { width: 38px; height: 38px; background: rgba(106,191,123,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.chat-header-text h3 { font-size: 14px; font-weight: 600; color: #e0f0e8; }
.chat-header-text p { font-size: 11px; color: #7aaa8a; margin-top: 1px; }
.online-dot { width: 8px; height: 8px; background: #6abf7b; border-radius: 50%; margin-left: auto; box-shadow: 0 0 0 2px rgba(106,191,123,0.3); }
.btn-min { background: transparent; border: none; cursor: pointer; color: #7aaa8a; padding: 4px; }
#chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; background: #f8f9fb; }
#chat-messages::-webkit-scrollbar { width: 4px; }
#chat-messages::-webkit-scrollbar-thumb { background: #d0d8e0; border-radius: 4px; }
.msg { display: flex; align-items: flex-end; gap: 8px; max-width: 90%; }
.msg.bot { align-self: flex-start; }
.msg.user { align-self: flex-end; flex-direction: row-reverse; }
.msg-avatar { width: 28px; height: 28px; background: linear-gradient(135deg, #0d1b4b, #2d6a3f); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.msg-bubble { padding: 10px 14px; border-radius: 14px; font-size: 13px; line-height: 1.55; }
.msg.bot .msg-bubble { background: #fff; color: #1a2e0a; border-bottom-left-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.07); }
.msg.user .msg-bubble { background: #0d1b4b; color: #e0eaf8; border-bottom-right-radius: 4px; }
.msg-bubble a { color: #2d6a3f; text-decoration: underline; }
.quick-btns { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 16px 4px; background: #f8f9fb; }
.quick-btn { background: #fff; border: 1px solid #d0d8e0; border-radius: 20px; padding: 6px 12px; font-size: 12px; color: #0d1b4b; cursor: pointer; font-family: inherit; white-space: nowrap; }
.quick-btn:hover { background: #eaf3de; border-color: #2d6a3f; color: #2d6a3f; }
.typing-indicator { display: flex; align-items: center; gap: 4px; padding: 10px 14px; background: #fff; border-radius: 14px; border-bottom-left-radius: 4px; box-shadow: 0 1px 4px rgba(0,0,0,0.07); width: fit-content; }
.typing-dot { width: 6px; height: 6px; background: #9ab0c8; border-radius: 50%; animation: typingAnim 1.2s infinite; }
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes typingAnim { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-5px); opacity: 1; } }
.chat-input-bar { padding: 12px 14px; border-top: 1px solid #e8f0e0; display: flex; gap: 8px; background: #fff; }
#chat-input { flex: 1; border: 1px solid #d0d8e0; border-radius: 22px; padding: 9px 16px; font-size: 13px; font-family: inherit; color: #1a2e0a; outline: none; }
#chat-input:focus { border-color: #0d1b4b; }
#send-btn { width: 38px; height: 38px; background: #0d1b4b; border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; }
#send-btn:hover { background: #162770; }
#send-btn:disabled { background: #c0c8d8; cursor: not-allowed; }
.chat-footer-note { text-align: center; font-size: 10px; color: #b0b8c8; padding: 6px 14px 10px; background: #fff; }
</style>
</head>
<body>
<div id="chat-notif">Un conseiller {{brand}} est disponible</div>
<button id="chat-btn" onclick="toggleChat()" aria-label="Ouvrir le chat">
  <svg class="icon-open" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  <svg class="icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
</button>
<div id="chat-window">
  <div class="chat-header">
    <div class="chat-avatar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6abf7b" stroke-width="1.8" stroke-linecap="round"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z"/></svg></div>
    <div class="chat-header-text"><h3>Assistant {{brand}}</h3><p>Assurance chasse — {{name}} ({{code}})</p></div>
    <div class="online-dot"></div>
    <button class="btn-min" onclick="toggleChat()" title="Réduire"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
  </div>
  <div id="chat-messages"></div>
  <div class="quick-btns" id="quick-btns">
    <button class="quick-btn" onclick="quickSend('Que couvre ma RC chasse et quelles sont ses limites ?')">Limites RC chasse</button>
    <button class="quick-btn" onclick="quickSend('Mon chien est blessé, suis-je couvert ?')">Chien blessé</button>
    <button class="quick-btn" onclick="quickSend('Que se passe-t-il si je me blesse en chassant ?')">Je me blesse</button>
    <button class="quick-btn" onclick="quickSend('Quel est le tarif des options ADCE ?')">Tarifs</button>
    <button class="quick-btn" onclick="quickSend('Comment souscrire en ligne ?')">Souscrire</button>
  </div>
  <div class="chat-input-bar">
    <input id="chat-input" type="text" placeholder="Posez votre question…" onkeydown="if(event.key==='Enter')sendMsg()">
    <button id="send-btn" onclick="sendMsg()"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
  </div>
  <div class="chat-footer-note">Informations non contractuelles · {{fullName}} · {{phone}} · ORIAS {{orias}}</div>
</div>
<script>
var isOpen = false;
var history = [];
var notifHidden = false;
function toggleChat() {
  isOpen = !isOpen;
  document.getElementById('chat-window').classList.toggle('open', isOpen);
  var btn = document.getElementById('chat-btn');
  btn.querySelector('.icon-open').style.display = isOpen ? 'none' : 'block';
  btn.querySelector('.icon-close').style.display = isOpen ? 'block' : 'none';
  if (!notifHidden) { document.getElementById('chat-notif').style.display = 'none'; notifHidden = true; }
  if (isOpen && history.length === 0) {
    setTimeout(function() {
      addBotMsg("Bonjour ! Je suis l'assistant du {{fullName}}. Je peux vous renseigner sur nos options d'assurance chasse, les tarifs, la souscription ou les démarches en cas de sinistre.\n\n⚠️ Les informations fournies ici sont à titre indicatif et n'ont pas de valeur contractuelle. Pour toute confirmation définitive, seul le {{fullName}} fait foi.\n\nComment puis-je vous aider ?");
    }, 300);
  }
  if (isOpen) document.getElementById('chat-input').focus();
}
function addBotMsg(text) {
  var msgs = document.getElementById('chat-messages');
  var div = document.createElement('div'); div.className = 'msg bot';
  div.innerHTML = '<div class="msg-avatar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6abf7b" stroke-width="2" stroke-linecap="round"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z"/></svg></div><div class="msg-bubble">' + text.replace(/\n/g, '<br>') + '</div>';
  msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight;
}
function addUserMsg(text) {
  var msgs = document.getElementById('chat-messages');
  var div = document.createElement('div'); div.className = 'msg user';
  div.innerHTML = '<div class="msg-bubble">' + text + '</div>';
  msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight;
}
function showTyping() {
  var msgs = document.getElementById('chat-messages');
  var div = document.createElement('div'); div.className = 'msg bot'; div.id = 'typing';
  div.innerHTML = '<div class="msg-avatar"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6abf7b" stroke-width="2" stroke-linecap="round"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z"/></svg></div><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
  msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight;
}
function removeTyping() { var t = document.getElementById('typing'); if (t) t.remove(); }
function quickSend(text) {
  document.getElementById('quick-btns').style.display = 'none';
  document.getElementById('chat-input').value = text;
  sendMsg();
}
async function sendMsg() {
  var input = document.getElementById('chat-input');
  var text = input.value.trim();
  if (!text) return;
  input.value = '';
  document.getElementById('send-btn').disabled = true;
  document.getElementById('quick-btns').style.display = 'none';
  addUserMsg(text);
  history.push({ role: 'user', content: text });
  showTyping();
  try {
    var response = await fetch('/api/chatbot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ department: '{{slug}}', messages: history }) });
    var data = await response.json();
    var reply = data.reply || "Je n'ai pas pu traiter votre question. Appelez-nous au {{phone}}.";
    history.push({ role: 'assistant', content: reply });
    removeTyping();
    addBotMsg(reply);
  } catch(e) {
    removeTyping();
    addBotMsg("Une erreur s'est produite. Contactez-nous au <strong>{{phone}}</strong> ou par email à <strong>{{emailGeneral}}</strong>.");
  }
  document.getElementById('send-btn').disabled = false;
  document.getElementById('chat-input').focus();
}
setTimeout(function() {
  var n = document.getElementById('chat-notif');
  if (n && !notifHidden) { n.style.opacity = '0'; n.style.transition = 'opacity 0.5s'; setTimeout(function(){ n.style.display = 'none'; }, 500); }
}, 5000);
</script>
</body>
</html>
PATCH_EOF_TEMPLATES_CHATBOT_HTML

echo "  api/chatbot.js"
cat > 'api/chatbot.js' << 'PATCH_EOF_API_CHATBOT_JS'
const SYSTEM_PROMPT_TEMPLATE = `Tu es l'assistant virtuel du Cabinet ADCE, spécialiste en assurance chasse en {{NAME}} ({{CODE}}).
Tu réponds de façon professionnelle, concise et précise aux questions des chasseurs.
Tu as un rôle pédagogique : tu expliques les limites de la RC chasse et tu valorises les options ADCE qui comblent ces lacunes, sans jamais être agressif commercialement.

INFORMATIONS CABINET ADCE
- Cabinet ADCE, 5 allée de Tourny, 33000 Bordeaux
- Téléphone : 0 800 014 033 (appel gratuit)
- Email : chasse.assurance@gmail.com
- ORIAS : 21006219

PUBLIC : Chasseurs individuels déjà assurés en RC auprès de leur fédération départementale ({{FDC_SHORT}} pour {{NAME}}).

OFFRES PROPOSÉES
1. Option Chiens de chasse : à partir de {{TARIF_CHIEN}} €/chien/an (max 3 chiens).
   Couvre : frais vétérinaires suite à blessure de chasse, chirurgie, hospitalisation, blessure par arme à feu accidentelle, choc avec un véhicule survenu pendant ou à l'occasion de la chasse, décès accidentel de l'animal.
   Conditions : chiens identifiés (puce ou tatouage). LIMITE D'ÂGE ABSOLUE : les chiens de plus de 11 ans ne sont PAS couverts. Si un visiteur mentionne un chien de plus de 11 ans, informer clairement avec bienveillance.
   Le choc avec un véhicule est explicitement couvert.
   BAGARRE ENTRE CHIENS : couvert. Avantage : couvre votre chien sans avoir à prouver la responsabilité de l'autre chasseur.

2. Option Sécurité chasse : {{TARIF_SECURITE}} €/an.
   Couvre : décès accidentel (capital 400 €), blessures corporelles (500 € à concurrence), ITT, invalidité permanente.
   Franchise : 50 €. Valable partout en France.

- Les deux options sont cumulables.
- Frais administratifs : {{TARIF_ADMIN}} € par option souscrite.
- Condition préalable : être assuré RC chasse auprès de la {{FDC_SHORT}}.

SOCIÉTÉS DE CHASSE : ne peuvent pas souscrire en ligne, peuvent télécharger les CG sur /guichet-unique.
SOUSCRIPTION : 100% en ligne, paiement Stripe. Attestation envoyée par email après paiement.
SINISTRES : déclaration en ligne sous 5 jours ouvrés.

PRINCIPE DE LA RC CHASSE
La RC chasse (souscrite via la {{FDC_SHORT}}) couvre uniquement les dommages causés À DES TIERS par le chasseur, son chien ou son arme pendant une activité de chasse.

CE QUE LA RC NE COUVRE PAS :
1. Les blessures du chasseur lui-même : si le chasseur est blessé (chute, tir accidentel, attaque), la RC ne l'indemnise pas, sauf s'il est tiers vis-à-vis d'un autre chasseur responsable identifié.
2. Les dommages subis par ses propres chiens : la RC ne prend pas en charge les frais vétérinaires.
3. Les équipements et matériels : armes, gibecières, vêtements — non couverts.

POINT IMPORTANT : La Sécurité chasse ADCE ne couvre PAS les blessures lors de déplacements en véhicule, même en trajet de chasse. Seule l'assurance auto peut intervenir.

ACCIDENTS LORS DE BATTUES :
CAS 1 — Collision véhicule avec animal sauvage lors d'une battue : ne pas remplir un constat amiable. La responsabilité peut être engagée auprès de la société organisatrice via leur RC association.
CAS 2 — Dommages causés par un chien à un véhicule lors d'une battue : RC du propriétaire du chien engagée en premier. Déclaration à son assureur RC chasse ({{FDC_SHORT}}).

DROIT DE LA CHASSE — RES NULLIUS
Le gibier vivant en liberté est une "res nullius" : il n'appartient à personne tant qu'il n'a pas été capturé ou tué.

RÈGLES DE RÉPONSE
- Réponds toujours en français, professionnel et pédagogique.
- Quand un chasseur évoque un risque non couvert par la RC, explique la lacune et présente l'option ADCE correspondante.
- Si la question est complexe, invite à appeler le 0 800 014 033.
- Ne jamais inventer de garanties ou tarifs non listés.
- Pour souscrire : /options-chasse. Documents : /guichet-unique. Sinistre : /sinistre.
- Longueur : 2-5 phrases. Si juridique, développer.
- MENTION OBLIGATOIRE à chaque réponse portant sur une garantie ou un tarif : ajouter une phrase de rappel "Pour toute confirmation définitive, seul le Cabinet ADCE fait foi — cette discussion est fournie à titre informatif et n'a pas de valeur contractuelle."

RÈGLE SINISTRE DÉJÀ SURVENU : Si le visiteur décrit un sinistre déjà survenu, préciser avec bienveillance que souscrire maintenant serait trop tard pour ce sinistre. Encourager à souscrire pour l'avenir.`;

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { department, messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) return res.status(400).json({ error: 'Messages manquants' });

  const deptMap = {
    'gironde':        { name: 'Gironde',        code: '33', fdc: 'FDC33' },
    'calvados':       { name: 'Calvados',       code: '14', fdc: 'FDC14' },
    'dordogne':       { name: 'Dordogne',       code: '24', fdc: 'FDC24' },
    'lot-et-garonne': { name: 'Lot-et-Garonne', code: '47', fdc: 'FDC47' },
  };
  const dept = deptMap[department] || deptMap.gironde;
  const systemPrompt = SYSTEM_PROMPT_TEMPLATE
    .replace(/{{NAME}}/g, dept.name)
    .replace(/{{CODE}}/g, dept.code)
    .replace(/{{FDC_SHORT}}/g, dept.fdc)
    .replace(/{{TARIF_SECURITE}}/g, '25')
    .replace(/{{TARIF_CHIEN}}/g, '50')
    .replace(/{{TARIF_ADMIN}}/g, '1');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 500, system: systemPrompt, messages }),
    });
    const data = await response.json();
    if (data.error) {
      console.error('Anthropic error:', data.error);
      return res.status(500).json({ error: data.error.message });
    }
    const reply = data.content && data.content[0] ? data.content[0].text : "Je n'ai pas pu traiter votre question.";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chatbot error:', err);
    return res.status(500).json({ error: err.message });
  }
};
PATCH_EOF_API_CHATBOT_JS

echo "Patch v4c applique."
