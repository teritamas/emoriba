// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  app: {
    head: {
      // npmでインストールしたいが、ドキュメントが薄く、動作が安定しないのでsrcで読み込む
      script: [{ src: "https://aframe.io/releases/1.3.0/aframe.min.js" }],
    },
  },
});
