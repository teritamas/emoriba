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
      material="src: #balloon; transparent: true; opacity: 0.95; side: double;"
      :scale="`${scale(post.voiceVolume)}`"
      :width="`${speechBubbleWidth(post.comment)}`"
      look-at="[gps-camera]"
      height="1"
    >
      <a-entity
        :key="index"
        :text="`value: ${post.comment}; font: /fonts/mplus-msdf.json; font-image: /fonts/mplus-msdf.png; color: black; align: center; width: 2.5; height: 2; negate: false;`"
        scale="4 4 4"
        position="0 0.19 0.1"
      />
    </a-plane>
    <a-camera gps-camera="minDistance: 2; maxDistance: 100" rotation-reader />
  </a-scene>
</template>

<script setup lang="ts">
import type { EmotionalPost } from '@/types/Domain/EmotionalPost'
import { VoiceVolume } from '@/types/Constant/VoiceVolume'

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

const scale = (voiceVolume: VoiceVolume) => {
  switch (voiceVolume) {
    case VoiceVolume.LOW:
      return '1 1 1'
    case VoiceVolume.MEDIUM:
      return '2 2 2'
    case VoiceVolume.HIGH:
      return '4 4 4'
    default:
      return '1 1 1'
  }
}
</script>
