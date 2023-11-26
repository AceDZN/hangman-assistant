// App.tsx
import './App.css'
import AvatarStream from './components/AvatarStream'
import Blockbusters from './components/blockbusters/Blockbusters'
import { StreamingProvider } from './context/StreamingContext'

function App() {
  return (
    <>
      <StreamingProvider>
        <AvatarStream />
        {/*<Blockbusters />*/}
      </StreamingProvider>
    </>
  )
}

export default App
