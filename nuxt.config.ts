// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Firebase Functionのデプロイのため必要
  nitro: {
    firebase: {
      nodeVersion: '20',
      gen: 2,
      httpsOptions: {
        region: 'us-central1',
        maxInstances: 3
      }
    }
  },
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      // npmでインストールしたいが、ドキュメントが薄く、動作が安定しないのでsrcで読み込む
      script: [
        { src: 'https://aframe.io/releases/1.6.0/aframe.min.js' },
        {
          // entityにlook-at属性を追加するとカメラの方を向くようになる
          src: 'https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js'
        },
        {
          // 最新のバージョンだとlongitudeを取得できない不具合があるので、3.4.5を使用
          src: 'https://www.unpkg.com/@ar-js-org/ar.js@3.4.5/three.js/build/ar-threex-location-only.js'
        },
        {
          // 最新のバージョンだとlongitudeを取得できない不具合があるので、3.4.5を使用
          src: 'https://www.unpkg.com/@ar-js-org/ar.js@3.4.5/aframe/build/aframe-ar.js'
        }
      ]
    }
  }
})
