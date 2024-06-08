<template>
  <sidebar-view v-if="isSidebarOpen" />

  <application-title class="absolute top-4 left-4" />
  <div>
    <ar-windows />
  </div>
  <div class="absolute top-4 right-4 bg-gray-200 text-xs p-2 rounded-lg">
    <p>longitude: {{ longitude }}</p>
    <p>latitude: {{ latitude }}</p>
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
import type RegisterCommentDto from "@/types/Models/RegisterComment/RegisterCommentDto";
import type RegisterCommentRequest from "@/types/Models/RegisterComment/RegisterCommentRequest";
const longitude = ref(-1);
const latitude = ref(-1);

// 2秒ごとに位置情報を取得してログに表示する
onNuxtReady(() => {
  setInterval(async () => {
    navigator.geolocation.getCurrentPosition((position) => {
      longitude.value = position.coords.longitude;
      latitude.value = position.coords.latitude;
    });
    // どちらかが-1の場合は位置情報が取得できていないので処理を実行しない
    if (longitude.value === -1 || latitude.value === -1) return;
    const res = await fetchEmotionalPosts();
  }, 2000);
});

// 位置情報から周辺300m以内の投稿を取得する
const isLoading = ref(false);
const fetchEmotionalPosts = async () => {
  // 位置情報から周辺300m以内の投稿を取得する
  isLoading.value = true;
  // 位置情報はクエリパラメータとして送信する
  try {
    const res = await fetch(
      `api/emotional-post?longitude=${longitude.value}&latitude=${latitude.value}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(res);
    return res.json();
  } catch (error) {
    return {};
  } finally {
    isLoading.value = false;
  }
};

// コメントを投稿する
const postComment = async (dto: RegisterCommentDto) => {
  console.log(dto, "hoge");
  // 位置情報とコメントを送信する
  try {
    const formData = new FormData();
    formData.append(
      "request",
      JSON.stringify({
        coordinates: {
          longitude: longitude.value,
          latitude: latitude.value,
        },
        comment: dto.comment,
      } as RegisterCommentRequest)
    );
    const res = await fetch("api/emotional-post", {
      method: "post",
      headers: {},
      body: formData,
    });
    console.log(res);
    return res.json();
  } catch (error) {
    return {};
  }
};

const isSidebarOpen = ref(false);

//// 要素の参照を作成
const cameraElement = ref<HTMLElement | null>(null);

//// カメラエリアの高さと幅の状態を作成
const cameraAreaHeight = ref<number>(0);
const cameraAreaWidth = ref<number>(0);

//// 要素の高さと幅を更新する関数
const updateDimensions = (): void => {
  if (cameraElement.value) {
    cameraAreaHeight.value = cameraElement.value.offsetHeight;
    cameraAreaWidth.value = cameraElement.value.offsetWidth;
  }
};

//// ResizeObserverのインスタンスを作成
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  // ResizeObserverのコールバックを設定
  resizeObserver = new ResizeObserver(updateDimensions);

  // 監視する要素を指定
  if (cameraElement.value) {
    resizeObserver.observe(cameraElement.value);
  }

  // 初回ロード時にサイズを取得
  updateDimensions();
});

onUnmounted(() => {
  // コンポーネントがアンマウントされたときに監視を解除
  if (resizeObserver && cameraElement.value) {
    resizeObserver.unobserve(cameraElement.value);
  }
});
</script>
