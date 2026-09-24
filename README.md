# 📱 Projeto QR Code: Demonstração e Conscientização FECART Cibersegurança

Aplicação interativa que simula uma conexão a uma rede Wi-Fi para fins didáticos, seguida de uma apresentação informativa sobre segurança digital, conscientização sobre redes públicas e proteção contra **Quishing** (QR Code Phishing).

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

## 🛡️ O que a demonstração faz?

1. **Tela de Entrada ("Wi-Fi Grátis"):**
   - Simula um portal cautivo/tela de login para conexão Wi-Fi no evento.
   - O usuário precisa informar o **Login** e a **Senha da rede**.
   - **Login Configurado:** `FECART_5_andar` *(editável no início do arquivo `script.js`)*.
   - **Senha Configurada:** `F*@c#19_-F8..` *(editável no início do arquivo `script.js`)*.
   - Caso deixe campos vazios ou informe dados incorretos: exibe avisos de erro dedicados e animação de vibração (*shake*).
   - Ao preencher o login e a senha correta: os dados avançam para a tela demonstrativa de segurança digital.

2. **Tela de Demonstração de Segurança:**
   - **Terminal Informativo:** Exibe logs didáticos em tempo real alertando sobre boas práticas e riscos em redes abertas.
   - **Áudio Sintetizado:** Tons sutis e agradáveis via Web Audio API.
   - **Estande da FECART:** Card convidando os participantes a visitarem a **FECART de Cibersegurança no 5º andar** para aprender sobre privacidade e proteção digital.
   - **Botão de Dicas de Segurança:** Abre um modal educativo com orientações práticas contra redes abertas e Quishing, permitindo reiniciar a demonstração.
