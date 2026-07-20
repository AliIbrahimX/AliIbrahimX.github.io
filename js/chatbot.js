/* ============================================================
   Ali Ibrahim Al Safwan — chat assistant
   A small rule-based (keyword-matched) FAQ bot about Ali. No
   network calls, no AI model, no data leaves the browser.
   ============================================================ */
(function () {
  'use strict';

  var launcher = document.getElementById('pc-launcher');
  var panel = document.getElementById('pc-panel');
  var closeBtn = document.getElementById('pc-close');
  var messagesEl = document.getElementById('pc-messages');
  var quickEl = document.getElementById('pc-quick');
  var form = document.getElementById('pc-form');
  var input = document.getElementById('pc-input');

  if (!launcher || !panel || !form || !input || !messagesEl) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     KNOWLEDGE BASE — ordered rules, most specific first.
     Each rule lists keywords matched as substrings of the
     lower-cased input; the first rule to match wins.
  ---------------------------------------------------------- */
  var RULES = [
    {
      keywords: ['hello', 'hi', 'hey', 'yo', 'sup', 'good morning', 'good evening', 'good afternoon'],
      reply: "Hey! I'm a small scripted assistant for Ali's site — not a real AI, just keyword matching. Ask about his skills, experience, projects, education, languages, interests, or how to reach him. Type “help” any time for the full topic list."
    },
    {
      keywords: ['thank*', 'thx', 'appreciate', 'cheers'],
      reply: "You're welcome! Anything else — skills, projects, or how to get in touch?"
    },
    {
      keywords: ['are you real', 'are you ai', 'are you human', 'are you a bot', 'robot', 'chatgpt', 'gpt', 'llm', 'language model'],
      reply: "I'm just a small rule-based script — plain JavaScript matching keywords, no AI model and no data leaving your browser. I only know what's written on this page. For a real conversation, email is your best bet."
    },
    {
      keywords: ['help', 'what can you', 'what can i ask', 'topics', 'commands', 'more topics', 'what do you know'],
      reply: 'Ask me about: skills, experience (Worley co-op &amp; his quality-inspection years), specific projects (the Hotel Booking System, the private client site, his TM471 capstone), education &amp; certifications, languages, interests, location, availability, or how to contact him.'
    },
    {
      keywords: ['resume', 'cv', 'download'],
      reply: "There isn't a downloadable PDF on this page yet — this portfolio is the full picture of his background. If you need a formal CV, email him at <a href=\"mailto:ali.alsafwan96@gmail.com\">ali.alsafwan96@gmail.com</a> and he can send one over."
    },
    {
      keywords: ['hotel', 'booking system'],
      reply: 'The Hotel Booking System is a Java console app modeling a hotel’s core operations — <code>Hotel</code>, <code>Room</code>, <code>Guest</code>, and <code>Booking</code> classes handle room booking, check-out, and stay-length calculation with <code>java.time</code>. It’s open source: <a href="https://github.com/AliIbrahimX/Hotel" target="_blank" rel="noopener noreferrer">view the code</a>.'
    },
    {
      keywords: ['private client', 'client website', 'client site', 'client work'],
      reply: 'A responsive marketing website Ali designed and built end-to-end for a private company — mobile-first layout, hand-written HTML/CSS/JS with no framework overhead, delivered from structure through deployment. Source and client identity stay confidential at the client’s request.'
    },
    {
      keywords: ['capstone', 'tm471', 'graduation project', 'final year project', 'final-year project'],
      reply: 'His TM471 capstone is Ali’s Arab Open University graduation project, currently in progress. The full write-up — problem, approach, outcomes — plus the Cisco Packet Tracer network builds behind it will be published here once it ships with graduation.'
    },
    {
      keywords: ['contact', 'email', 'reach', 'linkedin', 'connect', 'phone', 'get in touch'],
      reply: 'Best way to reach Ali: email <a href="mailto:ali.alsafwan96@gmail.com">ali.alsafwan96@gmail.com</a>, or connect on <a href="https://www.linkedin.com/in/ali-al-safwan-1019b418b/" target="_blank" rel="noopener noreferrer">LinkedIn</a>. Code and repos are on <a href="https://github.com/AliIbrahimX" target="_blank" rel="noopener noreferrer">GitHub</a>.'
    },
    {
      keywords: ['available', 'availability', 'open to', 'looking for', 'opportunit*', 'full-time', 'full time', 'hiring', 'hire'],
      reply: 'Yes — Ali is a final-semester student open to full-time, co-op, and internship opportunities in IT and network security. See the <a href="#contact">Contact section</a> to reach out.'
    },
    {
      keywords: ['where', 'location', 'based', 'live', 'dammam', 'saudi', 'city', 'country'],
      reply: 'Ali is based in Dammam, Saudi Arabia.'
    },
    {
      keywords: ['language', 'arabic', 'english', 'bilingual', 'speak'],
      reply: 'Native Arabic, plus professional working proficiency in English (IELTS Band 5.5) — comfortable operating in bilingual technical environments.'
    },
    {
      keywords: ['interest*', 'hobby', 'hobbies', 'passion*', 'free time', 'spare time'],
      reply: 'Alongside security, Ali is genuinely interested in AI — both as a daily working tool and for how machine-learning systems are changing what defenders have to protect. On the security side, he gravitates to traffic analysis in Wireshark, reconnaissance/scanning with Nmap, and firewall &amp; IDS configuration work.'
    },
    {
      keywords: ['education', 'degree', 'university', 'college', 'certificat*', 'ielts', 'diploma', 'gpa', 'credential', 'study', 'studies'],
      reply: "Bachelor's in Networking &amp; Security at Arab Open University, Dammam (final semester). Earlier, a Diploma in Mechanical Inspection from ITQAN College (3.24 GPA). He also holds a Worley Cooperative Training Certificate and IELTS Band 5.5. More in the <a href=\"#credentials\">Credentials section</a>."
    },
    {
      keywords: ['experience', 'work', 'worley', 'job', 'career', 'intern*', 'co-op', 'coop', 'inspector', 'inspection'],
      reply: 'Feb–Apr 2026: IT cooperative training at Worley — imaging Windows devices, managing Active Directory accounts, resolving tickets in ServiceNow, and hands-on LAN/switch/server room work. Before IT: about two years as a mechanical/quality inspector on oil &amp; gas projects (NDT, calibration, ITP compliance), preceded by a Mechanical Quality Inspector role at TUV Rheinland running NDT, calibration, and ITP compliance. Full timeline in the <a href="#experience">Experience section</a>.'
    },
    {
      keywords: ['project*', 'built', 'github', 'portfolio', 'repo*'],
      reply: 'Three to check out: a Java Hotel Booking System (open source), a private client website (code confidential), and his TM471 capstone (in progress, Cisco Packet Tracer builds). More small exercises are on <a href="https://github.com/AliIbrahimX?tab=repositories" target="_blank" rel="noopener noreferrer">GitHub</a>. Ask me about any of them by name for more detail, or see the <a href="#projects">Projects section</a>.'
    },
    {
      keywords: ['wireshark', 'nmap', 'traffic analysis', 'packet capture', 'reconnaissance'],
      reply: 'Ali works hands-on with Wireshark for traffic analysis and Nmap for reconnaissance and scanning — both rated Familiar on his skill map, and the tools he specifically gravitates to within security work.'
    },
    {
      keywords: ['cisco', 'packet tracer', 'ccna'],
      reply: 'Cisco Packet Tracer is one of his strongest tools (rated Proficient) — used throughout his CCNA-A coursework and the network builds behind his TM471 capstone.'
    },
    {
      keywords: ['skill*', 'tech', 'stack', 'know', 'technolog*', 'firewall', 'siem', 'proficient', 'java', 'react', 'node', 'docker', 'linux', 'windows', 'active directory', 'servicenow'],
      reply: 'Core areas: Network Security (firewalls — familiar; IDS/IPS &amp; SIEM — learning), IT &amp; Systems (Windows — proficient; Active Directory &amp; Linux — familiar), Development (HTML — proficient; CSS/JS — familiar; React/Node — learning), and Tools (Cisco Packet Tracer — proficient; Wireshark &amp; Nmap — familiar). Full breakdown in the <a href="#skills">Skills section</a>.'
    },
    {
      keywords: ['who', 'about', 'background', 'story', 'yourself', 'tell me', 'why security', 'why network'],
      reply: 'Ali Ibrahim Al Safwan is a final-semester Networking &amp; Security student at Arab Open University in Dammam. Before IT, he spent years in industrial quality inspection — NDT and dimensional inspection on oil-field projects — which built the process discipline and attention to detail he now brings to security work. More in the <a href="#about">About section</a>.'
    }
  ];

  var FALLBACK = "I didn't catch that — I'm a simple keyword bot, not a full AI. Try one of the topics below, type “help” for the full list, or email Ali directly at <a href=\"mailto:ali.alsafwan96@gmail.com\">ali.alsafwan96@gmail.com</a>.";

  var QUICK_REPLIES = ['Skills', 'Experience', 'Projects', 'Education', 'Contact', 'Is he available?', 'Help'];

  // Word-boundary matching — plain substring matching would let short
  // keywords like "hi" or "yo" false-match inside "this" or "you".
  // A trailing "*" marks an intentional stem (e.g. "skill*" should still
  // match "skills"): boundary-anchored at the start only, open at the end.
  function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  RULES.forEach(function (rule) {
    rule.regexes = rule.keywords.map(function (kw) {
      var isStem = kw.charAt(kw.length - 1) === '*';
      var base = isStem ? kw.slice(0, -1) : kw;
      return new RegExp('\\b' + escapeRegExp(base) + (isStem ? '' : '\\b'), 'i');
    });
  });

  function findReply(text) {
    for (var i = 0; i < RULES.length; i++) {
      var rule = RULES[i];
      for (var j = 0; j < rule.regexes.length; j++) {
        if (rule.regexes[j].test(text)) return rule.reply;
      }
    }
    return FALLBACK;
  }

  /* ----------------------------------------------------------
     RENDERING
  ---------------------------------------------------------- */
  function scrollToEnd() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addUserMessage(text) {
    var p = document.createElement('p');
    p.className = 'pc-msg pc-msg-user';
    p.textContent = text;
    messagesEl.appendChild(p);
    scrollToEnd();
  }

  // Only ever called with the trusted, static strings above — never with raw user input.
  function addBotMessage(html) {
    var p = document.createElement('p');
    p.className = 'pc-msg pc-msg-bot';
    p.innerHTML = html;
    messagesEl.appendChild(p);
    scrollToEnd();
  }

  function addTyping() {
    var p = document.createElement('p');
    p.className = 'pc-msg pc-msg-bot';
    p.innerHTML = '<span class="pc-typing"><i></i><i></i><i></i></span>';
    messagesEl.appendChild(p);
    scrollToEnd();
    return p;
  }

  function renderQuickReplies() {
    quickEl.innerHTML = '';
    QUICK_REPLIES.forEach(function (label) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pc-chip mono';
      btn.textContent = label;
      btn.addEventListener('click', function () { sendMessage(label); });
      quickEl.appendChild(btn);
    });
  }

  function respondTo(text) {
    var reply = findReply(text);
    var typingEl = addTyping();
    var delay = reducedMotion ? 120 : 420 + Math.random() * 380;
    setTimeout(function () {
      typingEl.remove();
      addBotMessage(reply);
    }, delay);
  }

  function sendMessage(text) {
    text = text.trim();
    if (!text) return;
    addUserMessage(text);
    input.value = '';
    respondTo(text);
  }

  var greeted = false;
  function greetOnce() {
    if (greeted) return;
    greeted = true;
    addBotMessage("Hi, I'm Ali's site assistant — a small scripted bot, not AI. Ask me about his skills, experience, projects, education, languages, interests, or how to reach him — or tap “Help” for the full topic list.");
    renderQuickReplies();
  }

  /* ----------------------------------------------------------
     OPEN / CLOSE
  ---------------------------------------------------------- */
  function setOpen(open) {
    panel.classList.toggle('is-open', open);
    launcher.classList.toggle('is-open', open);
    launcher.setAttribute('aria-expanded', String(open));
    launcher.setAttribute('aria-label', open ? 'Close chat assistant' : 'Open chat assistant');
    if (open) {
      greetOnce();
      setTimeout(function () { input.focus(); }, reducedMotion ? 0 : 200);
    }
  }

  launcher.addEventListener('click', function () {
    setOpen(!panel.classList.contains('is-open'));
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      setOpen(false);
      launcher.focus();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) {
      setOpen(false);
      launcher.focus();
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    sendMessage(input.value);
  });
})();
