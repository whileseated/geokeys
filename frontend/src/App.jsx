import React, { useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card'
import GameQuestion from './components/GameQuestion'
import GameResults from './components/GameResults'
import Leaderboard from './components/Leaderboard'

const API_BASE = 'http://localhost:5000/api'

const App = () => {
  const [gameState, setGameState] = useState('menu') // menu, playing, results, leaderboard
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [currentRound, setCurrentRound] = useState(1)
  const [gameResults, setGameResults] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchQuestion = async () => {
    try {
      const response = await fetch(`${API_BASE}/question`)
      const data = await response.json()
      setCurrentQuestion(data)
    } catch (error) {
      console.error('Failed to fetch question:', error)
    }
  }

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_BASE}/leaderboard`)
      const data = await response.json()
      setLeaderboard(data)
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
    }
  }

  const startGame = async () => {
    setGameState('playing')
    setCurrentRound(1)
    setGameResults([])
    await fetchQuestion()
  }

  const handleAnswer = async (result) => {
    const newResults = [...gameResults, result]
    setGameResults(newResults)

    setTimeout(async () => {
      if (currentRound < 10) {
        setCurrentRound(currentRound + 1)
        await fetchQuestion()
      } else {
        setGameState('results')
      }
    }, 1500)
  }

  const submitScore = async (scoreData) => {
    try {
      await fetch(`${API_BASE}/submit-score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scoreData),
      })
      await fetchLeaderboard()
    } catch (error) {
      console.error('Failed to submit score:', error)
      throw error
    }
  }

  const showLeaderboard = async () => {
    setLoading(true)
    await fetchLeaderboard()
    setGameState('leaderboard')
    setLoading(false)
  }

  const showLeaderboardFromResults = async () => {
    await fetchLeaderboard()
    setGameState('leaderboard')
  }

  const goToMenu = () => {
    setGameState('menu')
  }

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-2xl">GeoKeys</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Guess which state each city is in as fast as you can!
            </p>
            <div className="space-y-2">
              <Button onClick={startGame} className="w-full" size="lg">
                Start New Game
              </Button>
              <Button
                onClick={showLeaderboard}
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'View Leaderboard'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (gameState === 'playing' && currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <GameQuestion
          question={currentQuestion}
          onAnswer={handleAnswer}
          roundNumber={currentRound}
          totalRounds={10}
        />
      </div>
    )
  }

  if (gameState === 'results') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <GameResults
          results={gameResults}
          onSubmitScore={submitScore}
          onPlayAgain={startGame}
          onViewLeaderboard={showLeaderboardFromResults}
        />
      </div>
    )
  }

  if (gameState === 'leaderboard') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="space-y-4 w-full max-w-2xl">
          <Leaderboard scores={leaderboard} />
          <Button onClick={goToMenu} className="w-full">
            Back to Menu
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>
  )
}

export default App