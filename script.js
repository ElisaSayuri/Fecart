/* ============================================================
   PROJETO: VOCÊ FOI HACKEADO! (SIMULAÇÃO E CONSCIENTIZAÇÃO)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');
  const terminalBody = document.getElementById('terminal-body');
  const devModel = document.getElementById('dev-model');
  const devOs = document.getElementById('dev-os');
  const devIp = document.getElementById('dev-ip');
  const devLoc = document.getElementById('dev-loc');
  const progressBar = document.getElementById('progress-bar');
  const progressPercent = document.getElementById('progress-percent');
  const progressStatus = document.getElementById('progress-status');
  const countdownEl = document.getElementById('countdown');
  const panicBtn = document.getElementById('panic-btn');
  const soundToggle = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  const soundLabel = document.getElementById('sound-label');
  const revealModal = document.getElementById('reveal-modal');
  const restartBtn = document.getElementById('restart-btn');

  // Estados
  let soundEnabled = false;
  let audioCtx = null;
  let countdownSeconds = 15;
  let countdownTimer = null;
  let progress = 0;
  let isPrankRevealed = false;

  // ============================================================
  // 1. ÁUDIO SINTETIZADO (Web Audio API - 100% Offline e Leve)
  // ============================================================
  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, duration = 0.08, type = 'sine', gainVal = 0.1) {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  function playSiren() {
    if (!soundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.3);
      osc.frequency.linearRampToValueAtTime(440, now + 0.6);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(now + 0.6);
    } catch (e) {}
  }

  function toggleSound() {
    initAudio();
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      soundIcon.textContent = '🔊';
      soundLabel.textContent = 'LIGADO';
      playTone(800, 0.15, 'triangle', 0.15);
    } else {
      soundIcon.textContent = '🔇';
      soundLabel.textContent = 'SOM';
    }
  }

  soundToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSound();
  });

  // Ativa áudio no primeiro toque em qualquer lugar da tela
  document.body.addEventListener('click', () => {
    initAudio();
    if (!soundEnabled) {
      soundEnabled = true;
      soundIcon.textContent = '🔊';
      soundLabel.textContent = 'LIGADO';
    }
  }, { once: true });

  // ============================================================
  // 2. CHUVA DE CÓDIGO MATRIX (Canvas)
  // ============================================================
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const characters = '0123456789ABCDEF$#@%&*+-/<>{}[]=XYZﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
  const fontSize = 14;
  let columns = Math.floor(window.innerWidth / fontSize);
  let drops = Array(columns).fill(1);

  function drawMatrix() {
    ctx.fillStyle = 'rgba(7, 9, 14, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff66';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = characters.charAt(Math.floor(Math.random() * characters.length));
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    requestAnimationFrame(drawMatrix);
  }
  requestAnimationFrame(drawMatrix);

  // ============================================================
  // 3. DETECÇÃO REAL DE DISPOSITIVO E IP
  // ============================================================
  function detectDeviceInfo() {
    const ua = navigator.userAgent;
    let model = "Dispositivo Móvel Desconhecido";
    let os = "Sistema Operacional Desconhecido";

    // Detecção de SO e Modelo
    if (/iPhone/i.test(ua)) {
      model = "Apple iPhone (" + (window.screen.width + "x" + window.screen.height) + ")";
      os = "Apple iOS";
    } else if (/iPad/i.test(ua)) {
      model = "Apple iPad";
      os = "iPadOS";
    } else if (/Android/i.test(ua)) {
      if (/Samsung/i.test(ua) || /SM-/i.test(ua)) model = "Samsung Galaxy";
      else if (/Xiaomi/i.test(ua) || /Redmi/i.test(ua)) model = "Xiaomi / Redmi";
      else if (/Motorola/i.test(ua) || /Moto/i.test(ua)) model = "Motorola Moto";
      else model = "Aparelho Android";
      os = "Google Android";
    } else if (/Windows NT/i.test(ua)) {
      model = "Computador / Notebook";
      os = "Microsoft Windows";
    } else if (/Macintosh|Mac OS X/i.test(ua)) {
      model = "Apple Mac";
      os = "macOS";
    } else if (/Linux/i.test(ua)) {
      model = "Estação de Trabalho";
      os = "GNU/Linux";
    }

    devModel.textContent = model;
    devOs.textContent = os;

    // Busca IP e Cidade aproximada
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => {
        devIp.textContent = data.ip || '189.34.218.42';
        fetch(`https://ipapi.co/${data.ip}/json/`)
          .then(res => res.json())
          .then(locData => {
            const city = locData.city || 'São Paulo';
            const region = locData.region_code || 'BR';
            devLoc.textContent = `${city}, ${region}`;
          })
          .catch(() => {
            devLoc.textContent = 'Brasil (Geolocalização Ativa)';
          });
      })
      .catch(() => {
        devIp.textContent = '189.34.218.42';
        devLoc.textContent = 'São Paulo, Brasil';
      });
  }

  // ============================================================
  // 4. TERMINAL E LOGS FALSOS
  // ============================================================
  const fakeLogs = [
    { text: '[+] Payload inicializado via protocolo QR Code', type: 'info', delay: 400 },
    { text: '[+] Conexão reversa SSL criptografada estabelecida (Porta 443)', type: 'cyan', delay: 1100 },
    { text: '[+] Bypassing sandbox de segurança do navegador... [SUCESSO]', type: 'info', delay: 1800 },
    { text: '[+] Extraindo cache local, cookies e tokens de sessão...', type: 'warn', delay: 2600 },
    { text: '[+] Acessando armazenamento interno: DCIM/Camera/WhatsApp...', type: 'warn', delay: 3500 },
    { text: '[!] Permissão de gravação e microfone ativada em segundo plano', type: 'danger', delay: 4400 },
    { text: '[+] Compactando 4.281 fotos e mensagens privadas...', type: 'cyan', delay: 5400 },
    { text: '[!] UPLOAD REMOTO EM ANDAMENTO PARA SERVIDOR EXTERNO...', type: 'danger', delay: 6500 },
    { text: '[!] Tentativa de cancelamento será bloqueada por watchdog', type: 'warn', delay: 7800 },
    { text: '[!] Chave de criptografia AES-256 gerada para travamento total', type: 'danger', delay: 9200 }
  ];

  function addLog(text, type = 'info') {
    const p = document.createElement('p');
    p.className = `log-line ${type}`;
    p.innerHTML = `<span class="prompt">&gt;</span> <span>${text}</span>`;
    terminalBody.appendChild(p);
    terminalBody.scrollTop = terminalBody.scrollHeight;
    playTone(1200 + Math.random() * 400, 0.04, 'square', 0.04);
  }

  function startLogs() {
    fakeLogs.forEach((item) => {
      setTimeout(() => {
        if (!isPrankRevealed) {
          addLog(item.text, item.type);
        }
      }, item.delay);
    });
  }

  // ============================================================
  // 5. BARRA DE PROGRESSO & CONTAGEM REGRESSIVA
  // ============================================================
  function startProgress() {
    const interval = setInterval(() => {
      if (isPrankRevealed) {
        clearInterval(interval);
        return;
      }
      if (progress < 98) {
        progress += Math.floor(Math.random() * 6) + 3;
        if (progress > 98) progress = 98;
        progressBar.style.width = `${progress}%`;
        progressPercent.textContent = `${progress}%`;

        if (progress > 30 && progress < 60) {
          progressStatus.textContent = 'Enviando contatos e histórico do WhatsApp...';
        } else if (progress >= 60 && progress < 85) {
          progressStatus.textContent = 'Copiando galeria de fotos e documentos...';
        } else if (progress >= 85) {
          progressStatus.textContent = 'Criptografando chave mestra do dispositivo...';
        }
      }
    }, 450);
  }

  function startCountdown() {
    countdownTimer = setInterval(() => {
      if (isPrankRevealed) {
        clearInterval(countdownTimer);
        return;
      }
      countdownSeconds--;
      const formatted = countdownSeconds < 10 ? `00:0${countdownSeconds}` : `00:${countdownSeconds}`;
      countdownEl.textContent = formatted;

      if (countdownSeconds <= 5) {
        playTone(900, 0.1, 'sawtooth', 0.15);
      }

      if (countdownSeconds <= 0) {
        clearInterval(countdownTimer);
        showReveal();
      }
    }, 1000);
  }

  // ============================================================
  // 6. BOTÃO DE PÂNICO ("TENTAR INTERROMPER")
  // ============================================================
  panicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    initAudio();
    playSiren();

    // Efeito de erro crítico ao tentar cancelar
    panicBtn.disabled = true;
    panicBtn.style.background = '#880015';
    panicBtn.innerHTML = '🚨 ERRO: FALHA AO INTERROMPER! ACELERANDO DESTRUIÇÃO... 🚨';
    document.body.style.filter = 'invert(1)';
    setTimeout(() => {
      document.body.style.filter = 'none';
    }, 150);

    addLog('[CRITICAL] Tentativa de interrupção manual detectada pelo firewall!', 'danger');
    addLog('[CRITICAL] Payload antecipando bloqueio do dispositivo!', 'danger');

    // Antecipa o final para dar susto imediato e revelar
    setTimeout(() => {
      showReveal();
    }, 1800);
  });

  // ============================================================
  // 7. REVELAÇÃO DA BRINCADEIRA & CONSCIENTIZAÇÃO
  // ============================================================
  function showReveal() {
    if (isPrankRevealed) return;
    isPrankRevealed = true;
    clearInterval(countdownTimer);

    // Sucesso / som alegre
    playTone(523.25, 0.15, 'sine', 0.15); // C5
    setTimeout(() => playTone(659.25, 0.15, 'sine', 0.15), 120); // E5
    setTimeout(() => playTone(783.99, 0.25, 'sine', 0.2), 240); // G5

    revealModal.classList.remove('hidden');
  }

  // Reiniciar a brincadeira
  restartBtn.addEventListener('click', () => {
    isPrankRevealed = false;
    terminalBody.innerHTML = '';
    progress = 0;
    progressBar.style.width = '0%';
    progressPercent.textContent = '0%';
    progressStatus.textContent = 'Extraindo fotos e conversas...';
    countdownSeconds = 15;
    countdownEl.textContent = '00:15';
    panicBtn.disabled = false;
    panicBtn.style.background = '';
    panicBtn.innerHTML = '<span class="btn-icon">⚡</span> TENTAR INTERROMPER INVASÃO <span class="btn-icon">⚡</span>';
    revealModal.classList.add('hidden');

    startLogs();
    startProgress();
    startCountdown();
  });

  // Iniciar tudo ao carregar
  detectDeviceInfo();
  startLogs();
  startProgress();
  startCountdown();
});
