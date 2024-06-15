import { GeoPoint } from 'firebase-admin/firestore'
import type { VoiceVolume } from '../Constant/VoiceVolume'

export interface EmotionalPost {
  id: string
  comment: string
  imageUrl: string
  voiceVolume: VoiceVolume
  coordinates: GeoPoint
  createdAt: string
}
