import './App.css'
import AvatarStream from './components/AvatarStream'
import { StreamingProvider } from './context/StreamingContext'

function App() {
  return (
    <>
      <StreamingProvider>
        <AvatarStream />
      </StreamingProvider>
    </>
  )
}

export default App

