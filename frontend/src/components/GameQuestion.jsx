import React, { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import QwertyKeyboard from './QwertyKeyboard'

const GameQuestion = ({ question, onAnswer, roundNumber, totalRounds }) => {
  const [userInput, setUserInput] = useState('')
  const [filteredChoices, setFilteredChoices] = useState(question.choices)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isAutoCompleted, setIsAutoCompleted] = useState(false)
  const [showResult, setShowResult] = useState(null) // 'correct' | 'incorrect' | null
  const [isMobile, setIsMobile] = useState(false)
  const inputRef = useRef(null)

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnswered) {
        setTimeElapsed(prev => prev + 0.1)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [isAnswered])

  useEffect(() => {
    // Reset state for new question
    setUserInput('')
    setTimeElapsed(0)
    setIsAnswered(false)
    setIsAutoCompleted(false)
    setShowResult(null)
    setFilteredChoices(question.choices)
    
    // Reset focus/active states on mobile buttons
    if (isMobile) {
      // Blur any currently focused element to reset button states
      if (document.activeElement) {
        document.activeElement.blur()
      }
    } else {
      // Focus input when component mounts or question changes on desktop
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 100)
    }
  }, [question, isMobile])

  useEffect(() => {
    if (userInput === '') {
      setFilteredChoices(question.choices)
      setIsAutoCompleted(false)
    } else {
      const filtered = question.choices.filter(choice => 
        choice.toLowerCase().startsWith(userInput.toLowerCase())
      )
      setFilteredChoices(filtered)
      
      // Auto-complete when only one choice remains
      if (filtered.length === 1 && userInput.toLowerCase() !== filtered[0].toLowerCase()) {
        setUserInput(filtered[0])
        setIsAutoCompleted(true)
      }
    }
  }, [userInput, question.choices])

  const handleSubmit = () => {
    if (filteredChoices.length === 1) {
      setIsAnswered(true)
      const selectedAnswer = filteredChoices[0]
      const isCorrect = selectedAnswer === question.correct_answer
      
      // Show animation first
      setShowResult(isCorrect ? 'correct' : 'incorrect')
      
      // Call onAnswer after animation delay
      setTimeout(() => {
        onAnswer({
          answer: selectedAnswer,
          correct: isCorrect,
          timeElapsed: parseFloat(timeElapsed.toFixed(1))
        })
      }, 1200) // 1.2 second delay for animation
    }
  }

  const handleInputChange = (e) => {
    const newValue = e.target.value
    
    // If auto-completed, only allow if the new value is shorter (backspace)
    if (isAutoCompleted) {
      if (newValue.length < userInput.length) {
        setUserInput(newValue)
        setIsAutoCompleted(false)
      }
      // Ignore other input when auto-completed
      return
    }
    
    setUserInput(newValue)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && filteredChoices.length === 1) {
      handleSubmit()
    }
  }

  const handleMobileStateSelect = (selectedState) => {
    if (isAnswered) return
    
    setIsAnswered(true)
    const isCorrect = selectedState === question.correct_answer
    
    // Show animation first
    setShowResult(isCorrect ? 'correct' : 'incorrect')
    
    // Call onAnswer after animation delay
    setTimeout(() => {
      onAnswer({
        answer: selectedState,
        correct: isCorrect,
        timeElapsed: parseFloat(timeElapsed.toFixed(1))
      })
    }, 1200)
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">      
      <Card className="relative">
      {/* Animation Overlay */}
      {showResult && (
        <div className={`absolute inset-0 z-10 flex items-center justify-center rounded-lg ${
          showResult === 'correct' 
            ? 'bg-green-500 bg-opacity-90' 
            : 'bg-red-500 bg-opacity-90'
        }`}>
          <div className="text-center text-white">
            {showResult === 'correct' ? (
              <>
                <div className="text-8xl mb-4 animate-bounce">🎉</div>
                <div className="text-4xl font-bold">CORRECT!</div>
                <div className="text-xl mt-2">Great job!</div>
              </>
            ) : (
              <>
                <div className="text-8xl mb-4 animate-bounce">😅</div>
                <div className="text-4xl font-bold">OOPS!</div>
                <div className="text-xl mt-2">The correct answer was: {question.correct_answer}</div>
              </>
            )}
          </div>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-center">
          Round {roundNumber} of {totalRounds}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-lg font-mono text-gray-400 mb-4">
            {timeElapsed.toFixed(1)}s
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-4xl font-bold mb-2">{question.city}</h2>
          <p className="text-lg text-muted-foreground">{question.county}</p>
        </div>

        {isMobile ? (
          // Mobile interface: Tap state buttons
          <div className="space-y-4">
            <div className="text-center text-sm text-muted-foreground mb-4">
              📱 Tap the correct state below
            </div>
            <div className="grid grid-cols-2 gap-3">
              {question.choices.map((choice) => (
                <Button
                  key={choice}
                  variant="outline"
                  className="text-left justify-center py-4 text-lg font-medium hover:bg-blue-50 hover:border-blue-300 transition-colors focus:outline-none active:scale-95"
                  disabled={isAnswered}
                  onClick={(e) => {
                    handleMobileStateSelect(choice)
                    // Immediately blur the button to prevent persistent focus state
                    e.target.blur()
                  }}
                >
                  {choice}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          // Desktop interface: Typing with filtering
          <div className="space-y-4">
            <Input
              ref={inputRef}
              placeholder="Start typing to filter states..."
              value={userInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isAnswered}
              className={`text-lg ${isAutoCompleted ? 'border-green-500 bg-green-50 text-green-800' : ''}`}
            />

            <div className="grid grid-cols-2 gap-2 grid-rows-2 h-24">
              {filteredChoices.slice(0, 4).map((choice, index) => (
                <Button
                  key={index}
                  variant={filteredChoices.length === 1 ? "default" : "outline"}
                  className={`text-left justify-start ${
                    isAutoCompleted && filteredChoices.length === 1 
                      ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                      : ''
                  }`}
                  disabled={isAnswered}
                  onClick={() => {
                    if (filteredChoices.length === 1) {
                      handleSubmit()
                    }
                  }}
                >
                  {choice}
                </Button>
              ))}
            </div>

            {filteredChoices.length === 0 && (
              <div className="text-center text-muted-foreground mt-4">
                No states match your input
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
      {!isMobile && <QwertyKeyboard />}

    </div>
  )
}

export default GameQuestion