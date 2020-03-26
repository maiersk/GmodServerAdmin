@echo off
echo ========================install=============================
echo ===== exec process
echo ===== 1. set the config file
echo ===== 2. will be install project need module
echo ===== 3. an insert need database

REM 设置默认值
set port=80
set host=localhost
set user=root
set password=none
set database=server_admin
set screenshotpath=/screenshot/
set steamapikey=none

REM 设置输入各参
echo set the config file
set /p port=input to set webside port or default(80):
set /p host=input to set mysql host or default(localhost):
set /p user=input to set mysql user or default(root):
set /p password=input to set mysql password:
set /p database=input to set webside database or default(server_admin):
set /p screenshotpath=input to set screenshotpath or default(/screenshot/):
set /p steamapikey=input to set steamapikey or default:

call node install.js cfg %port% %host% %user% %password% %database% %screenshotpath% %steamapikey%

echo install project need module
::pause
call npm i mysql express express-session express-formidable

echo insert need database
::pause
call node install.js setup

echo install succeed
pause