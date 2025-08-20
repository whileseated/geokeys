import React, { useState, useEffect } from 'react'
import { Button } from './components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card'
import GameQuestion from './components/GameQuestion'
import GameResults from './components/GameResults'
import Leaderboard from './components/Leaderboard'
import Footer from './components/Footer'

const API_BASE = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api'

const App = () => {
  const [gameState, setGameState] = useState('menu') // menu, playing, results, leaderboard
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [currentRound, setCurrentRound] = useState(1)
  const [gameResults, setGameResults] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(false)
  
  const commitHash = typeof __GIT_COMMIT_HASH__ !== 'undefined' ? __GIT_COMMIT_HASH__ : 'dev'

  const fetchQuestion = async () => {
    try {
      const response = await fetch(`${API_BASE}/question`)
      const data = await response.json()
      setCurrentQuestion(data)
    } catch (error) {
      console.error('Failed to fetch question:', error)
    }
  }

  const fetchLeaderboard = () => {
    try {
      const stored = localStorage.getItem('geokeys-leaderboard')
      const data = stored ? JSON.parse(stored) : []
      // Sort by score desc, then by correct answers desc, then by time asc
      data.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        if (b.correct_answers !== a.correct_answers) return b.correct_answers - a.correct_answers
        return a.total_time - b.total_time
      })
      setLeaderboard(data.slice(0, 10)) // Top 10
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
      setLeaderboard([])
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
      // Add timestamp and ID for localStorage
      const scoreWithId = {
        ...scoreData,
        id: Date.now(),
        timestamp: new Date().toISOString()
      }
      
      // Save to localStorage
      const stored = localStorage.getItem('geokeys-leaderboard')
      const currentScores = stored ? JSON.parse(stored) : []
      currentScores.push(scoreWithId)
      localStorage.setItem('geokeys-leaderboard', JSON.stringify(currentScores))
      
      // Also try to submit to API (for future database integration)
      try {
        await fetch(`${API_BASE}/submit-score`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(scoreData),
        })
      } catch (apiError) {
        console.log('API submission failed (expected in free version):', apiError)
      }
      
      fetchLeaderboard()
    } catch (error) {
      console.error('Failed to submit score:', error)
      throw error
    }
  }

  const showLeaderboard = () => {
    setLoading(true)
    fetchLeaderboard()
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
        <Footer commitHash={commitHash} />
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
        <Footer commitHash={commitHash} />
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
        <Footer commitHash={commitHash} />
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
        <Footer commitHash={commitHash} />
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