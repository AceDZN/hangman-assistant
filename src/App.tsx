import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AvatarStream from './components/AvatarStream'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AvatarStream />
    </>
  )
}

export default App

