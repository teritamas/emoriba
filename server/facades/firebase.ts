import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import * as geofirestore from "geofirestore";

const app = initializeApp({
  storageBucket: process.env.FIRE_STORAGE_BUCKET,
});

const firestore = getFirestore(app);
export const geoFirestore = geofirestore.initializeApp(firestore);
// export const bucket = getStorage(app).bucket(); // 画像を保存する場合はこちらを使う
