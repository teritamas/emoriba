import type { VoiceVolume } from '@/types/Constant/VoiceVolume'

export default interface RegisterCommentRequest {
  coordinates: {
    latitude: number
    longitude: number
  }
  voiceVolume: VoiceVolume
  comment: string
  eventName: string
}
