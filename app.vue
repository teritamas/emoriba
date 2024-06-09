<template>
  <div class="main">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
body,
#__nuxt,
#__layout,
.main {
  height: 100%;
  margin: 0px;
  overflow: hidden;
}

/*イベントピッカーの位置の調整*/
.van-picker-column {
  width: 87vw;
  margin: 0 auto;
}
</style>
