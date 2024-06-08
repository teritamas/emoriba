<template>
  <!-- <div class="fixed left-0 top-0 z-0"> -->
  <video
    class="min-h-full min-w-full overflow-y-hidden"
    ref="video"
    autoplay
    playsinline
  />
  <!-- </div> -->
</template>

<script lang="ts" setup>
  // 起動時にカメラを起動する
  const video = ref<HTMLVideoElement | null>(null);
  onMounted(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (video.value) {
          video.value.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
</script>
