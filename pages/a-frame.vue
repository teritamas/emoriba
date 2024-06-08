<template>
  <div class="absolute top-4 right-4 bg-gray-200 text-xs p-2 rounded-lg">
    <p>longitude: {{ longitude }}</p>
    <p>latitude: {{ latitude }}</p>
    <p>高さ: {{ altitude }}</p>
  </div>
  <ar-frame :posts="posts" />
</template>

<script setup lang="ts">
  import type FetchPostResponse from "@/types/Models/FetchPosts/FetchPostResponse";
  import type { EmotionalPost } from "~/types/Domain/EmotionalPost";

  const longitude = ref(-1);
  const latitude = ref(-1);
  const altitude = ref(-1);
  const posts = ref<EmotionalPost[]>([]);

  // 2秒ごとに位置情報を取得してログに表示する
  onNuxtReady(() => {
    getCoordinates();
    setInterval(async () => {
      getCoordinates();
      // どちらかが-1の場合は位置情報が取得できていないので処理を実行しない
      if (longitude.value === -1 || latitude.value === -1) return;
      const res = (await fetchEmotionalPosts()) as FetchPostResponse;
      posts.value = res.posts;
      console.log(posts.value, "posts");
    }, 10000);
  });
  function getCoordinates() {
    navigator.geolocation.getCurrentPosition((position) => {
      longitude.value = position.coords.longitude;
      latitude.value = position.coords.latitude;
      altitude.value = position.coords.altitude!;
    });
  }
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
</script>
