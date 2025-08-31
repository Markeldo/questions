import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [isSpinning, setIsSpinning] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)
  const [questionsData, setQuestionsData] = useState([])
  const [questionsPath, setQuestionsPath] = useState('Неизвестное место')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)
  const SPIN_SPEED = 50 // Константа для постоянной скорости ротации

  // Функция загрузки вопросов
  const loadQuestions = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Проверяем, доступен ли Electron API
      if (window.electronAPI) {
        const [path, ...questions] = await window.electronAPI.loadQuestions()
        setQuestionsData(questions)
        setQuestionsPath(path)
        
        if (questions.length === 0) {
          setError('Файл questions.json пуст или не найден')
        }
      } else {
        // Fallback для веб-версии (если нужно)
        try {
          const response = await fetch('/src/data/questions.json')
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const questions = await response.json()
          setQuestionsData(questions)
        } catch (fetchError) {
          console.error('Ошибка fetch:', fetchError)
          setError('Ошибка загрузки файла questions.json')
          setQuestionsData([])
        }
      }
    } catch (err) {
      console.error('Ошибка загрузки вопросов:', err)
      setError('Ошибка загрузки файла questions.json')
      setQuestionsData([])
    } finally {
      setIsLoading(false)
    }
  }

  const startSpinning = () => {
    setIsSpinning(true)
    setShowQuestion(false)
    
    intervalRef.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * questionsData.length)
      setCurrentQuestion(questionsData[randomIndex])
    }, SPIN_SPEED)
  }

  const stopSpinning = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsSpinning(false)
    setShowQuestion(true)
  }

  const restart = () => {
    setShowQuestion(false)
    setCurrentQuestion('')
    setIsSpinning(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }



  useEffect(() => {
    // Загружаем вопросы при запуске приложения
    loadQuestions()
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Если загружается
  if (isLoading) {
    return (
      <div className="app">
        <div className="container">
          <h1 className="title">🎯 Ротация Вопросов</h1>
          <div className="loading">
            <div className="spinner"></div>
            <p>Загружаем вопросы...</p>
          </div>
          <p>Путь к файлу: {questionsPath}</p>
        </div>
      </div>
    )
  }

  // Если ошибка загрузки
  if (error) {
    return (
      <div className="app">
        <div className="container">
          <h1 className="title">🎯 Ротация Вопросов</h1>
          <div className="error">
            <h2>❌ Ошибка загрузки</h2>
            <p>{error}</p>
            <button className="btn btn-restart" onClick={loadQuestions}>
              🔄 Попробовать снова
            </button>
          </div>
          <p>Путь к файлу: {questionsPath}</p>
        </div>
      </div>
    )
  }

  // Если нет вопросов
  if (questionsData.length === 0) {
    return (
      <div className="app">
        <div className="container">
          <h1 className="title">🎯 Ротация Вопросов</h1>
          <div className="error">
            <h2>📝 Нет вопросов</h2>
            <p>Файл questions.json пуст или не найден</p>
            <button className="btn btn-restart" onClick={loadQuestions}>
              🔄 Обновить
            </button>
          </div>
          <p>Путь к файлу: {questionsPath}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">🎯 Ротация Вопросов</h1>
        
        <div className="question-display">
          {showQuestion && currentQuestion ? (
            <div className="final-question">
              <h2>Ваш вопрос:</h2>
              <p className="question-text final">{currentQuestion}</p>
            </div>
          ) : (
            <div className="spinning-question">
              <h2>Вопрос:</h2>
              <p className="question-text spinning">
                {currentQuestion || 'Нажмите "Пуск" для начала'}
              </p>
            </div>
          )}
        </div>

        <div className="controls">
          {!isSpinning && !showQuestion && (
            <button 
              className="btn btn-start" 
              onClick={startSpinning}
            >
              🚀 Пуск
            </button>
          )}
          
          {isSpinning && (
            <button 
              className="btn btn-stop" 
              onClick={stopSpinning}
            >
              ⏹️ Стоп
            </button>
          )}
          
          {showQuestion && (
            <button 
              className="btn btn-restart" 
              onClick={restart}
            >
              🔄 Запустить заново
            </button>
          )}
          
          <button 
            className="btn btn-refresh" 
            onClick={loadQuestions}
            title="Обновить вопросы из файла"
          >
            📄 Обновить вопросы
          </button>
        </div>

        {isSpinning && (
          <div className="spinning-indicator">
            <div className="spinner"></div>
            <p>Крутим вопросы...</p>
          </div>
        )}
      </div>
      <p>Путь к файлу: {questionsPath}</p>
    </div>
  )
}

export default App 