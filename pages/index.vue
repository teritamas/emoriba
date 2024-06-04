<template>
  <application-title></application-title>
  <div>
    <a-scene>
      <a-box
        color="#4488FF"
        position="0 0 0"
        rotation="0 0 0"
        animation="property: rotation; to: 360 360 0; dur: 4000; easing: linear; loop: true"
      >
      </a-box>
      <!-- ユーザの視点を決定する -->
      <a-camera position="0 0 2"> </a-camera>
    </a-scene>
    <div class="fixed right-4 bottom-4">
      <register-modal />
    </div>
  </div>
</template>

<style></style>
