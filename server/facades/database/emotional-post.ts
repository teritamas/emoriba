import { GeoPoint } from "firebase-admin/firestore";
import { geoFirestore } from "../firebase";

const firestoreClient = geoFirestore;
/**
 *
 * 近くの投稿を取得する
 */
export const fetchPost = async (lat: number, lng: number) => {
  try {
    const latitude = Number(lat);
    const longitude = Number(lng);
    console.log("latitude: ", latitude, "longitude: ", longitude);
    const posts = await firestoreClient
      .collection("posts")
      .near({
        center: new GeoPoint(latitude, longitude),
        radius: 100, // 1km以内
      })
      .get();
    console.log(posts.docs.map((doc) => doc.data()));
    return posts.docs.map((doc) => doc.data());
  } catch (error) {
    console.error(
      "一覧取得でエラーが発生しました. longitude: ",
      lng,
      "latitude: ",
      lat,
      "error: ",
      error
    );
  }
};
