<template>
  <a-scene
    vr-mode-ui="enabled: false"
    loading-screen="enabled: false;"
    arjs="sourceType: webcam; debugUIEnabled: false;"
    renderer="logarithmicDepthBuffer: true;"
  >
    <a-assets>
      <img id="balloon" src="/objects/speach_bubble_cute.svg" />
    </a-assets>

    <a-plane
      v-for="(post, index) in props.posts"
      :key="index"
      :gps-entity-place="`latitude: ${post.coordinates._latitude}; longitude: ${post.coordinates._longitude};`"
      :material="`src: #balloon; transparent: true; opacity: 0.95; side: double;`"
      scale="2 2 2"
      look-at="[gps-camera]"
      :width="`${speechBubbleWidth(post.comment)}`"
      height="1.2"
    >
      <a-entity
        :key="index"
        :text="`value: ${post.comment}; font: /fonts/mplus-msdf.json; font-image: /fonts/mplus-msdf.png; color: black; align: center; width: 2.5; height: 2; negate: false;`"
        scale="4 4 4"
        position="0 0.19 0.1"
      />
    </a-plane>
    <a-camera gps-camera="minDistance: 1" rotation-reader />
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

const speechBubbleWidth = function (comment: string) {
  const MIN_WIDTH = 3
  const length = comment.length * 0.7

  return length >= MIN_WIDTH ? length : MIN_WIDTH
}
</script>
