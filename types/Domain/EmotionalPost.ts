import { GeoPoint } from 'firebase-admin/firestore'

export interface EmotionalPost {
  id: string
  comment: string
  imageUrl: string
  coordinates: GeoPoint
  createdAt: string
}
