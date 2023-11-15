import { useState, useCallback, useRef } from 'react'
import { constants } from '../constants'

export const useDIDStreaming = () => {
  const [iceGatheringStatus, setIceGatheringStatus] = useState('')
  const [iceConnectionStatus, setIceConnectionStatus] = useState('')
  const [peerConnectionStatus, setPeerConnectionStatus] = useState('')
  const [signalingStatus, setSignalingStatus] = useState('')
  const [streamingStatus, setStreamingStatus] = useState('')
  const [stream, setStream] = useState<MediaStream | null>(null)

  const sessionIdRef = useRef<string | null>(null)
  const streamIdRef = useRef<string | null>(null)

  let peerConnection: RTCPeerConnection | null = null

  const handleVideoStatusChange = useCallback((isPlaying: boolean, newStream: MediaStream) => {
    if (isPlaying) {
      setStream(newStream)
    }
  }, [])

  const createPeerConnection = useCallback(
    async (offer: RTCSessionDescriptionInit, iceServers: RTCIceServer[]) => {
      if (!peerConnection) {
        peerConnection = new RTCPeerConnection({ iceServers })
        peerConnection.addEventListener(
          'icegatheringstatechange',
          () => {
            setIceGatheringStatus(peerConnection?.iceGatheringState ?? '')
          },
          true,
        )
        peerConnection.addEventListener(
          'icecandidate',
          async (event) => {
            if (event.candidate && sessionIdRef.current && streamIdRef.current) {
              await fetch(`${constants.DID_API_URL}/talks/streams/${streamIdRef.current}/ice`, {
                method: 'POST',
                headers: {
                  Authorization: `Basic ${constants.DID_API_KEY}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  candidate: event.candidate,
                  session_id: sessionIdRef.current,
                }),
              })
            }
          },
          true,
        )
        peerConnection.addEventListener(
          'iceconnectionstatechange',
          () => {
            setIceConnectionStatus(peerConnection?.iceConnectionState ?? '')
          },
          true,
        )
        peerConnection.addEventListener(
          'connectionstatechange',
          () => {
            setPeerConnectionStatus(peerConnection?.connectionState ?? '')
          },
          true,
        )
        peerConnection.addEventListener(
          'signalingstatechange',
          () => {
            setSignalingStatus(peerConnection?.signalingState ?? '')
          },
          true,
        )
        peerConnection.addEventListener(
          'track',
          (event) => {
            if (event.track.kind === 'video') {
              handleVideoStatusChange(true, event.streams[0])
            }
          },
          true,
        )
      }

      await peerConnection.setRemoteDescription(offer)
      const sessionClientAnswer = await peerConnection.createAnswer()
      await peerConnection.setLocalDescription(sessionClientAnswer)

      return sessionClientAnswer
    },
    [handleVideoStatusChange],
  )

  const connectToStream = useCallback(async () => {
    try {
      const sessionResponse = await fetch(`${constants.DID_API_URL}/talks/streams`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${constants.DID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source_url: constants.SOURCE_URL }),
      })

      const { id: newStreamId, offer, ice_servers: iceServers, session_id: newSessionId } = await sessionResponse.json()
      streamIdRef.current = newStreamId
      sessionIdRef.current = newSessionId

      const sessionClientAnswer = await createPeerConnection(offer, iceServers)

      await fetch(`${constants.DID_API_URL}/talks/streams/${newStreamId}/sdp`, {
        method: 'POST',
        headers: { Authorization: `Basic ${constants.DID_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: sessionClientAnswer, session_id: newSessionId }),
      })

      return { streamId: newStreamId, sessionId: newSessionId }
    } catch (error) {
      console.error('Error during connectToStream:', error)
      throw error
    }
  }, [createPeerConnection])

  const startStreaming = useCallback(async (responseFromOpenAI: string) => {
    if (streamIdRef.current && sessionIdRef.current) {
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
    }
  }, [])

  const destroyStream = useCallback(async () => {
    if (streamIdRef.current && sessionIdRef.current) {
      try {
        await fetch(`${constants.DID_API_URL}/talks/streams/${streamIdRef.current}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Basic ${constants.DID_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id: sessionIdRef.current }),
        })
        if (peerConnection) {
          peerConnection.close()
          peerConnection = null
        }
        setStreamingStatus('destroyed')
        streamIdRef.current = null
        sessionIdRef.current = null
      } catch (error) {
        console.error('Error during destroyStream:', error)
      }
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

