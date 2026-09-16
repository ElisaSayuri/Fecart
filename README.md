# 📱 Projeto QR Code: "Você foi hackeado!" (Prank & Conscientização)

Aplicação interativa que simula uma invasão hacker cinematográfica ao escanear um QR Code, seguida de uma mensagem bem-humorada de conscientização sobre segurança digital e ataques de **Quishing** (QR Code Phishing).

---

## 🚀 Como Usar Rapidamente

### 1. Iniciar Servidor Local e Gerar QR Code Automático

Abra o terminal na pasta do projeto e execute:

```bash
python server.py
```

O script irá:
1. Detectar o endereço de IP do seu computador na sua rede Wi-Fi local.
2. Salvar a imagem **`qrcode.png`** na pasta do projeto.
3. Exibir o **QR Code diretamente no terminal** para você escanear na hora com seu celular!
4. Iniciar o servidor HTTP local na porta `8080`.

---

## 🌐 Opções de Acesso

| Destino | URL | Descrição |
| :--- | :--- | :--- |
| **📱 No Celular** | `http://<SEU_IP_LOCAL>:8080/index.html` | Para celulares conectados na mesma rede Wi-Fi |
| **💻 No Computador** | `http://localhost:8080/index.html` | Para testar diretamente no navegador |
| **⚙️ Gerador de QR** | `http://localhost:8080/generator.html` | Interface para personalizar e baixar novos QR Codes |

---

## 🖨️ Como Usar o Gerador de QR Code (`generator.html`)

Se você quiser criar um QR Code apontando para uma URL pública ou imprimir em papel:
1. Abra `generator.html` no seu navegador.
2. Insira a URL desejada (ou clique em *"Usar URL desta aplicação"*).
3. Selecione o tamanho desejado (Pequeno, Médio ou Grande para impressão).
4. Clique em **"Baixar Imagem (PNG)"** ou aponte a câmera para testar na tela!

---

## 🌍 Como Publicar na Internet (Acesso de Qualquer Lugar)

Como o projeto é composto por arquivos estáticos (**HTML**, **CSS**, **JavaScript**), você pode publicá-lo gratuitamente em menos de 2 minutos:

### Opção A: GitHub Pages
1. Crie um repositório no GitHub e envie os arquivos da pasta (`index.html`, `style.css`, `script.js`, `generator.html`, `qrcode.min.js`).
2. Acesse **Settings** > **Pages** e selecione a branch `main`.
3. Copie a URL pública gerada e use o `generator.html` para criar o QR Code definitivo.

### Opção B: Vercel ou Netlify
1. Arraste a pasta do projeto diretamente para o painel da [Vercel](https://vercel.com) ou [Netlify](https://www.netlify.com).
2. O site estará online imediatamente com link seguro `https://`.

---

## 🛡️ O que a simulação faz?

1. **Tela de Entrada ("Wi-Fi Grátis"):**
   - Simula um portal cautivo/tela de login para conexão Wi-Fi aberta no evento.
   - O usuário precisa digitar a senha da rede.
   - **Senhas Aceitas por padrão:** `fecart`, `fecart2024`, `fecart2025`, `fecart2026`, `ciberseguranca`, `12345678`, `wifi123` *(editável no início do arquivo `script.js`)*.
   - Caso digite uma senha incorreta: exibe a mensagem **"Senha incorreta"** com animação de vibração (*shake*).
   - Caso acerte a senha: leva o usuário instantaneamente para a tela de invasão!

2. **Tela "Você foi Hackeado!":**
   - **Efeito Visual Hacker:** Chuva de caracteres Matrix no fundo, scanlines retrô de monitor CRT e alertas pulsantes.
   - **Detecção do Aparelho:** Identifica se a vítima está em um iPhone, Android, Windows ou Mac através do navegador.
   - **Áudio Sintetizado:** Bips de terminal e sirene de alarme gerados via Web Audio API.
   - **Alerta da FECART:** Substituindo o temporizador antigo, um card em destaque alerta a vítima para ir até o estande da **FECART de Cibersegurança** para entender o golpe.
   - **Botão de Pânico / Conscientização:** Permite acionar o modal educativo sobre Quishing e redes falsas, com botão para reiniciar a brincadeira.
