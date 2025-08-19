import React, { useState, useEffect } from 'react'

const QwertyKeyboard = () => {
  const [pressedKeys, setPressedKeys] = useState(new Set())

  const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ]

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase()
      if (key.match(/^[A-Z]$/) || key === 'ENTER') {
        setPressedKeys(prev => new Set([...prev, key]))
      }
    }

    const handleKeyUp = (event) => {
      const key = event.key.toUpperCase()
      if (key.match(/^[A-Z]$/) || key === 'ENTER') {
        setPressedKeys(prev => {
          const newSet = new Set(prev)
          newSet.delete(key)
          return newSet
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const KeyButton = ({ letter, extraClasses = '' }) => {
    const isPressed = pressedKeys.has(letter)
    
    return (
      <div
        className={`
          inline-flex items-center justify-center
          min-w-[2.5rem] h-10 mx-0.5 my-0.5
          border border-gray-300 rounded-md
          font-mono font-medium text-sm
          transition-all duration-100
          ${extraClasses}
          ${isPressed 
            ? 'bg-green-500 text-white border-green-600 transform scale-95' 
            : 'bg-white text-gray-700 hover:bg-gray-50'
          }
        `}
      >
        {letter}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-1 p-4 bg-gray-50 rounded-lg border">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center">
          {row.map((letter) => (
            <KeyButton key={letter} letter={letter} />
          ))}
        </div>
      ))}
      
      <div className="flex justify-center pt-2">
        <KeyButton letter="ENTER" extraClasses="px-6" />
      </div>
    </div>
  )
}

export default QwertyKeyboard