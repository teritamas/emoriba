<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
body,
#__nuxt,
#__layout,
.main {
  height: 100% !important;
  overflow: hidden;
}

#arjs-video {
  margin-left: 0px !important;
  object-fit: cover !important;
}

/*イベントピッカーの位置の調整*/
.van-picker-column {
  width: 87vw;
  margin: 0 auto;
}
</style>
