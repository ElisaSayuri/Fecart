import http.server
import socket
import socketserver
import os
import sys

# Configurar stdout para UTF-8 no Windows para suportar caracteres especiais e QR no terminal
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# Definir porta padrão
PORT = 8080

def get_local_ip():
    """Detecta o IP local da máquina na rede Wi-Fi/Ethernet."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Tenta conectar a um IP externo arbitrário para descobrir a interface de saída
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        try:
            ip = socket.gethostbyname(socket.gethostname())
        except Exception:
            ip = "127.0.0.1"
    finally:
        s.close()
    return ip

def generate_qr(target_url, output_file="qrcode.png"):
    """Gera o arquivo de imagem do QR Code e exibe no terminal."""
    try:
        import qrcode
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=10,
            border=4,
        )
        qr.add_data(target_url)
        qr.make(fit=True)

        # Salva imagem PNG
        img = qr.make_image(fill_color="black", back_color="white")
        img.save(output_file)
        print(f"\n[+] QR Code salvo com sucesso em: {os.path.abspath(output_file)}")

        # Imprime no terminal se suportado
        print("\n" + "=" * 50)
        print(" ESCANEIE O QR CODE ABAIXO COM A CÂMERA DO CELULAR:")
        print("=" * 50 + "\n")
        try:
            qr.print_ascii(invert=True)
        except Exception:
            pass
    except ImportError:
        print("\n[!] O pacote 'qrcode' não foi encontrado. Para gerar a imagem PNG localmente:")
        print("    pip install qrcode pillow")

def run_server(port=PORT):
    """Inicia o servidor HTTP local."""
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    local_ip = get_local_ip()
    target_url = f"http://{local_ip}:{port}/index.html"
    local_url = f"http://localhost:{port}/index.html"
    generator_url = f"http://localhost:{port}/generator.html"

    # Se argumento --test for passado, apenas gera o QR e sai
    if "--test" in sys.argv:
        generate_qr(target_url)
        print("\n[✓] Modo de teste executado com sucesso.")
        return

    generate_qr(target_url)

    handler = http.server.SimpleHTTPRequestHandler
    
    # Permitir reuso da porta
    socketserver.TCPServer.allow_reuse_address = True
    
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            print("\n" + "=" * 50)
            print("🚀 SERVIDOR ATIVO E PRONTO PARA A PEGADINHA!")
            print("=" * 50)
            print(f"📱 Link para o Celular (mesmo Wi-Fi): {target_url}")
            print(f"💻 Link no seu Computador:            {local_url}")
            print(f"⚙️  Gerador de QR Code personalizado:  {generator_url}")
            print(f"🖼️  Arquivo de imagem gerado:         qrcode.png")
            print("=" * 50)
            print("\nPressione Ctrl + C para encerrar o servidor.\n")
            httpd.serve_forever()
    except OSError as e:
        if "Address already in use" in str(e) or e.errno == 10048:
            print(f"\n[!] A porta {port} já está em uso. Tentando a porta {port + 1}...")
            run_server(port + 1)
        else:
            raise e
    except KeyboardInterrupt:
        print("\n[+] Servidor finalizado com sucesso.")

if __name__ == "__main__":
    run_server()
