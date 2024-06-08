import { EmotionalPost } from "@/types/Domain/EmotionalPost";
import RegisterCommentRequest from "@/types/Models/RegisterComment/RegisterCommentRequest";
import { MultiPartData } from "h3";
import { registerPost } from "~/server/facades/database/emotional-post";

export default defineEventHandler(async (event) => {
  try {
    // BodyからFirestoreに登録するデータを作成
    const data: MultiPartData[] | undefined = await readMultipartFormData(
      event!
    );
    if (data === undefined) {
      return createError({
        statusCode: 400,
        statusMessage: "Failed to multipart/form-data",
      });
    }

    // リクエストボディとファイルを取得
    let requestBody: RegisterCommentRequest | undefined = undefined;
    let file: Buffer | undefined = undefined;
    for (const d of data) {
      if (d.name === "request") {
        requestBody = {
          ...JSON.parse(d.data.toString()),
        };
      } else if (d.name === "file") {
        file = d.data;
      }
    }

    // Firestoreに登録
    const registeredPost = await registerPost(
      requestBody!.comment,
      requestBody!.coordinates.latitude,
      requestBody!.coordinates.longitude
    );

    // 登録したデータを返却
    return {
      ...registeredPost,
    } as EmotionalPost;
  } catch (error) {
    console.error(error);
  }
});
