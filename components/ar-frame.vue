<template>
  <a-scene
    vr-mode-ui="enabled: false"
    embedded
    arjs="sourceType: webcam; debugUIEnabled: false;"
  >
    <a-text
      value="この文章が表示される時、ARは有効です"
      font="/fonts/hui-msdf.json"
      font-image="/fonts/hui-msdf.png"
      position="-3 3 -10"
      look-at="[gps-camera]"
      scale="2 2 2"
      :gps-entity-place="`latitude: ${deviceLatitude}; longitude: ${deviceLongitude};`"
    />
    <a-entity
      v-for="(post, index) in props.posts"
      :key="index"
      :text="
        'value: ' +
        post.comment +
        '; font: /fonts/hui-msdf.json; font-image: /fonts/hui-msdf.png; align: center; width: 2; negate: false;'
      "
      :position="'-2 ' + (index * 0.6 - 1) + ' -10'"
      rotation="-90 0 0"
      scale="2 2 2"
      look-at="[gps-camera]"
      :gps-entity-place="`latitude: ${post.coordinates._latitude}; longitude: ${post.coordinates._longitude};`"
    />

    <a-camera gps-camera rotation-reade />
  </a-scene>
</template>

<script setup lang="ts">
import type { EmotionalPost } from '@/types/Domain/EmotionalPost'

const props = defineProps({
  posts: {
    type: Array as PropType<EmotionalPost[]>,
    required: true
  },
  deviceLatitude: {
    type: Number as PropType<number>,
    required: true
  },
  deviceLongitude: {
    type: Number as PropType<number>,
    required: true
  }
})
</script>
