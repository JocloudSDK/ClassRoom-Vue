set workDir=%~dp0
cd %workDir%
cd ..

echo dist-calling...
CALL npm run build:win
if ERRORLEVEL 1 (
   echo dist-failed!
   exit /b 22
)

echo dist-successed.

mkdir bin\release
xcopy /q /e .\artifacts\* .\bin\release
echo copy-successed.

rd /s /q artifacts\win-ia32-unpacked
del artifacts\*.blockmap
del artifacts\*.yaml

exit /b ERRORLEVEL
