import { fetchPost } from '@/server/facades/database/emotional-post'
import { EmotionalPost } from '@/types/Domain/EmotionalPost'
import FetchPostResponse from '@/types/Models/FetchPosts/FetchPostResponse'

export default defineEventHandler(async (event) => {
  try {
    // クリエパラメータから緯度経度を取得
    const query = getQuery(event)
    const latitude = query.latitude as number
    const longitude = query.longitude as number
    const eventName = query.eventName as string

    // Firestoreから投稿を取得
    const posts = (await fetchPost(
      latitude,
      longitude,
      eventName
    )) as unknown as EmotionalPost[]

    return {
      posts
    } as FetchPostResponse
  } catch (error) {
    console.error(error)
  }
})
