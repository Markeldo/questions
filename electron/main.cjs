const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = process.env.NODE_ENV === "development";

function createWindow() {
  // Создаем окно браузера
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.cjs"),
      // Разрешаем Node.js модули в preload скрипте
      sandbox: false,
    },
    icon: path.join(__dirname, "../public/icon.png"), // Опционально: иконка приложения
    title: "Questions Roulette",
  });

  // Загружаем приложение
  if (isDev) {
    // В режиме разработки загружаем Vite dev server
    mainWindow.loadURL("http://localhost:5173");
    // Открываем DevTools в режиме разработки
    mainWindow.webContents.openDevTools();
  } else {
    // В продакшене загружаем собранные файлы
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
    // DevTools отключены в продакшене
  }

  // Обработка закрытия окна
  mainWindow.on("closed", () => {
    // В macOS приложения обычно остаются активными даже когда все окна закрыты
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
}

// Этот метод будет вызван когда Electron закончит инициализацию
// и будет готов создавать окна браузера
app.whenReady().then(createWindow);

// Выходим когда все окна закрыты
app.on("window-all-closed", () => {
  // В macOS приложения обычно остаются активными даже когда все окна закрыты
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // В macOS обычно пересоздают окно в приложении когда иконка в доке нажата
  // и нет других открытых окон
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// В этом файле можно включить остальную часть кода главного процесса приложения
// Также можно поместить их в отдельные файлы и подключить здесь
