@echo off
chcp 65001 >nul
title Automatizador Git
color 0B

echo ===================================================
echo             AUTOMATIZADOR DE GITHUB
echo ===================================================
echo Pasta atual detectada: %cd%
echo.
echo O que voce deseja fazer?
echo [1] Atualizar site existente (Dia a dia)
echo [2] Subir um NOVO site (Configuracao do zero)
echo ===================================================
set /p opcao="Digite 1 ou 2 e aperte Enter: "

if "%opcao%"=="1" goto atualizar
if "%opcao%"=="2" goto novo
echo.
echo Opcao invalida! Fechando...
pause
exit

:atualizar
echo.
echo --- ATUALIZANDO SITE ---
set /p msg="O que voce mudou? (Ex: troquei a foto): "
if "%msg%"=="" set msg="Atualizacao de arquivos"
echo.
echo Trabalhando... (Isso pode levar alguns segundos)
git add .
git commit -m "%msg%"
git push
echo.
echo ===================================================
echo PRONTO! Arquivos atualizados no GitHub.
echo Va para o Easypanel e clique em 'Implantar'.
echo ===================================================
pause
exit

:novo
echo.
echo --- CONFIGURANDO NOVO SITE ---
echo Liberando permissoes de seguranca do disco...
git config --global --add safe.directory "*"
git init
echo.
set /p url="Cole aqui o link do repositorio do GitHub (https://...): "
echo.
echo Trabalhando... (Isso pode levar alguns segundos)
git add .
git commit -m "Primeira versao do projeto"
git branch -M main
git remote add origin %url%
git push -u -f origin main
echo.
echo ===================================================
echo PRONTO! Site novo configurado e enviado ao GitHub.
echo ===================================================
pause
exit