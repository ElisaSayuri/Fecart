/* ============================================================
   PROJETO: VOCÊ FOI HACKEADO! (SIMULAÇÃO & CONSCIENTIZAÇÃO FECART)
   ============================================================ */

// ============================================================
// CONFIGURAÇÃO DE LOGIN E SENHA DO WI-FI
// ============================================================
const ACCEPTED_LOGINS = [
  'FECART_5_andar',
  'fecart_5_andar',
  'FECART_5_ANDAR',
  'fecart 5 andar',
  'fecart5andar'
];

const ACCEPTED_PASSWORDS = [
  'F*@c#19_-F8..',
  'f*@c#19_-f8..' // Suporte para facilitar no teclado do celular
];

document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM - Wi-Fi
  const wifiScreen = document.getElementById('wifi-screen');
  const hackerScreen = document.getElementById('hacker-screen');
  const wifiForm = document.getElementById('wifi-form');
  const wifiLoginInput = document.getElementById('wifi-login-input');
  const wifiLoginError = document.getElementById('wifi-login-error');
  const wifiPasswordInput = document.getElementById('wifi-password-input');
  const wifiTogglePass = document.getElementById('wifi-toggle-pass');
  const wifiError = document.getElementById('wifi-error');
  const wifiSubmitBtn = document.getElementById('wifi-submit-btn');

  // Elementos do DOM - Tela de Demonstração
  const terminalBody = document.getElementById('terminal-body');
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

  if (wifiLoginInput) {
    wifiLoginInput.focus();
  } else if (wifiPasswordInput) {
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

  // Limpar erro de login ao digitar
  if (wifiLoginInput) {
    wifiLoginInput.addEventListener('input', () => {
      if (wifiLoginError) wifiLoginError.classList.add('hidden');
      wifiLoginInput.classList.remove('error');
    });
  }

  // Limpar erro de senha ao digitar
  wifiPasswordInput.addEventListener('input', () => {
    wifiError.classList.add('hidden');
    wifiPasswordInput.classList.remove('error');
  });

  // Submissão do formulário de Wi-Fi
  wifiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredLogin = wifiLoginInput ? wifiLoginInput.value.trim() : '';
    const enteredPassword = wifiPasswordInput.value.trim().toLowerCase();

    let hasError = false;

    // Validação do Login
    const isLoginCorrect = enteredLogin !== '' && ACCEPTED_LOGINS.some(login => login.toLowerCase() === enteredLogin.toLowerCase());

    if (!isLoginCorrect) {
      if (wifiLoginError) {
        if (!enteredLogin) {
          wifiLoginError.textContent = '⚠️ Por favor, digite o login da rede.';
        } else {
          wifiLoginError.textContent = '⚠️ Login não reconhecido.';
        }
        wifiLoginError.classList.remove('hidden');
      }
      if (wifiLoginInput) {
        wifiLoginInput.classList.add('error');
        wifiLoginInput.classList.remove('shake');
        void wifiLoginInput.offsetWidth;
        wifiLoginInput.classList.add('shake');
        wifiLoginInput.focus();
      }
      hasError = true;
    } else {
      if (wifiLoginError) wifiLoginError.classList.add('hidden');
      if (wifiLoginInput) wifiLoginInput.classList.remove('error');
    }

    // Validação da Senha
    const isPasswordCorrect = enteredPassword !== '' && ACCEPTED_PASSWORDS.some(pwd => pwd.toLowerCase() === enteredPassword);

    if (!isPasswordCorrect) {
      wifiError.classList.remove('hidden');
      wifiPasswordInput.classList.add('error');
      wifiPasswordInput.classList.remove('shake');
      void wifiPasswordInput.offsetWidth;
      wifiPasswordInput.classList.add('shake');

      if (!hasError) {
        wifiPasswordInput.focus();
      }
      hasError = true;
    } else {
      wifiError.classList.add('hidden');
      wifiPasswordInput.classList.remove('error');
    }

    if (hasError) {
      initAudio();
      playTone(180, 0.2, 'sawtooth', 0.15);
      return;
    }

    // LOGIN E SENHA CORRETOS -> LEVA PARA A TELA "VOCÊ FOI HACKEADO"
    wifiError.classList.add('hidden');
    wifiPasswordInput.classList.remove('error');
    if (wifiLoginError) wifiLoginError.classList.add('hidden');
    if (wifiLoginInput) wifiLoginInput.classList.remove('error');
    triggerHackedScreen(enteredLogin);
  });

  // Transição para a tela "Você foi Hackeado"
  function triggerHackedScreen(capturedLogin = '') {
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

<<<<<<< HEAD
    // Dispara a apresentação dos logs educativos
=======
    // Dispara a simulação hacker
    detectDeviceInfo(capturedLogin);
>>>>>>> parent of 1052fc3 (v13)
    startLogs(capturedLogin);
  }

  // ============================================================
  // 3. TERMINAL E LOGS EDUCATIVOS
  // ============================================================
  function addLog(text, type = 'info') {
    if (!terminalBody) return;
    const p = document.createElement('p');
    p.className = `log-line ${type}`;
    p.innerHTML = `<span class="prompt">&gt;</span> <span>${text}</span>`;
    terminalBody.appendChild(p);
    terminalBody.scrollTop = terminalBody.scrollHeight;
    playTone(1200 + Math.random() * 400, 0.04, 'square', 0.04);
  }

  function startLogs(capturedLogin = '') {
    const credText = capturedLogin 
      ? `[!] CREDENCIAIS CAPTURADAS: Login "${capturedLogin}" | Senha interceptada!`
      : `[!] CREDENCIAIS CAPTURADAS: Senha WPA interceptada com sucesso!`;

<<<<<<< HEAD
    const demoLogs = [
      { text: '[+] Conexão demonstrativa estabelecida no portal Wi-Fi', type: 'info', delay: 300 },
      { text: credText, type: 'cyan', delay: 800 },
      { text: '[i] Demonstração educativa de segurança em andamento', type: 'info', delay: 1500 },
      { text: '[!] Em redes abertas sem criptografia, informações podem ficar visíveis', type: 'warn', delay: 2300 },
      { text: '[+] Proteja seus dados: desconfie de portais abertos desconhecidos', type: 'cyan', delay: 3100 },
      { text: '[i] Estande: FECART de Cibersegurança no 5º Andar', type: 'info', delay: 3900 },
      { text: '[+] Venha conversar conosco para aprender mais sobre segurança!', type: 'cyan', delay: 4700 }
=======
    const fakeLogs = [
      { text: '[+] Conexão Wi-Fi interceptada via Ponto de Acesso falso', type: 'info', delay: 300 },
      { text: credText, type: 'danger', delay: 800 },
      { text: '[+] Túnel reverso SSL criptografado ativo (Porta 443)', type: 'cyan', delay: 1400 },
      { text: '[!] ALERTA CRÍTICO: Dispositivo comprometido por rede falsa!', type: 'warn', delay: 2100 },
      { text: '[!] VÁ ATÉ A FECART DE CIBERSEGURANÇA NO 5º ANDAR PARA ENTENDER O QUE ACONTECEU!', type: 'danger', delay: 2900 },
      { text: '[!] ESTANDE DA FECART DE CIBERSEGURANÇA: 5º ANDAR', type: 'warn', delay: 3700 },
      { text: '[!] VÁ ATÉ A FECART DE CIBERSEGURANÇA NO 5º ANDAR PARA ENTENDER O QUE ACONTECEU!', type: 'danger', delay: 4500 },
      { text: '[+] Rastreamento ativo -> Estande FECART Cibersegurança, 5º Andar', type: 'cyan', delay: 5300 },
      { text: '[!] VÁ ATÉ A FECART DE CIBERSEGURANÇA NO 5º ANDAR PARA ENTENDER O QUE ACONTECEU!', type: 'danger', delay: 6100 },
      { text: '[!] INSTRUÇÃO FINAL: Vá até a FECART de Cibersegurança no 5º andar!', type: 'danger', delay: 6900 },
      { text: '[!] VÁ ATÉ A FECART DE CIBERSEGURANÇA NO 5º ANDAR PARA ENTENDER O QUE ACONTECEU!', type: 'danger', delay: 7700 }
>>>>>>> parent of 1052fc3 (v13)
    ];

    fakeLogs.forEach((item) => {
      setTimeout(() => {
        if (!isPrankRevealed && isHackedActive) {
          addLog(item.text, item.type);
        }
      }, item.delay);
    });
  }

  // ============================================================
<<<<<<< HEAD
  // 4. BOTÃO DE DICAS DE SEGURANÇA
=======
  // 5. BARRA DE PROGRESSO FICTÍCIA
>>>>>>> parent of 1052fc3 (v13)
  // ============================================================
  function startProgress() {
    if (progressInterval) clearInterval(progressInterval);
    if (!progressBar) return;
    progressInterval = setInterval(() => {
      if (isPrankRevealed || !isHackedActive) {
        clearInterval(progressInterval);
        return;
      }
      if (progress < 98) {
        progress += Math.floor(Math.random() * 6) + 3;
        if (progress > 98) progress = 98;
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progressPercent) progressPercent.textContent = `${progress}%`;

        if (progressStatus) {
          if (progress > 30 && progress < 60) {
            progressStatus.textContent = 'Enviando contatos e histórico do WhatsApp...';
          } else if (progress >= 60 && progress < 85) {
            progressStatus.textContent = 'Copiando galeria de fotos e documentos...';
          } else if (progress >= 85) {
            progressStatus.textContent = 'Criptografando chave mestra do dispositivo...';
          }
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
    panicBtn.innerHTML = '🚨 ERRO: FALHA AO INTERROMPER! BLOQUEIO ATIVO 🚨';
    document.body.style.filter = 'invert(1)';
    setTimeout(() => {
      document.body.style.filter = 'none';
    }, 150);

    addLog('[CRITICAL] Tentativa de interrupção manual detectada pelo firewall!', 'danger');
    addLog('[CRITICAL] VÁ ATÉ A FECART DE CIBERSEGURANÇA NO 5º ANDAR PARA ENTENDER O QUE ACONTECEU!', 'danger');
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
    if (terminalBody) terminalBody.innerHTML = '';
    progress = 0;
    if (progressBar) progressBar.style.width = '0%';
    if (progressPercent) progressPercent.textContent = '0%';
    if (progressStatus) progressStatus.textContent = 'Extraindo fotos e conversas...';
    panicBtn.disabled = false;
    panicBtn.style.background = '';
    panicBtn.innerHTML = '<span class="btn-icon">⚡</span> TENTAR INTERROMPER INVASÃO <span class="btn-icon">⚡</span>';

    // Oculta modal e tela hacker, volta para o Wi-Fi
    revealModal.classList.add('hidden');
    hackerScreen.classList.add('hidden');
    wifiScreen.classList.remove('hidden');

    // Reseta campos do Wi-Fi
    if (wifiLoginInput) {
      wifiLoginInput.value = '';
      wifiLoginInput.classList.remove('error');
      if (wifiLoginError) wifiLoginError.classList.add('hidden');
    }
    wifiPasswordInput.value = '';
    wifiError.classList.add('hidden');
    wifiPasswordInput.classList.remove('error');

    if (wifiLoginInput) {
      wifiLoginInput.focus();
    } else {
      wifiPasswordInput.focus();
    }
  });
});
