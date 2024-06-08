<template>
  <!-- Modal toggle -->
  <div class="flex justify-center p-4">
    <button
      id="button"
      type="button"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      @click="toggleModal"
    >
      {{ showModal ? "モーダルを閉じる" : "モーダルを開く" }}
    </button>
  </div>

  <!-- Main modal -->
  <div v-if="showModal" class="fixed top-4 left-0 right-0 z-50">
    <div
      class="relative border bg-white rounded-lg border-gray-700 w-11/12 md:w-9/12 lg:7/12 m-auto"
    >
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <!-- Modal header -->
        <div
          class="flex items-start justify-between p-5 border-b rounded-t dark:border-gray-600"
        >
          <h3
            class="text-xl font-semibold text-gray-900 lg:text-2xl dark:text-white"
          >
            コメントを投稿してください！
          </h3>
          <button
            id="closeButton"
            data-modal-hide="modal"
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            @click="toggleModal"
          >
            <svg
              class="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-6 space-y-6">
          <!-- コメントの入力 -->
          <div class="mb-6">
            <label
              for="large-input"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >今の"気持ち"を入力してね！</label
            >
            <input
              id="large-input"
              v-model="comment"
              type="text"
              class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>

          <div>
            <div class="flex items-center justify-center w-full">
              <label
                for="dropzone-file"
                class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div
                  class="flex flex-col items-center justify-center pt-5 pb-6"
                >
                  <svg
                    class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span class="font-semibold">クリックして撮影 or 選択</span>
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    みんなに共有したい写真をアップロードしてね！(任意)
                  </p>
                </div>
                <input id="dropzone-file" type="file" class="hidden" />
              </label>
            </div>
          </div>
        </div>
        <!-- Modal footer -->
        <div
          class="flex items-center justify-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"
        >
          <button
            type="button"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            @click="registerButtonClick"
          >
            送信
          </button>
          <button
            type="button"
            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600"
            @click="toggleModal"
          >
            モーダルを閉じる
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { type RegisterCommentDto } from "@/types/Models/RegisterComment/RegisterCommentDto";

  // 入力フォームの値を取得する
  const comment = ref("");

  const emits = defineEmits(["registerButtonClick"]);
  /**
   * 登録ボタンがクリックされたときの処理
   */
  const registerButtonClick = () => {
    const dto = {
      comment: comment.value,
    } as RegisterCommentDto;
    emits("registerButtonClick", dto); // 投稿する
    toggleModal(); // モーダルを閉じる
  };

  const showModal = ref(false);

  // True/Falseを入れ替える
  const toggleModal = () => {
    showModal.value = !showModal.value;
  };
</script>

<style></style>
