export interface IStreamCache {
  cachedChunks: Uint8Array[]
  isComplete: boolean
  timestamp: number
}
