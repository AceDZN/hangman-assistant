'use client'
import React, { useState, useEffect, createContext, useContext, useRef } from 'react'
import { Stage, Layer } from 'react-konva'
import styled from 'styled-components'
import Hexagon from './Hexagon'
import { generateRandomLetter, checkAnswer } from './helpers'
import QuestionModal from './QuestionModal'

// Define the context for game state
export const GameContext = createContext<any>(null)

// Styled component for the game container
const GameContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`

// Main Blockbusters component
const Blockbusters = () => {
  const [board, setBoard] = useState<Array<Array<string>>>([])
  const [currentPlayer, setCurrentPlayer] = useState<number>(1)
  const [showQuestion, setShowQuestion] = useState<boolean>(false)
  const [selectedHex, setSelectedHex] = useState<{ row: number; col: number } | null>(null)

  useEffect(() => {
    initializeBoard()
  }, [])

  // Initialize the game board with random letters
  const initializeBoard = () => {
    const newBoard = []
    for (let row = 0; row < 7; row++) {
      const rowArray = []
      for (let col = 0; col < 8; col++) {
        rowArray.push(generateRandomLetter())
      }
      newBoard.push(rowArray)
    }
    setBoard(newBoard)
  }

  // Handle hexagon click
  const handleHexClick = (row: number, col: number) => {
    setSelectedHex({ row, col })
    setShowQuestion(true)
  }

  // Handle answer submission
  const handleAnswerSubmit = (answer: string) => {
    if (selectedHex && checkAnswer(answer, board[selectedHex.row][selectedHex.col])) {
      // Update board state with player's number
      const newBoard = [...board]
      newBoard[selectedHex.row][selectedHex.col] = `P${currentPlayer}`
      setBoard(newBoard)
      // Switch player
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1)
    }
    setShowQuestion(false)
  }

  const hexagonSize = 40 // Size of the hexagon
  const xOffset = 75 // Horizontal distance between hexagons
  const yOffset = 85 // Vertical distance between hexagons
  const canvasWidth = window.innerWidth
  const canvasHeight = window.innerHeight
  const centerX = canvasWidth / 2
  const centerY = canvasHeight / 2

  return (
    <GameContainer>
      <GameContext.Provider value={{ currentPlayer, handleHexClick }}>
        <Stage width={canvasWidth} height={canvasHeight}>
          <Layer>
            {board.map((row, rowIndex) =>
              row.map((letter, colIndex) => (
                <Hexagon
                  radius={hexagonSize}
                  key={`${rowIndex}-${colIndex}`}
                  x={centerX - xOffset * (board.length / 2) + colIndex * xOffset + (rowIndex % 2) * (xOffset / 2)}
                  y={100 + rowIndex * yOffset * 0.75}
                  letter={letter}
                  onClick={() => handleHexClick(rowIndex, colIndex)}
                />
              )),
            )}
          </Layer>
        </Stage>
      </GameContext.Provider>
      {showQuestion && <QuestionModal onSubmit={handleAnswerSubmit} onClose={() => setShowQuestion(false)} />}
    </GameContainer>
  )
}

export default Blockbusters

