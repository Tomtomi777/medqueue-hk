
@echo off

cd /d "%~dp0"

title MedQueue HK

echo ================================
echo        MedQueue HK
echo ================================
echo.
echo Open http://localhost:8080
echo Press Ctrl+C to stop.
echo.

java -jar medqueue-hk.jar

pause
