import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import ControlPanel from './ControlPanel'
import StatusDisplay from './StatusDisplay'
import { useDIDStreaming } from '../hooks/useDIDStreaming'
import StreamingContext from '../context/StreamingContext'

const VideoWrapper = styled.div`
  height: 500px;
  background-position: top;
  text-align: center;
  position: relative;
  video {
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
  }
`

const VideoElement = styled.video`
  position: relative;
  z-index: 1;
  &.streaming {
    background-color: green;
  }
`

const IdleVideoElement = styled.video`
  display: none;
  position: absolute;
  z-index: 0;
  top: 0;
`

const ComponentContainer = styled.div`
  background: url('/bg.png');
  background-repeat: no-repeat;
  background-position: center top;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const AvatarStream = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const idleVideoRef = useRef<HTMLVideoElement>(null)
  const [isFirstInteraction, setIsFirstInteraction] = useState(false)
  const {
    connectToStream,
    startStreaming,
    destroyStream,
    iceGatheringStatus,
    iceConnectionStatus,
    peerConnectionStatus,
    signalingStatus,
    streamingStatus,
    stream,
    handleVideoStatusChange,
  } = useDIDStreaming()
  const { sessionId, setSessionId, streamId, setStreamId } = useContext(StreamingContext)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
      handleVideoStatusChange(true, stream)
    }
  }, [stream, handleVideoStatusChange])

  useEffect(() => {
    const idleVideo = idleVideoRef.current
    if (idleVideo) {
      idleVideo.src = 'oracle_Idle.mp4'
      idleVideo.muted = true
      idleVideo.loop = true

      if (isFirstInteraction) {
        idleVideo.style.display = 'block'
        idleVideo.play().catch((e) => console.error('Error playing idle video:', e))
      }
    }
  }, [isFirstInteraction])

  const handleConnect = async () => {
    setIsFirstInteraction(true)
    const sessionDetails = await connectToStream()
    setSessionId(sessionDetails.sessionId)
    setStreamId(sessionDetails.streamId)
  }

  const handleStart = async (userInput: string) => {
    setIsFirstInteraction(true)
    await startStreaming(userInput)
  }

  const handleDestroy = async () => {
    setIsFirstInteraction(true)
    await destroyStream()
    setSessionId(null)
    setStreamId(null)
  }

  return (
    <ComponentContainer>
      <VideoWrapper>
        <VideoElement className={stream ? 'streaming' : 'idle'} ref={videoRef} width="400" height="400" autoPlay />
        <IdleVideoElement ref={idleVideoRef} width="400" height="400" autoPlay muted={true} />
      </VideoWrapper>
      <ControlPanel onConnect={handleConnect} onStart={handleStart} onDestroy={handleDestroy} />
      <StatusDisplay
        iceGatheringStatus={iceGatheringStatus}
        iceConnectionStatus={iceConnectionStatus}
        peerConnectionStatus={peerConnectionStatus}
        signalingStatus={signalingStatus}
        streamingStatus={streamingStatus}
      />
    </ComponentContainer>
  )
}

export default AvatarStream

