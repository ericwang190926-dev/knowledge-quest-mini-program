#!/bin/zsh
cd "$(dirname "$0")"

echo "正在启动三国知识闯关..."
echo "如果浏览器没有自动打开，请访问：http://127.0.0.1:5173/"

npm run dev -- --port 5173 &
SERVER_PID=$!

sleep 2
open "http://127.0.0.1:5173/"

wait $SERVER_PID
