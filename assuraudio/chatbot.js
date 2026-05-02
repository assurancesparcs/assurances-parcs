(function () {
  const ACCENT = '#2BB5E0';
  const NAVY   = '#0B2545';
  const BLUE   = '#1A56A0';
  const LIGHT  = '#F4F8FC';
  const ICE    = '#EAF4FB';

  // ── BASE DE CONNAISSANCES ─────────────────────────────────────────────────────
  // Chaque entrée : mots-clés déclencheurs + réponse(s) (tirée aléatoirement)
  const KB = [
    {
      id: 'multirisque',
      keys: ['multirisque','local','cabinet','incendie','vol','dégât','dégats','matériel','bris','glace','vandalisme','locaux'],
      answers: [
        "Votre multirisque couvre l'incendie, les dégâts des eaux, le vol avec effraction, le vandalisme et le bris de matériel. Notre spécificité : la perte d'exploitation est indemnisée dès le 1er jour (franchise 0 jour), alors que les assureurs généralistes appliquent 3 à 4 jours de carence. La RC Pro est incluse.",
        "Le contrat multirisque AssurAudio protège intégralement votre local : incendie, vol, dégâts des eaux, bris de matériel et de glace. Surtout, en cas de fermeture forcée, vous êtes indemnisé dès le 1er jour — une garantie rare chez les assureurs généralistes."
      ]
    },
    {
      id: 'rcpro',
      keys: ['rc pro','rc professionnelle','responsabilité','patient','dommage','tiers','juridique','salarié','remplaçant','stagiaire'],
      answers: [
        "La RC Professionnelle est incluse dans votre multirisque. Elle couvre les dommages corporels, matériels et immatériels causés à vos patients et tiers, avec défense juridique incluse. Elle s'étend automatiquement à vos salariés, remplaçants et stagiaires.",
      ]
    },
    {
      id: 'perte_exploitation',
      keys: ['perte exploitation','perte d\'exploitation','fermeture','arrêt activité','franchise','carence','premier jour'],
      answers: [
        "Notre contrat prévoit une franchise 0 jour sur la perte d'exploitation : vous êtes indemnisé dès le 1er jour de fermeture forcée (sinistre, travaux suite à dégât…). Les assureurs généralistes appliquent généralement 3 à 4 jours de carence — chez nous, pas d'attente.",
      ]
    },
    {
      id: 'sante',
      keys: ['mutuelle','santé','complémentaire','optique','dentaire','hospitalisation','médecine','remboursement','famille','lunettes','soins'],
      answers: [
        "Nous proposons une complémentaire santé via notre partenaire UNIM, spécialisée dans les professions de santé libérales. Couverture : hospitalisation, dentaire, optique, médecine courante, médecines douces, avec possibilité d'extension famille.",
        "La complémentaire santé AssurAudio (partenaire UNIM) est conçue pour les professionnels de santé. Elle rembourse l'hospitalisation, le dentaire, l'optique et la médecine courante, avec des niveaux de garantie adaptés à votre statut libéral."
      ]
    },
    {
      id: 'prevoyance',
      keys: ['prévoyance','arrêt maladie','arrêt de travail','invalidité','décès','incapacité','charges fixes','loyer','salaire','absent','maladie','accident'],
      answers: [
        "La prévoyance vous protège si vous ne pouvez plus exercer : arrêt de travail, invalidité ou décès. Elle prend en charge vos charges fixes (loyer, salaires, crédits) pendant votre absence. Solution via notre partenaire UNIM, spécialisée pour les professionnels de santé.",
        "En cas d'arrêt de travail ou d'invalidité, la prévoyance compense la perte de revenus et maintient vos charges fixes. Via UNIM, les garanties sont calibrées pour votre activité d'audioprothésiste indépendant."
      ]
    },
    {
      id: 'emprunteur',
      keys: ['emprunteur','prêt','crédit','banque','délégation','immobilier','rachat','assurance prêt','ptia','assurance crédit'],
      answers: [
        "Vous pouvez déléguer votre assurance emprunteur à un assureur plus avantageux que votre banque. Via UNIM, nous couvrons le décès/PTIA, l'invalidité et l'arrêt de travail. La délégation est possible à tout moment (loi Lemoine) et peut générer une économie significative.",
      ]
    },
    {
      id: 'sinistres',
      keys: ['sinistre','déclaration','remboursement','indemnisation','dégât','dossier','suivi','gérer','expert','assurance sinistre'],
      answers: [
        "Chez AssurAudio, c'est votre conseiller du Cabinet PL qui gère votre dossier sinistre de A à Z. Pas de numéro vert anonyme, pas de formulaire en ligne — un vrai interlocuteur dédié, de la déclaration jusqu'à l'indemnisation complète.",
        "En cas de sinistre, vous appelez directement votre conseiller au 06 32 06 90 49. Il prend en charge le dossier, coordonne avec l'assureur et vous suit jusqu'au règlement. Aucun formulaire à remplir seul."
      ]
    },
    {
      id: 'devis',
      keys: ['devis','prix','tarif','coût','combien','tarification','cotisation','prime','budget','offre'],
      answers: [
        "Chaque cabinet est unique (surface, chiffre d'affaires, nombre de salariés, localisation…) donc les tarifs varient. Nous proposons un bilan découverte gratuit de 30 minutes pour analyser votre situation et vous faire une proposition personnalisée sans engagement.",
        "Nous ne donnons pas de tarifs génériques car votre profil est spécifique. Le plus simple : un bilan visio gratuit de 30 min pour qu'on étudie votre situation ensemble et qu'on vous fasse une offre sur-mesure."
      ]
    },
    {
      id: 'deja_assure',
      keys: ['déjà assuré','contrat actuel','autre assureur','comparer','changer','renégocier','revoir','audit','analyse'],
      answers: [
        "Nous analysons votre contrat actuel gratuitement pour identifier les lacunes ou surprimes. Beaucoup d'audioprothésistes découvrent qu'ils paient trop cher ou ne sont pas couverts sur des points essentiels (perte d'exploitation, RC Pro…). Un audit sans engagement.",
      ]
    },
    {
      id: 'qui',
      keys: ['qui êtes','cabinet','assuraudio','présentation','spécialisé','courtage','courtier','independant','indépendant'],
      answers: [
        "AssurAudio est un cabinet de courtage indépendant, spécialisé exclusivement pour les audioprothésistes en France. Nous négocions les meilleures conditions auprès des assureurs pour votre métier. Cabinet PL, joignable au 06 32 06 90 49.",
      ]
    },
    {
      id: 'contact',
      keys: ['contact','appel','téléphone','rappel','conseiller','rappeler','joindre','numéro','parler','humain'],
      answers: [
        "Vous pouvez nous appeler directement au 06 32 06 90 49 du lundi au vendredi. Ou réservez un bilan découverte gratuit en visio — choisissez le créneau qui vous convient.",
      ],
      rdv: true
    },
    {
      id: 'rdv',
      keys: ['rendez-vous','rdv','visio','bilan','découverte','réserver','créneau','disponibilité','prendre rdv','cal.com'],
      answers: [
        "Parfait ! Choisissez votre créneau directement dans l'agenda du conseiller — c'est gratuit et sans engagement.",
      ],
      rdv: true
    },
    {
      id: 'bonjour',
      keys: ['bonjour','bonsoir','salut','hello','bonne journée','allô'],
      answers: [
        "Bonjour ! Je suis l'assistant AssurAudio. Je peux vous renseigner sur nos garanties multirisque, RC Pro, santé, prévoyance et emprunteur pour audioprothésistes. Par quoi puis-je commencer ?",
      ]
    },
    {
      id: 'merci',
      keys: ['merci','parfait','super','excellent','très bien','top','nickel','cool'],
      answers: [
        "Avec plaisir ! N'hésitez pas si vous avez d'autres questions. Et si vous souhaitez aller plus loin, un bilan découverte de 30 min avec votre conseiller est offert.",
        "Merci à vous ! Je reste disponible si besoin. Pour un conseil personnalisé, notre conseiller est joignable au 06 32 06 90 49.",
      ]
    },
  ];

  const DISCLAIMER = "\n\n⚠️ Ces informations sont indicatives. Pour une étude personnalisée, appelez le 06 32 06 90 49 ou réservez votre bilan gratuit.";

  const FALLBACK = [
    "Je ne suis pas sûr de bien comprendre votre question. Pouvez-vous préciser ? Vous pouvez aussi nous appeler directement au 06 32 06 90 49.",
    "Je n'ai pas la réponse précise à cela, mais notre conseiller peut vous aider en 30 minutes. Voulez-vous réserver un bilan découverte gratuit ?",
  ];

  const QUICK_BTNS = [
    { label: 'Multirisque & RC Pro', msg: 'Je voudrais en savoir plus sur le multirisque et la RC Pro' },
    { label: 'Santé & Prévoyance',   msg: 'Je cherche une mutuelle santé ou une prévoyance' },
    { label: 'Gestion sinistres',    msg: 'Comment gérez-vous les sinistres ?' },
    { label: 'Devis gratuit',        msg: 'Je voudrais obtenir un devis gratuit' },
  ];

  var msgCount = 0;
  var isOpen   = false;

  // ── MOTEUR DE RÉPONSE ─────────────────────────────────────────────────────────
  function findAnswer(text) {
    var t = text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    var best = null;
    var bestScore = 0;

    KB.forEach(function (entry) {
      var score = 0;
      entry.keys.forEach(function (k) {
        var kNorm = k.normalize('NFD').replace(/[̀-ͯ]/g, '');
        if (t.includes(kNorm)) score++;
      });
      if (score > bestScore) { bestScore = score; best = entry; }
    });

    if (!best || bestScore === 0) {
      return { text: pick(FALLBACK), rdv: msgCount >= 2 };
    }

    var addDisclaimer = !['bonjour','merci','contact','rdv','qui'].includes(best.id);
    return {
      text: pick(best.answers) + (addDisclaimer ? DISCLAIMER : ''),
      rdv: best.rdv || msgCount >= 3
    };
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  // ── STYLES ───────────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = `
    #aa-chat-btn {
      position:fixed;bottom:28px;left:28px;z-index:9998;
      background:linear-gradient(135deg,${BLUE},${ACCENT});
      color:white;border:none;border-radius:50px;
      padding:14px 22px;font-size:14px;font-weight:600;
      font-family:"DM Sans",sans-serif;cursor:pointer;
      box-shadow:0 8px 28px rgba(26,86,160,.45);
      display:flex;align-items:center;gap:10px;
      transition:transform .2s,box-shadow .2s;
      animation:aaChatPop .6s .8s both;
    }
    #aa-chat-btn:hover{transform:translateY(-3px);box-shadow:0 12px 36px rgba(26,86,160,.55)}
    #aa-chat-btn .aa-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;animation:aaPulse 2s infinite}
    @keyframes aaPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}
    @keyframes aaChatPop{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

    #aa-chat-box {
      position:fixed;bottom:100px;left:28px;z-index:9999;
      width:360px;max-height:560px;
      background:white;border-radius:20px;
      box-shadow:0 20px 60px rgba(11,37,69,.18);
      border:1px solid rgba(74,159,212,.15);
      display:flex;flex-direction:column;overflow:hidden;
      transition:opacity .3s,transform .3s;
      opacity:0;transform:translateY(20px) scale(.97);pointer-events:none;
    }
    #aa-chat-box.open{opacity:1;transform:translateY(0) scale(1);pointer-events:all}

    .aa-header{background:linear-gradient(135deg,${NAVY},${BLUE});padding:16px 20px;display:flex;align-items:center;gap:12px;flex-shrink:0}
    .aa-avatar{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
    .aa-header-text strong{display:block;color:white;font-size:14px;font-weight:600;font-family:"DM Sans",sans-serif}
    .aa-header-text span{color:rgba(255,255,255,.65);font-size:12px;font-family:"DM Sans",sans-serif}
    .aa-close{margin-left:auto;background:none;border:none;color:rgba(255,255,255,.7);font-size:20px;cursor:pointer;padding:4px;line-height:1;transition:color .2s}
    .aa-close:hover{color:white}

    .aa-messages{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;min-height:0}
    .aa-messages::-webkit-scrollbar{width:4px}
    .aa-messages::-webkit-scrollbar-thumb{background:rgba(74,159,212,.3);border-radius:4px}

    .aa-msg{max-width:85%;animation:aaMsg .3s ease both}
    @keyframes aaMsg{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    .aa-msg.bot{align-self:flex-start}
    .aa-msg.user{align-self:flex-end}
    .aa-bubble{padding:11px 15px;border-radius:14px;font-size:13.5px;line-height:1.55;font-family:"DM Sans",sans-serif}
    .aa-msg.bot .aa-bubble{background:${LIGHT};color:${NAVY};border-radius:4px 14px 14px 14px;border:1px solid rgba(74,159,212,.12)}
    .aa-msg.user .aa-bubble{background:linear-gradient(135deg,${BLUE},${ACCENT});color:white;border-radius:14px 4px 14px 14px}

    .aa-typing{display:flex;gap:5px;padding:11px 15px;background:${LIGHT};border-radius:4px 14px 14px 14px;border:1px solid rgba(74,159,212,.12);width:fit-content;align-self:flex-start}
    .aa-typing span{width:7px;height:7px;border-radius:50%;background:${ACCENT};animation:aaDot 1.2s infinite}
    .aa-typing span:nth-child(2){animation-delay:.2s}
    .aa-typing span:nth-child(3){animation-delay:.4s}
    @keyframes aaDot{0%,80%,100%{transform:scale(.8);opacity:.5}40%{transform:scale(1.2);opacity:1}}

    .aa-quick{padding:8px 12px 0;display:flex;flex-wrap:wrap;gap:7px;flex-shrink:0}
    .aa-qbtn{background:${ICE};border:1.5px solid rgba(74,159,212,.3);color:${BLUE};border-radius:20px;padding:6px 13px;font-size:12px;font-weight:600;cursor:pointer;font-family:"DM Sans",sans-serif;transition:all .2s;white-space:nowrap}
    .aa-qbtn:hover{background:${ACCENT};border-color:${ACCENT};color:white}

    .aa-input-row{padding:12px;display:flex;gap:8px;border-top:1px solid rgba(74,159,212,.1);flex-shrink:0}
    .aa-input{flex:1;padding:10px 14px;border:1.5px solid #E0EBF5;border-radius:10px;font-family:"DM Sans",sans-serif;font-size:14px;color:${NAVY};outline:none;background:${LIGHT};transition:border-color .2s}
    .aa-input:focus{border-color:${ACCENT};background:white}
    .aa-send{width:38px;height:38px;border-radius:10px;border:none;background:linear-gradient(135deg,${BLUE},${ACCENT});color:white;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;transition:transform .2s;flex-shrink:0}
    .aa-send:hover{transform:scale(1.1)}

    .aa-rdv-card{background:linear-gradient(135deg,${NAVY},${BLUE});border-radius:14px;padding:16px;margin-top:4px;text-align:center}
    .aa-rdv-card p{color:rgba(255,255,255,.8);font-size:12.5px;margin-bottom:12px;font-family:"DM Sans",sans-serif;line-height:1.5}
    .aa-rdv-btn{display:inline-flex;align-items:center;gap:7px;background:${ACCENT};color:white;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600;font-size:13px;font-family:"DM Sans",sans-serif;box-shadow:0 4px 14px rgba(43,181,224,.4);transition:all .2s;cursor:pointer;border:none}
    .aa-rdv-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(43,181,224,.5)}

    @media(max-width:400px){#aa-chat-box{width:calc(100vw - 32px);left:16px;bottom:90px}}
  `;
  document.head.appendChild(style);

  // ── DOM ──────────────────────────────────────────────────────────────────────
  var btn = document.createElement('button');
  btn.id = 'aa-chat-btn';
  btn.innerHTML = '<span class="aa-dot"></span> Parlez à un conseiller';
  document.body.appendChild(btn);

  var box = document.createElement('div');
  box.id = 'aa-chat-box';
  box.innerHTML = `
    <div class="aa-header">
      <div class="aa-avatar">🎧</div>
      <div class="aa-header-text">
        <strong>Conseiller AssurAudio</strong>
        <span>🟢 En ligne maintenant</span>
      </div>
      <button class="aa-close" id="aa-close-btn">✕</button>
    </div>
    <div class="aa-messages" id="aa-msgs"></div>
    <div class="aa-quick" id="aa-quick"></div>
    <div class="aa-input-row">
      <input class="aa-input" id="aa-input" type="text" placeholder="Posez votre question…" />
      <button class="aa-send" id="aa-send">➤</button>
    </div>
  `;
  document.body.appendChild(box);

  // ── EVENTS ───────────────────────────────────────────────────────────────────
  btn.addEventListener('click', toggleChat);
  document.getElementById('aa-close-btn').addEventListener('click', closeChat);
  document.getElementById('aa-send').addEventListener('click', sendMsg);
  document.getElementById('aa-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') sendMsg();
  });

  // ── CHAT LOGIC ───────────────────────────────────────────────────────────────
  function toggleChat() { isOpen ? closeChat() : openChat(); }

  function openChat() {
    isOpen = true;
    box.classList.add('open');
    btn.innerHTML = '<span>✕</span> Fermer';
    if (msgCount === 0) setTimeout(botGreet, 400);
  }

  function closeChat() {
    isOpen = false;
    box.classList.remove('open');
    btn.innerHTML = '<span class="aa-dot"></span> Parlez à un conseiller';
  }

  function botGreet() {
    addBotMsg("Bonjour ! Je suis l'assistant AssurAudio. Je suis là pour vous aider à trouver la meilleure couverture pour votre cabinet d'audioprothèse. Qu'est-ce qui vous amène aujourd'hui ?", false, true);
  }

  function showQuickBtns() {
    var qDiv = document.getElementById('aa-quick');
    qDiv.innerHTML = '';
    QUICK_BTNS.forEach(function (b) {
      var el = document.createElement('button');
      el.className = 'aa-qbtn';
      el.textContent = b.label;
      el.addEventListener('click', function () { qDiv.innerHTML = ''; sendUserMsg(b.msg); });
      qDiv.appendChild(el);
    });
  }

  function addBotMsg(text, showRdv, withQuick) {
    var msgs = document.getElementById('aa-msgs');
    var div  = document.createElement('div');
    div.className = 'aa-msg bot';
    if (showRdv) {
      div.innerHTML = '<div class="aa-rdv-card"><p>' + escHtml(text) + '</p><button class="aa-rdv-btn" onclick="openCal ? openCal() : window.open(\'https://cal.com/johann-lebas-cdagzu/bilan-decouverte\',\'_blank\')">📅 Réserver mon bilan gratuit</button></div>';
    } else {
      div.innerHTML = '<div class="aa-bubble">' + escHtml(text).replace(/\n/g, '<br>') + '</div>';
    }
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    if (withQuick) showQuickBtns();
  }

  function addUserMsg(text) {
    var msgs = document.getElementById('aa-msgs');
    var div  = document.createElement('div');
    div.className = 'aa-msg user';
    div.innerHTML  = '<div class="aa-bubble">' + escHtml(text) + '</div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    var msgs = document.getElementById('aa-msgs');
    var div  = document.createElement('div');
    div.id   = 'aa-typing-indicator';
    div.className = 'aa-msg bot';
    div.innerHTML = '<div class="aa-typing"><span></span><span></span><span></span></div>';
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function removeTyping() {
    var t = document.getElementById('aa-typing-indicator');
    if (t) t.remove();
  }

  function sendMsg() {
    var input = document.getElementById('aa-input');
    var text  = input.value.trim();
    if (!text) return;
    input.value = '';
    sendUserMsg(text);
  }

  function sendUserMsg(text) {
    addUserMsg(text);
    document.getElementById('aa-quick').innerHTML = '';
    msgCount++;

    var delay = 600 + Math.min(text.length * 8, 900);
    showTyping();
    setTimeout(function () {
      removeTyping();
      var result = findAnswer(text);
      addBotMsg(result.text, result.rdv);
    }, delay);
  }

  function escHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
})();
