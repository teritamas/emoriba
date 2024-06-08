// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],
  app: {
    head: {
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      // npmでインストールしたいが、ドキュメントが薄く、動作が安定しないのでsrcで読み込む
      script: [
        { src: "https://aframe.io/releases/1.3.0/aframe.min.js" },
        {
          src: "https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js",
        },
        {
          src: "https://raw.githack.com/donmccurdy/aframe-extras/master/dist/aframe-extras.loaders.min.js",
        },
      ],
    },
  },
});
