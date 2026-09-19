/* ============================================================
   PROJETO: VOCÊ FOI HACKEADO! (SIMULAÇÃO & CONSCIENTIZAÇÃO FECART)
   ============================================================ */

// ============================================================
// CONFIGURAÇÃO DA SENHA DO WI-FI
// ============================================================
const ACCEPTED_PASSWORDS = [
  'F*@c#19_-F8..',
  'f*@c#19_-f8..' // Suporte para facilitar no teclado do celular
];

document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM - Wi-Fi
  const wifiScreen = document.getElementById('wifi-screen');
  const hackerScreen = document.getElementById('hacker-screen');
  const wifiForm = document.getElementById('wifi-form');
  const wifiPasswordInput = document.getElementById('wifi-password-input');
  const wifiTogglePass = document.getElementById('wifi-toggle-pass');
  const wifiError = document.getElementById('wifi-error');
  const wifiSubmitBtn = document.getElementById('wifi-submit-btn');

  // Elementos do DOM - Tela Hacker
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
  const panicBtn = document.getElementById('panic-btn');
  const soundToggle = document.getElementById('sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  const soundLabel = document.getElementById('sound-label');
  const revealModal = document.getElementById('reveal-modal');
  const restartBtn = document.getElementById('restart-btn');

  // Estados
  let soundEnabled = false;
  let audioCtx = null;
  let progress = 0;
  let isPrankRevealed = false;
  let isHackedActive = false;
  let progressInterval = null;
  let autoRevealTimer = null;

  if (wifiPasswordInput) {
    wifiPasswordInput.focus();
  }

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
  }, { once: true });

  // ============================================================
  // 2. TELA DE WI-FI GRÁTIS - VALIDAÇÃO E INTERAÇÃO
  // ============================================================
  
  // Alternar visualização da senha
  wifiTogglePass.addEventListener('click', (e) => {
    e.preventDefault();
    if (wifiPasswordInput.type === 'password') {
      wifiPasswordInput.type = 'text';
      wifiTogglePass.textContent = '🙈';
    } else {
      wifiPasswordInput.type = 'password';
      wifiTogglePass.textContent = '👁️';
    }
  });

  // Limpar erro ao digitar
  wifiPasswordInput.addEventListener('input', () => {
    wifiError.classList.add('hidden');
    wifiPasswordInput.classList.remove('error');
  });

  // Submissão do formulário de Wi-Fi
  wifiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const entered = wifiPasswordInput.value.trim().toLowerCase();

    // Validação da senha digitada com a lista aceita
    const isCorrect = entered !== '' && ACCEPTED_PASSWORDS.some(pwd => pwd.toLowerCase() === entered);

    if (!isCorrect) {
      // SENHA INCORRETA
      wifiError.classList.remove('hidden');
      wifiPasswordInput.classList.add('error');

      // Reinicia animação de vibração (shake)
      wifiPasswordInput.classList.remove('shake');
      void wifiPasswordInput.offsetWidth;
      wifiPasswordInput.classList.add('shake');

      initAudio();
      playTone(180, 0.2, 'sawtooth', 0.15);
      wifiPasswordInput.focus();
      return;
    }

    // SENHA CORRETA -> LEVA PARA A TELA "VOCÊ FOI HACKEADO"
    wifiError.classList.add('hidden');
    wifiPasswordInput.classList.remove('error');
    triggerHackedScreen();
  });

  // Transição para a tela "Você foi Hackeado"
  function triggerHackedScreen() {
    initAudio();
    soundEnabled = true;
    soundIcon.textContent = '🔊';
    soundLabel.textContent = 'LIGADO';

    // Dispara alarme e efeito sonoro de invasão
    playTone(150, 0.25, 'sawtooth', 0.25);
    setTimeout(() => playSiren(), 180);

    // Efeito de flash na tela para impacto visual imediato
    document.body.style.filter = 'invert(1)';
    setTimeout(() => {
      document.body.style.filter = 'none';
    }, 140);

    // Oculta portal de Wi-Fi e revela alerta hacker
    wifiScreen.classList.add('hidden');
    hackerScreen.classList.remove('hidden');
    isHackedActive = true;

    // Dispara a simulação hacker
    detectDeviceInfo();
    startLogs();
    startProgress();

    // Revelação automática após 16 segundos caso não clique no botão
    autoRevealTimer = setTimeout(() => {
      if (!isPrankRevealed) {
        showReveal();
      }
    }, 16000);
  }

  // ============================================================
  // 3. CHUVA DE CÓDIGO MATRIX (Canvas)
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
    { text: '[+] Conexão Wi-Fi interceptada via Ponto de Acesso falso', type: 'info', delay: 300 },
    { text: '[+] Túnel reverso SSL criptografado ativo (Porta 443)', type: 'cyan', delay: 900 },
    { text: '[+] Bypassing proteção de rede e sandbox do navegador... [SUCESSO]', type: 'info', delay: 1600 },
    { text: '[+] Extraindo senhas salvas, cookies e tokens de sessão...', type: 'warn', delay: 2400 },
    { text: '[+] Varrendo arquivos locais: DCIM/Camera/WhatsApp...', type: 'warn', delay: 3300 },
    { text: '[!] Permissão de microfone e gravação habilitada remotamente', type: 'danger', delay: 4200 },
    { text: '[+] Compactando mensagens e histórico privado para exfiltração...', type: 'cyan', delay: 5200 },
    { text: '[!] UPLOAD EM ANDAMENTO PARA SERVIDOR C2 REMOTO...', type: 'danger', delay: 6300 },
    { text: '[!] ALERTA CRÍTICO: Dispositivo comprometido por rede falsa!', type: 'warn', delay: 7500 },
    { text: '[!] VÁ ATÉ A FECART DE CIBERSEGURANÇA PARA ENTENDER O QUE ACONTECEU!', type: 'danger', delay: 8800 }
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
        if (!isPrankRevealed && isHackedActive) {
          addLog(item.text, item.type);
        }
      }, item.delay);
    });
  }

  // ============================================================
  // 5. BARRA DE PROGRESSO FICTÍCIA
  // ============================================================
  function startProgress() {
    if (progressInterval) clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      if (isPrankRevealed || !isHackedActive) {
        clearInterval(progressInterval);
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

  // ============================================================
  // 6. BOTÃO DE AÇÃO ("TENTAR INTERROMPER")
  // ============================================================
  panicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    initAudio();
    playSiren();

    // Efeito de erro crítico ao tentar cancelar
    panicBtn.disabled = true;
    panicBtn.style.background = '#880015';
    panicBtn.innerHTML = '🚨 ERRO: FALHA AO INTERROMPER! ACELERANDO BLOQUEIO... 🚨';
    document.body.style.filter = 'invert(1)';
    setTimeout(() => {
      document.body.style.filter = 'none';
    }, 150);

    addLog('[CRITICAL] Tentativa de interrupção manual detectada pelo firewall!', 'danger');
    addLog('[CRITICAL] Compareça imediatamente à FECART de Cibersegurança!', 'danger');

    if (autoRevealTimer) clearTimeout(autoRevealTimer);
    setTimeout(() => {
      showReveal();
    }, 1600);
  });

  // ============================================================
  // 7. REVELAÇÃO DA BRINCADEIRA & CONSCIENTIZAÇÃO FECART
  // ============================================================
  function showReveal() {
    if (isPrankRevealed) return;
    isPrankRevealed = true;
    if (autoRevealTimer) clearTimeout(autoRevealTimer);
    if (progressInterval) clearInterval(progressInterval);

    // Sucesso / som alegre
    playTone(523.25, 0.15, 'sine', 0.15); // C5
    setTimeout(() => playTone(659.25, 0.15, 'sine', 0.15), 120); // E5
    setTimeout(() => playTone(783.99, 0.25, 'sine', 0.2), 240); // G5

    revealModal.classList.remove('hidden');
  }

  // Reiniciar a brincadeira e retornar à tela de Wi-Fi
  restartBtn.addEventListener('click', () => {
    isPrankRevealed = false;
    isHackedActive = false;
    if (autoRevealTimer) clearTimeout(autoRevealTimer);
    if (progressInterval) clearInterval(progressInterval);

    // Reseta tela hacker
    terminalBody.innerHTML = '';
    progress = 0;
    progressBar.style.width = '0%';
    progressPercent.textContent = '0%';
    progressStatus.textContent = 'Extraindo fotos e conversas...';
    panicBtn.disabled = false;
    panicBtn.style.background = '';
    panicBtn.innerHTML = '<span class="btn-icon">⚡</span> TENTAR INTERROMPER INVASÃO <span class="btn-icon">⚡</span>';

    // Oculta modal e tela hacker, volta para o Wi-Fi
    revealModal.classList.add('hidden');
    hackerScreen.classList.add('hidden');
    wifiScreen.classList.remove('hidden');

    // Reseta campos do Wi-Fi
    wifiPasswordInput.value = '';
    wifiError.classList.add('hidden');
    wifiPasswordInput.classList.remove('error');
    wifiPasswordInput.focus();
  });
});
