<template>
  <!-- AR.jsの仕様でBody直下である必要がある -->
  <ar-frame
    :posts="posts"
    :device-latitude="latitude"
    :device-longitude="longitude"
  />
  <button
    v-if="isSidebarOpen"
    type="button"
    class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
    @click="toggleSidebar"
  >
    <span class="sr-only">Open sidebar</span>
    <svg
      class="w-6 h-6"
      aria-hidden="true"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clip-rule="evenodd"
        fill-rule="evenodd"
        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
      />
    </svg>
  </button>

  <div class="absolute top-4 left-4 bg-white text-xs p-2 rounded-lg">
    <button type="button" v-if="!showPicker" @click="showPicker = true">
      <icon-calendar />
      {{ selectedEvent }}
    </button>

    <van-picker
      v-if="showPicker"
      title="イベント"
      confirm-button-text="選択"
      cancel-button-text="✕"
      :columns="columns"
      @confirm="onConfirm"
      @cancel="onCancel"
      @change="onChange"
    />
  </div>

  <div ref="cameraElement">
    <footer class="fixed bottom-0 left-0 z-20 p-4 w-full">
      <input-form
        :camera-area-width="cameraAreaWidth"
        :camera-area-height="cameraAreaHeight"
        @register-button-click="postComment"
      />
    </footer>
  </div>
</template>

<script setup lang="ts">
import type DomeCityEvent from '@/types/Domain/DomeCityEvent'
import { showToast } from 'vant'
import type RegisterCommentDto from '@/types/Models/RegisterComment/RegisterCommentDto'
import type RegisterCommentRequest from '@/types/Models/RegisterComment/RegisterCommentRequest'
import type { EmotionalPost } from '@/types/Domain/EmotionalPost'

const longitude = ref(-1)
const latitude = ref(-1)
const selectedValue = ref<string>('all')
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
      `api/emotional-post?longitude=${longitude.value}&latitude=${latitude.value}&eventName=${selectedEvent.value}`,
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

// コメントを投稿する
const postComment = async (dto: RegisterCommentDto) => {
  // 位置情報とコメントを送信する
  try {
    const formData = new FormData()
    formData.append(
      'request',
      JSON.stringify({
        coordinates: {
          longitude: longitude.value,
          latitude: latitude.value
        },
        comment: dto.comment,
        eventName: selectedEvent.value!
      } as RegisterCommentRequest)
    )
    const res = await fetch('api/emotional-post', {
      method: 'post',
      headers: {},
      body: formData
    })
    return res.json()
  } catch (error) {
    return {}
  }
}

/**
 * サイドバーの開閉状態を管理する
 */
const isSidebarOpen = ref(false)
const toggleSidebar = (): void => {
  isSidebarOpen.value = !isSidebarOpen.value
}

/**
 *
 * カメラエリアの高さと幅を取得する
 */
// カメラエリアの高さと幅の状態を作成
const cameraAreaHeight = ref<number>(0)
const cameraAreaWidth = ref<number>(360)
// 要素の高さと幅を更新する関数
const updateDimensions = (): void => {
  if (window.innerWidth) {
    cameraAreaHeight.value = window.innerHeight
    cameraAreaWidth.value = window.innerWidth
  }
}

onMounted(() => {
  // 初回ロード時にサイズを取得
  updateDimensions()
})

/**
 * ドームシティのイベント一覧, 本来はAPIから取得するが現時点ではダミーを使用
 */
const showPicker = ref(false)
const selectedEvent = ref('リアルタイム')
const columns = [
  { text: 'リアルタイム', value: 'リアルタイム' },
  {
    text: '第73回全日本大学野球選手権大会',
    value: '第73回全日本大学野球選手権大会'
  },
  {
    text: 'オードリーのオールナイトニッポン in 東京ドーム',
    value: 'オードリーのオールナイトニッポン in 東京ドーム'
  },
  {
    text: 'ARASHI Anniversary Tour 5×20',
    value: 'ARASHI Anniversary Tour 5×20'
  }
]
const onConfirm = ({ selectedValues }) => {
  selectedEvent.value = selectedValues[0]
  showPicker.value = false
  showToast(`イベント: ${selectedValues.join(',')}`)
}
const onChange = ({ selectedValues }) => {
  selectedEvent.value = selectedValues[0]
  showToast(`イベント: ${selectedValues.join(',')}`)
}
const onCancel = () => {
  showPicker.value = false
}
</script>
