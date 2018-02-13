:: Copyright (c) Microsoft. All rights reserved.

@ECHO off & setlocal enableextensions enabledelayedexpansion

:: strlen("\scripts\") => 9
SET APP_HOME=%~dp0
SET APP_HOME=%APP_HOME:~0,-9%
if "%APP_HOME:~20%" == "" (
    echo Unable to detect current folder. Aborting.
    GOTO FAIL
)

:: Clean up folders containing temporary files
echo Removing temporary folders and files...
cd %APP_HOME%
IF %ERRORLEVEL% NEQ 0 GOTO FAIL

echo Removing \packages...
rmdir /s /q .\packages

echo Removing \target...
rmdir /s /q .\target

echo Removing \out...
rmdir /s /q .\out

echo Removing files in Services folder...
rmdir /s /q .\Services\bin
rmdir /s /q .\Services\obj
rmdir /s /q .\Services.Test\bin
rmdir /s /q .\Services.Test\obj

echo Removing files in WebService folder...
rmdir /s /q .\WebService\bin
rmdir /s /q .\WebService\obj
rmdir /s /q .\WebService.Test\bin
rmdir /s /q .\WebService.Test\obj

echo Removing files in SimulationAgent folder...
rmdir /s /q .\SimulationAgent\bin
rmdir /s /q .\SimulationAgent\obj
rmdir /s /q .\SimulationAgent.Test\bin
rmdir /s /q .\SimulationAgent.Test\obj

echo Done.

:: - - - - - - - - - - - - - -
goto :END

:FAIL
    echo Command failed
    endlocal
    exit /B 1

:END
endlocal
