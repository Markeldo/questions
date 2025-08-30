import { useState, useEffect, useRef } from 'react'
import questionsData from './data/questions.json'
import './App.css'

function App() {
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [isSpinning, setIsSpinning] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)
  const intervalRef = useRef(null)
  const SPIN_SPEED = 50 // Константа для постоянной скорости ротации

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
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

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
        </div>

        {isSpinning && (
          <div className="spinning-indicator">
            <div className="spinner"></div>
            <p>Крутим вопросы...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App 