<template>
  <a-scene
    vr-mode-ui="enabled: false"
    loading-screen="enabled: false;"
    renderer="logarithmicDepthBuffer: true;"
    embedded
    arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
  >
    <a-entity
      text="
      'value: こんにちわ; font: /fonts/hui-msdf.json; font-image: /fonts/hui-msdf.png; align: center; width: 2; negate: false;'
    "
      look-at="[gps-camera]"
      rotation="-90 0 0"
      scale="1 1 1"
    />
    <a-marker preset="hiro">
      <a-entity
        v-for="(post, index) in posts"
        :key="index"
        :position="'-2 ' + (index * 0.6 - 1) + ' 0'"
        :text="
          'value: ' +
          post.comment +
          '; font: /fonts/hui-msdf.json; font-image: /fonts/hui-msdf.png; align: center; width: 2; negate: false;'
        "
        look-at="[gps-camera]"
        rotation="-90 0 0"
        scale="1 1 1"
      />
    </a-marker>
    <a-entity gps-camera rotation-reade />
  </a-scene>
</template>

<script setup lang="ts">
import type { EmotionalPost } from '@/types/Domain/EmotionalPost'

const props = defineProps({
  posts: {
    type: Array as PropType<EmotionalPost[]>,
    required: true
  }
})
const posts = props.posts
</script>
