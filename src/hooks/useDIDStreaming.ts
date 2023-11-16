import { useState, useCallback, useRef, useContext } from 'react'
import { constants } from '../constants'
import StreamingContext from '../context/StreamingContext'

export const useDIDStreaming = () => {
  const [iceGatheringStatus, setIceGatheringStatus] = useState('')
  const [iceConnectionStatus, setIceConnectionStatus] = useState('')
  const [peerConnectionStatus, setPeerConnectionStatus] = useState('')
  const [signalingStatus, setSignalingStatus] = useState('')
  const [streamingStatus, setStreamingStatus] = useState('')
  const [stream, setStream] = useState<MediaStream | null>(null)

  const { setSessionId, setStreamId } = useContext(StreamingContext)

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const streamIdRef = useRef<string | null>(null)
  const sessionIdRef = useRef<string | null>(null)

  const handleVideoStatusChange = useCallback((isPlaying: boolean, newStream: MediaStream) => {
    if (isPlaying) {
      setStream(newStream)
    }
  }, [])

  // Function to handle ICE candidate events
  const handleICECandidateEvent = async (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      const { candidate, sdpMid, sdpMLineIndex } = event.candidate
      try {
        await fetch(`${constants.DID_API_URL}/talks/streams/${streamIdRef.current}/ice`, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${constants.DID_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            candidate,
            sdpMid,
            sdpMLineIndex,
            session_id: sessionIdRef.current,
          }),
        })
      } catch (error) {
        console.error('Error sending ICE candidate:', error)
      }
    }
  }

  // Function to create the peer connection
  const createPeerConnection = useCallback(
    async (offer: RTCSessionDescriptionInit, iceServers: RTCIceServer[]) => {
      peerConnectionRef.current = new RTCPeerConnection({ iceServers })
      peerConnectionRef.current.addEventListener(
        'icegatheringstatechange',
        () => {
          setIceGatheringStatus(peerConnectionRef.current?.iceGatheringState ?? '')
        },
        true,
      )
      peerConnectionRef.current.addEventListener('icecandidate', handleICECandidateEvent, true)
      peerConnectionRef.current.addEventListener(
        'track',
        (event: RTCTrackEvent) => {
          if (event.track.kind === 'video') {
            handleVideoStatusChange(true, event.streams[0])
          }
        },
        true,
      )
      peerConnectionRef.current.addEventListener(
        'iceconnectionstatechange',
        () => {
          setIceConnectionStatus(peerConnectionRef.current?.iceConnectionState ?? '')
        },
        true,
      )
      peerConnectionRef.current.addEventListener(
        'connectionstatechange',
        () => {
          setPeerConnectionStatus(peerConnectionRef.current?.connectionState ?? '')
        },
        true,
      )
      peerConnectionRef.current.addEventListener(
        'signalingstatechange',
        () => {
          setSignalingStatus(peerConnectionRef.current?.signalingState ?? '')
        },
        true,
      )

      await peerConnectionRef.current.setRemoteDescription(offer)
      const answer = await peerConnectionRef.current.createAnswer()
      await peerConnectionRef.current.setLocalDescription(answer)

      return answer
    },
    [handleVideoStatusChange],
  )

  // Function to connect to the stream
  const connectToStream = useCallback(async () => {
    try {
      const sessionResponse = await fetch(`${constants.DID_API_URL}/talks/streams`, {
        method: 'POST',
        headers: { Authorization: `Basic ${constants.DID_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_url: constants.SOURCE_URL }),
      })

      const { id: newStreamId, offer, ice_servers: iceServers, session_id: newSessionId } = await sessionResponse.json()
      streamIdRef.current = newStreamId
      sessionIdRef.current = newSessionId
      setStreamId(streamIdRef.current)
      setSessionId(sessionIdRef.current)

      const sessionClientAnswer = await createPeerConnection(offer, iceServers)

      await fetch(`${constants.DID_API_URL}/talks/streams/${streamIdRef.current}/sdp`, {
        method: 'POST',
        headers: { Authorization: `Basic ${constants.DID_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: sessionClientAnswer, session_id: sessionIdRef.current }),
      })

      return { streamId: streamIdRef.current, sessionId: sessionIdRef.current }
    } catch (error) {
      console.error('Error during connectToStream:', error)
      throw error
    }
  }, [createPeerConnection, setStreamId, setSessionId])

  // Function to start streaming
  const startStreaming = useCallback(async (responseFromOpenAI: string) => {
    try {
      await fetch(`${constants.DID_API_URL}/talks/streams/${streamIdRef.current}`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${constants.DID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: {
            type: 'text',
            subtitles: 'false',
            provider: { type: 'microsoft', voice_id: 'en-US-ChristopherNeural' },
            ssml: false,
            input: responseFromOpenAI,
          },
          config: constants.STREAMING_CONFIG,
          driver_url: constants.DRIVER_URL,
          session_id: sessionIdRef.current,
        }),
      })
      setStreamingStatus('streaming')
    } catch (error) {
      console.error('Error during startStreaming:', error)
      setStreamingStatus('error')
    }
  }, [])

  // Function to destroy the stream
  const destroyStream = useCallback(async () => {
    try {
      await fetch(`${constants.DID_API_URL}/talks/streams/${streamIdRef.current}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${constants.DID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionIdRef.current }),
      })
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }
      setStreamingStatus('destroyed')
    } catch (error) {
      console.error('Error during destroyStream:', error)
    }
  }, [])

  return {
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
  }
}

export default useDIDStreaming

