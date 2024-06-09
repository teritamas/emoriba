<template>
  <div class="absolute top-4 right-4 bg-gray-200 text-xs p-2 rounded-lg">
    <p>longitude: {{ longitude }}</p>
    <p>latitude: {{ latitude }}</p>
  </div>
  <ar-frame
    :posts="posts"
    :device-latitude="latitude"
    :device-longitude="longitude"
  />
</template>

<script setup lang="ts">
import type FetchPostResponse from '@/types/Models/FetchPosts/FetchPostResponse'
import type { EmotionalPost } from '~/types/Domain/EmotionalPost'

const longitude = ref(-1)
const latitude = ref(-1)
const posts = ref<EmotionalPost[]>([])

// 2秒ごとに位置情報を取得してログに表示する
onNuxtReady(() => {
  getCoordinates()
  setInterval(async () => {
    getCoordinates()
  }, 20000)
})

/**
 * 端末の情報を利用して位置情報を取得し、その位置情報を元に感情投稿を取得する
 */
function getCoordinates() {
  console.debug('[getCoordinates] Start')
  navigator.geolocation.watchPosition(async (position) => {
    longitude.value = position.coords.longitude
    latitude.value = position.coords.latitude
    console.debug('[getCoordinates] Complete!', longitude.value)
    // どちらかが-1の場合は位置情報が取得できていないので処理を実行しない
    if (longitude.value === -1 || latitude.value === -1) {
      return
    }
    const res = (await fetchEmotionalPosts()) as FetchPostResponse
    posts.value = res.posts
    console.log('posts', posts.value)
  })
}

// 位置情報から周辺300m以内の投稿を取得する
const isLoading = ref(false)
const fetchEmotionalPosts = async () => {
  // 位置情報から周辺300m以内の投稿を取得する
  isLoading.value = true
  // 位置情報はクエリパラメータとして送信する
  try {
    const res = await fetch(
      `api/emotional-post?longitude=${longitude.value}&latitude=${latitude.value}&eventName=all`,
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return res.json()
  } catch (error) {
    return {}
  } finally {
    isLoading.value = false
  }
}
</script>
