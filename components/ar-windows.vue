<template>
  <video
    ref="video"
    class="min-h-full min-w-full overflow-y-hidden"
    autoplay
    playsinline
  />
</template>

<script setup lang="ts">
// 起動時にカメラを起動する
const video = ref<HTMLVideoElement | null>(null)
onMounted(() => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: 'environment' } })
    .then((stream) => {
      if (video.value) {
        video.value.srcObject = stream
      }
    })
    .catch((err) => {
      console.error(err)
    })
})
</script>
