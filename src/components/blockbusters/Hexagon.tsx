import React, { useContext } from 'react'
import { RegularPolygon, Text } from 'react-konva'
import { GameContext } from './Blockbusters'

interface HexagonProps {
  x: number
  y: number
  radius?: number
  letter: string
  onClick: () => void
}

const Hexagon: React.FC<HexagonProps> = ({ x, y, letter, radius = 30, onClick }) => {
  const { currentPlayer } = useContext(GameContext)

  const fontSize = 18
  const isClaimed = letter.startsWith('P')

  return (
    <>
      <RegularPolygon
        x={x}
        y={y}
        sides={6}
        radius={radius}
        fill={isClaimed ? (letter === 'P1' ? 'blue' : 'red') : 'lightblue'}
        stroke={'black'}
        strokeWidth={1}
        onClick={onClick}
      />
      {!isClaimed && (
        <Text
          x={x - radius / 2}
          y={y - radius / 2}
          text={letter}
          fontSize={fontSize}
          fontFamily={'Calibri'}
          fill={'black'}
          width={radius}
          align={'center'}
        />
      )}
    </>
  )
}

export default Hexagon

