<template>
  <a-scene
    vr-mode-ui="enabled: false"
    loading-screen="enabled: false;"
    arjs="sourceType: webcam; debugUIEnabled: true;"
    renderer="logarithmicDepthBuffer: true;"
  >
    <a-assets>
      <img id="balloon" src="/objects/balloon.svg" />
    </a-assets>

    <a-text
      value="この文章が表示される時、ARは有効です"
      font="/fonts/hui-msdf.json"
      font-image="/fonts/hui-msdf.png"
      look-at="[gps-camera]"
      scale="2 2 2"
      negate="false"
      :position="'0 0 0'"
      :gps-entity-place="`latitude: ${deviceLatitude}; longitude: ${deviceLongitude};`"
    />
    <a-plane
      v-for="(post, index) in props.posts"
      :key="index"
      :gps-entity-place="`latitude: ${post.coordinates._latitude}; longitude: ${post.coordinates._longitude};`"
      :material="`src: #balloon; color: ; transparent: true; opacity: 0.9; side: double;`"
      scale="2 2 2"
      look-at="[gps-camera]"
      :width="`${speechBubbleWidth(post.comment)}`"
      height="1.3"
    />
    <a-entity
      v-for="(post, index) in props.posts"
      :key="index"
      :text="`value: ${post.comment}; font: /fonts/hui-msdf.json; font-image: /fonts/hui-msdf.png; align: center; width: 2; height: 2; negate: false; color: ${speechBubbleColor};`"
      scale="15 15 15"
      look-at="[gps-camera]"
      :gps-entity-place="`latitude: ${post.coordinates._latitude}; longitude: ${post.coordinates._longitude};`"
    />
    <a-camera gps-camera rotation-reade />
  </a-scene>
</template>

<script setup lang="ts">
import type { EmotionalPost } from '@/types/Domain/EmotionalPost'
import { ColorPalette } from '@/types/Constant/ColorPalette'

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

const speechBubbleWidth = function (comment: string) {
  const MIN_WIDTH = 6
  const length = comment.length * 1.1

  return length >= MIN_WIDTH ? length : MIN_WIDTH
}

const speechBubbleColor = computed(() => {
  // colorPaletteからランダムで色を選択
  return ColorPalette[Math.floor(Math.random() * ColorPalette.length)].main
})
</script>
