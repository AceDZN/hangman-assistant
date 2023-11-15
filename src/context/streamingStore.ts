import create from 'zustand'

interface StreamingState {
  sessionId: string | null
  setSessionId: (sessionId: string | null) => void
  streamId: string | null
  setStreamId: (streamId: string | null) => void
}

export const useStreamingStore = create<StreamingState>((set) => ({
  sessionId: null,
  setSessionId: (sessionId) => set(() => ({ sessionId })),
  streamId: null,
  setStreamId: (streamId) => set(() => ({ streamId })),
}))

