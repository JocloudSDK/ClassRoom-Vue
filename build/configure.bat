set workDir=%~dp0
cd %workDir%
cd ..
CALL rm -rf package-lock.json
CALL rm -rf yarn.lock
CALL npm install
CALL npm install electron@5.0.8 --platform=win32 --arch=ia32
EXIT 0
