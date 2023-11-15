import React, { useState, useEffect, useRef, useContext } from 'react'
import styled from 'styled-components'
import { ControlPanel } from './ControlPanel'
import { StatusDisplay } from './StatusDisplay'
import { useOpenAIChat } from '../hooks/useOpenAIChat'
import { useDIDStreaming } from '../hooks/useDIDStreaming'
import StreamingContext from '../context/StreamingContext'

const VideoWrapper = styled.div`
  background: url('/bg.png');
  height: 500px;
  background-position: top;
  text-align: center;
  width: 100%;
`

const VideoElement = styled.video`
  border-radius: 50%;
  background-color: #000;
`

const IdleVideoElement = styled.video`
  display: none; // initially hidden
`

const ComponentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const AvatarStream = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const idleVideoRef = useRef<HTMLVideoElement>(null)
  const { fetchOpenAIResponse } = useOpenAIChat()
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
    } else {
      handleIdleVideo()
    }
  }, [stream])

  const handleIdleVideo = () => {
    if (idleVideoRef.current) {
      idleVideoRef.current.style.display = 'block'
      idleVideoRef.current.src = 'oracle_Idle.mp4'
      idleVideoRef.current.loop = true
      idleVideoRef.current.play().catch((e) => console.error('Error playing idle video:', e))
    }
  }

  const handleConnect = async () => {
    const sessionDetails = await connectToStream()
    setSessionId(sessionDetails.sessionId)
    setStreamId(sessionDetails.streamId)
  }

  const handleStart = async (userInput: string) => {
    const responseFromOpenAI = await fetchOpenAIResponse(userInput)
    await startStreaming(responseFromOpenAI)
  }

  const handleDestroy = async () => {
    await destroyStream()
    setSessionId(null)
    setStreamId(null)
  }

  return (
    <ComponentContainer>
      <VideoWrapper>
        <VideoElement ref={videoRef} width="400" height="400" autoPlay />
        <IdleVideoElement ref={idleVideoRef} width="400" height="400" autoPlay />
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
