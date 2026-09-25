@echo off
title Servidor FECART - QrCode Offline
cd /d "%~dp0"

echo ========================================================
echo       INICIANDO SERVIDOR OFFLINE FECART
echo ========================================================
echo.
echo 1. Certifique-se de estar conectado no Wi-Fi da FECART
echo 2. O navegador vai abrir sozinho com o QR Code na tela
echo 3. Para encerrar, basta fechar esta janela preta.
echo.
echo ========================================================
echo.

python server.py

pause
