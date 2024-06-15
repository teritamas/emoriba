<template>
  <a-scene
    vr-mode-ui="enabled: false"
    loading-screen="enabled: false;"
    arjs="sourceType: webcam; debugUIEnabled: true;"
    renderer="logarithmicDepthBuffer: true;"
  >
    <a-assets>
      <img id="balloon" src="/objects/speach_bubble_cute.svg" />
    </a-assets>

    <a-plane
      v-for="(post, index) in props.posts"
      :key="index"
      :gps-entity-place="`latitude: ${post.coordinates._latitude}; longitude: ${post.coordinates._longitude};`"
      :material="`src: #balloon; color: ; transparent: true; opacity: 0.9; side: double; color: ${speechBubbleColor()};`"
      scale="2 2 2"
      look-at="[gps-camera]"
      :width="`${speechBubbleWidth(post.comment)}`"
      height="1.2"
    >
      <a-entity
        :key="index"
        :text="`value: ${post.comment}; font: /fonts/mplus-msdf.json; font-image: /fonts/mplus-msdf.png; align: center; width: 2.5; height: 2; negate: false;`"
        scale="4 4 4"
        position="0 0.2 0.1"
      />
    </a-plane>
    <a-camera gps-camera="minDistance: 1" rotation-reader />
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
  const MIN_WIDTH = 3
  const length = comment.length * 0.7

  return length >= MIN_WIDTH ? length : MIN_WIDTH
}

const speechBubbleColor = () => {
  // colorPaletteからランダムで色を選択
  return ColorPalette[Math.floor(Math.random() * ColorPalette.length)].main
}
</script>
