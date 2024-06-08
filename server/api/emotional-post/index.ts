import { fetchPost } from "@/server/facades/database/emotional-post";
import { EmotionalPost } from "@/domain/EmotionalPost";

export default defineEventHandler(async (event) => {
  try {
    // クリエパラメータから緯度経度を取得
    const query = getQuery(event);
    const latitude = query["latitude"] as number;
    const longitude = query["longitude"] as number;

    // Firestoreから投稿を取得
    const posts = (await fetchPost(
      latitude,
      longitude
    )) as unknown as EmotionalPost[];

    return {
      posts,
    } as FetchPostResponse;
  } catch (error) {
    console.error(error);
  }
});

interface FetchPostResponse {
  posts: EmotionalPost[];
}
