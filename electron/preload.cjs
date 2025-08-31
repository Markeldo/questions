const { contextBridge, ipcRenderer } = require("electron");
const fs = require("fs");
const path = require("path");

// Безопасно экспортируем API в контекст рендерера
contextBridge.exposeInMainWorld("electronAPI", {
  // Загрузка файла questions.json
  loadQuestions: async () => {
    try {
      // Список возможных путей для поиска файла
      const possiblePaths = [
        // Режим разработки
        path.join(__dirname, "../src/data/questions.json"),
        // Собранное приложение - рядом с исполняемым файлом
        path.join(path.dirname(process.execPath), "questions.json"),
        // Альтернативные пути
        path.join(process.cwd(), "questions.json"),
        path.join(process.cwd(), "src/data/questions.json"),
        // Путь через resources (если файл там)
        path.join(process.resourcesPath, "questions.json"),
        path.join(process.resourcesPath, "src/data/questions.json"),
      ];

      // Ищем файл по всем возможным путям
      for (const filePath of possiblePaths) {
        if (fs.existsSync(filePath)) {
          try {
            const data = fs.readFileSync(filePath, "utf8");
            const questions = JSON.parse(data);
            console.log(`Файл questions.json найден по пути: ${filePath}`);
            return [filePath, ...questions];
          } catch (parseError) {
            console.error(`Ошибка парсинга файла ${filePath}:`, parseError);
            continue;
          }
        }
      }

      // Если файл не найден, попробуем найти его в папке с исполняемым файлом
      try {
        const execDir = path.dirname(process.execPath);
        const files = fs.readdirSync(execDir);

        if (files.includes("questions.json")) {
          const directPath = path.join(execDir, "questions.json");
          const data = fs.readFileSync(directPath, "utf8");
          const questions = JSON.parse(data);
          console.log(
            `Файл questions.json найден в папке приложения: ${directPath}`
          );
          return [directPath, ...questions];
        }
      } catch (err) {
        console.error("Ошибка поиска в папке приложения:", err.message);
      }

      console.error(
        "Файл questions.json не найден ни в одном из ожидаемых мест"
      );
      return [];
    } catch (error) {
      console.error("Ошибка загрузки questions.json:", error);
      return [];
    }
  },

  // Проверка существования файла questions.json
  checkQuestionsFile: () => {
    try {
      const possiblePaths = [
        path.join(__dirname, "../src/data/questions.json"),
        path.join(path.dirname(process.execPath), "questions.json"),
        path.join(process.cwd(), "questions.json"),
        path.join(process.cwd(), "src/data/questions.json"),
        path.join(process.resourcesPath, "questions.json"),
        path.join(process.resourcesPath, "src/data/questions.json"),
      ];

      return possiblePaths.some((filePath) => fs.existsSync(filePath));
    } catch (error) {
      return false;
    }
  },

  // Получение пути к файлу questions.json
  getQuestionsPath: () => {
    const possiblePaths = [
      path.join(__dirname, "../src/data/questions.json"),
      path.join(path.dirname(process.execPath), "questions.json"),
      path.join(process.cwd(), "questions.json"),
      path.join(process.cwd(), "src/data/questions.json"),
      path.join(process.resourcesPath, "questions.json"),
      path.join(process.resourcesPath, "src/data/questions.json"),
    ];

    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    }

    return "questions.json не найден";
  },
});
