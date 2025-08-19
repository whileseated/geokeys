import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'

const Leaderboard = ({ scores }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {scores.map((score, index) => (
            <div
              key={score.id}
              className="flex justify-between items-center p-3 rounded-lg bg-muted"
            >
              <div className="flex items-center space-x-3">
                <span className="font-bold text-lg">#{index + 1}</span>
                <span className="font-medium">{score.player_name}</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-primary">{score.score} points</div>
                <div className="text-sm text-muted-foreground">
                  {score.correct_answers}/10 correct • {score.total_time.toFixed(1)}s
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">How Points Are Calculated:</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• <strong>Base points:</strong> 1,000 points per correct answer</p>
            <p>• <strong>Time penalty:</strong> -10 points per second of total time</p>
            <p>• <strong>Formula:</strong> (Correct answers × 1,000) - (Total time × 10)</p>
            <p>• <strong>Example:</strong> 8 correct in 45.6s = 8,000 - 456 = 7,544 points</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default Leaderboard