<template>
  <application-title class="absolute top-4 left-4"></application-title>
  <div>
    <ar-windows></ar-windows>
  </div>
  <div class="fixed right-4 bottom-4">
    <register-modal />
  </div>
  <div class="absolute top-4 right-4 bg-gray-200 text-xs p-2 rounded-lg">
    <p>longitude: {{ longitude }}</p>
    <p>latitude: {{ latitude }}</p>
  </div>
</template>

<script setup lang="ts">
  const longitude = ref(-1);
  const latitude = ref(-1);
  // 2秒ごとに位置情報を取得してログに表示する
  onNuxtReady(() => {
    setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        longitude.value = position.coords.longitude;
        latitude.value = position.coords.latitude;
      });
    }, 2000);
  });
</script>
