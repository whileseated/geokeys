import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'

const GameResults = ({ results, onSubmitScore, onPlayAgain, onViewLeaderboard }) => {
  const [playerName, setPlayerName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const totalTime = results.reduce((sum, result) => sum + result.timeElapsed, 0)
  const correctAnswers = results.filter(result => result.correct).length
  const score = Math.max(0, (correctAnswers * 1000) - Math.floor(totalTime * 10))

  const handleSubmitScore = async () => {
    if (!playerName.trim()) return
    
    setIsSubmitting(true)
    try {
      await onSubmitScore({
        player_name: playerName,
        score: score,
        total_time: totalTime,
        correct_answers: correctAnswers
      })
      setSubmitted(true)
    } catch (error) {
      console.error('Failed to submit score:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Game Complete!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-primary">{correctAnswers}/10</div>
          <div className="text-lg">Correct Answers</div>
          <div className="text-2xl font-mono">{totalTime.toFixed(1)}s</div>
          <div className="text-lg">Total Time</div>
          <div className="text-3xl font-bold">{score} points</div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Round Details:</h3>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg flex justify-between items-center ${
                  result.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                <span>Round {index + 1}</span>
                <span>{result.timeElapsed.toFixed(1)}s</span>
                <span>{result.correct ? '✓' : '✗'}</span>
              </div>
            ))}
          </div>
        </div>

        {!submitted ? (
          <div className="space-y-4">
            <Input
              placeholder="Enter your name for the leaderboard"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitScore()}
            />
            <Button
              onClick={handleSubmitScore}
              disabled={!playerName.trim() || isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Score'}
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-green-600 font-medium">Score submitted successfully!</p>
            <div className="space-y-2">
              <Button onClick={onPlayAgain} className="w-full" size="lg">
                Play Again
              </Button>
              <Button onClick={onViewLeaderboard} variant="outline" className="w-full" size="lg">
                View Leaderboard
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default GameResults