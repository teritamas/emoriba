import { GeoPoint } from 'firebase-admin/firestore'
import * as geofire from 'geofire-common'
import { geoFirestore } from '../firebase'
import { VoiceVolume } from '@/types/Constant/VoiceVolume'
import { EmotionalPost } from '@/types/Domain/EmotionalPost'

const firestoreClient = geoFirestore

/**
 *
 * 近くの投稿を取得する
 */
export const fetchPost = async (
  lat: number,
  lng: number,
  eventName: string
) => {
  try {
    const latitude = Number(lat)
    const longitude = Number(lng)
    console.log(
      'latitude: ',
      latitude,
      'longitude: ',
      longitude,
      'eventName: ',
      eventName
    )
    const posts = await firestoreClient
      .collection('posts')
      .where('eventName', '==', eventName)
      .near({
        center: new GeoPoint(latitude, longitude),
        radius: 0.5 // 500m以内
      })
      .limit(20) // 20件のみ取得
      .get()
    console.log(posts.docs.map((doc) => doc.data()))
    return posts.docs.map((doc) => doc.data())
  } catch (error) {
    console.error(
      '一覧取得でエラーが発生しました. longitude: ',
      lng,
      'latitude: ',
      lat,
      'error: ',
      error
    )
  }
}

/**
 * 投稿を登録する
 */
export const registerPost = async (
  comment: string,
  latitude: number,
  longitude: number,
  eventName: string,
  voiceVolume: VoiceVolume,
  imageUrl: string | null = null
) => {
  try {
    const coordinates = new GeoPoint(Number(latitude), Number(longitude))
    const post = {
      comment,
      imageUrl,
      coordinates,
      eventName,
      voiceVolume,
      // 位置情報による検索を行うために、geohashを追加する必要がある
      // https://firebase.google.com/docs/firestore/solutions/geoqueries?hl=ja
      g: {
        geohash: geofire.geohashForLocation([
          Number(latitude),
          Number(longitude)
        ]),
        geopoint: coordinates
      },
      createdAt: new Date().toISOString()
    } as unknown as EmotionalPost
    await firestoreClient.collection('posts').add(post)
    return post
  } catch (error) {
    console.error('登録でエラーが発生しました. error: ', error)
  }
}
