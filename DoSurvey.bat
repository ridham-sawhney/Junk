@echo off
setlocal

rem Fetch the directory of the currently executing batch script
set "scriptDir=%~dp0"

rem Your additional commands here
echo Welcome! Click {Ctrl+Click} on the below link !
cd /d "%scriptDir%"
call node main1.js