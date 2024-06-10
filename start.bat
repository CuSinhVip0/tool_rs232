@echo off
cd C:/
cd tool_rs232
call npm stop
call npm start

echo "Node build successfully"
pause