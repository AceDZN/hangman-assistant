// StatusDisplay.tsx
import React from 'react'
import styled from 'styled-components'

const StatusWrapper = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #fff;
`

const StatusRow = styled.div`
  margin: 5px 0;
`

const StatusLabel = styled.span`
  font-weight: bold;
`

const StatusValue = styled.span`
  margin-left: 10px;
  &.new {
    color: cornflowerblue;
  }
  &.checking,
  &.have-local-offer,
  &.have-remote-offer,
  &.have-local-pranswer,
  &.have-remote-pranswer,
  &.gathering {
    color: orange;
  }
  &.connected,
  &.completed,
  &.stable {
    color: green;
  }
  &.disconnected,
  &.closed,
  &.failed {
    color: red;
  }
  &.streaming {
    color: green;
  }
  &.empty,
  &.error {
    color: grey;
  }
`

interface StatusDisplayProps {
  iceGatheringStatus: string
  iceConnectionStatus: string
  peerConnectionStatus: string
  signalingStatus: string
  streamingStatus: string
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({
  iceGatheringStatus,
  iceConnectionStatus,
  peerConnectionStatus,
  signalingStatus,
  streamingStatus,
}) => {
  return (
    <StatusWrapper>
      <StatusRow>
        <StatusLabel>ICE gathering status:</StatusLabel>
        <StatusValue className={iceGatheringStatus}>{iceGatheringStatus}</StatusValue>
      </StatusRow>
      <StatusRow>
        <StatusLabel>ICE connection status:</StatusLabel>
        <StatusValue className={iceConnectionStatus}>{iceConnectionStatus}</StatusValue>
      </StatusRow>
      <StatusRow>
        <StatusLabel>Peer connection status:</StatusLabel>
        <StatusValue className={peerConnectionStatus}>{peerConnectionStatus}</StatusValue>
      </StatusRow>
      <StatusRow>
        <StatusLabel>Signaling status:</StatusLabel>
        <StatusValue className={signalingStatus}>{signalingStatus}</StatusValue>
      </StatusRow>
      <StatusRow>
        <StatusLabel>Streaming status:</StatusLabel>
        <StatusValue className={streamingStatus}>{streamingStatus}</StatusValue>
      </StatusRow>
    </StatusWrapper>
  )
}

export default StatusDisplay

