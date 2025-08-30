@echo off
echo Запуск приложения "Ротация Вопросов"...
echo.
echo Убедитесь, что у вас установлен Node.js!
echo Если не установлен, скачайте с сайта: https://nodejs.org/
echo.
pause
echo.
echo Устанавливаем зависимости...
npm install
echo.
echo Запускаем приложение...
echo Приложение откроется в браузере автоматически
echo Если не открылось, перейдите по адресу: http://localhost:3000
echo.
echo Для остановки приложения нажмите Ctrl+C
echo.
npm run dev
pause 