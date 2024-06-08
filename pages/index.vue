<template>
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
  <!--<sidebar-view v-if="!isSidebarOpen" @toggleSidebar="toggleSidebar" />-->

  <!--<application-title class="absolute top-4 left-4" />-->
  <div>
    <ar-windows />
    <animated-cube />
  </div>
  <div class="absolute top-4 right-4 bg-white text-xs p-2 rounded-lg">
    <p>longitude: {{ longitude }}</p>
    <p>latitude: {{ latitude }}</p>
  </div>

  <selectbox
    v-model="selectedValue"
    class="absolute top-4 left-4 bg-white text-xs p-2 rounded-lg"
    :items="items"
  />

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
import type RegisterCommentDto from '@/types/Models/RegisterComment/RegisterCommentDto'
import type RegisterCommentRequest from '@/types/Models/RegisterComment/RegisterCommentRequest'
const longitude = ref(-1)
const latitude = ref(-1)

// 2秒ごとに位置情報を取得してログに表示する
onNuxtReady(() => {
  setInterval(async () => {
    navigator.geolocation.getCurrentPosition((position) => {
      longitude.value = position.coords.longitude
      latitude.value = position.coords.latitude
    })
    // どちらかが-1の場合は位置情報が取得できていないので処理を実行しない
    if (longitude.value === -1 || latitude.value === -1) {
    }
    // const res = await fetchEmotionalPosts();
  }, 10000)
})

// 位置情報から周辺300m以内の投稿を取得する
const isLoading = ref(false)
const fetchEmotionalPosts = async () => {
  // 位置情報から周辺300m以内の投稿を取得する
  isLoading.value = true
  // 位置情報はクエリパラメータとして送信する
  try {
    const res = await fetch(
      `api/emotional-post?longitude=${longitude.value}&latitude=${latitude.value}`,
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    console.log(res)
    return res.json()
  } catch (error) {
    return {}
  } finally {
    isLoading.value = false
  }
}

// コメントを投稿する
const postComment = async (dto: RegisterCommentDto) => {
  console.log(dto, 'hoge')
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
        comment: dto.comment
      } as RegisterCommentRequest)
    )
    const res = await fetch('api/emotional-post', {
      method: 'post',
      headers: {},
      body: formData
    })
    console.log(res)
    return res.json()
  } catch (error) {
    return {}
  }
}

const isSidebarOpen = ref(false)

const toggleSidebar = (): void => {
  isSidebarOpen.value = !isSidebarOpen.value
}

/// / 要素の参照を作成
const cameraElement = ref<HTMLElement | null>(null)

/// / カメラエリアの高さと幅の状態を作成
const cameraAreaHeight = ref<number>(0)
const cameraAreaWidth = ref<number>(0)

/// / 要素の高さと幅を更新する関数
const updateDimensions = (): void => {
  if (cameraElement.value) {
    cameraAreaHeight.value = cameraElement.value.offsetHeight
    cameraAreaWidth.value = cameraElement.value.offsetWidth
  }
}

/// / ResizeObserverのインスタンスを作成
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  // ResizeObserverのコールバックを設定
  resizeObserver = new ResizeObserver(updateDimensions)

  // 監視する要素を指定
  if (cameraElement.value) {
    resizeObserver.observe(cameraElement.value)
  }

  // 初回ロード時にサイズを取得
  updateDimensions()
})

onUnmounted(() => {
  // コンポーネントがアンマウントされたときに監視を解除
  if (resizeObserver && cameraElement.value) {
    resizeObserver.unobserve(cameraElement.value)
  }
})

const items = ref<SelectItem[]>([
  {
    createdAt: '2024-06-09',
    commentcounts: 32,
    events: ['巨人－オリックス']
  },
  {
    createdAt: '2024-06-10',
    commentcounts: 78,
    events: ['第73回全日本大学野球選手権大会']
  },
  {
    createdAt: '2024-06-11',
    commentcounts: 12,
    events: ['第73回全日本大学野球選手権大会', 'DREAM STAR FIGHTING MARIGOLD']
  },
  {
    createdAt: '2024-06-12',
    commentcounts: 93,
    events: ['第73回全日本大学野球選手権大会', 'Fortune Dream 9']
  },
  {
    createdAt: '2024-06-13',
    commentcounts: 45,
    events: [
      'NANIMONO 2nd ANNIVERSARY ONEMAN 『インキャが世界を救う★ 〜なにものといっしょ〜』'
    ]
  },
  {
    createdAt: '2024-06-14',
    commentcounts: 67,
    events: ['TOSHIKI KADOMATSU Performance 2024 "C.U.M" vol. 1']
  },
  {
    createdAt: '2024-06-15',
    commentcounts: 19,
    events: [
      'TOSHIKI KADOMATSU Performance 2024 "C.U.M" vol. 1',
      'プロボクシング（DANGANジム）',
      '櫻坂46 4th ARENA TOUR 2024新・櫻前線 -Go on back?- IN 東京ドーム'
    ]
  },
  {
    createdAt: '2024-06-16',
    commentcounts: 81,
    events: [
      '櫻坂46 4th ARENA TOUR 2024新・櫻前線 -Go on back?- IN 東京ドーム',
      'i☆Ris 9th Live Tour 2024 愛たくて...Full Ener9y!!',
      '大日本プロレス',
      'ミキハウスランド'
    ]
  },
  {
    createdAt: '2024-06-17',
    commentcounts: 62,
    events: ['プロボクシング（三迫ジム）']
  }
])

const selectedValue = ref<string>('')
</script>
