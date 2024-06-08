<template>
  <div>
    <div class="select-box">
      <div class="selected-item" @click="toggleDropdown">
        {{ selectedItem?.createdAt || "Select an option" }}
        <span class="arrow">{{ isOpen ? "▲" : "▼" }}</span>
      </div>
      <div v-if="isOpen" class="dropdown" ref="dropdown">
        <ul class="dropdown-list" ref="list">
          <li
            v-for="item in items"
            :key="item.createdAt"
            @click="selectItem(item)"
            :value="item.createdAt"
            :class="{ selected: item.createdAt === selectedValue }"
          >
            <time
              class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500"
            >
              {{ item.createdAt }}
            </time>
            <h3
              v-for="event in item.events"
              :key="event.index"
              class="text-md font-semibold text-gray-900 dark:text-white"
            >
              # {{ event }}
            </h3>
            <small class="text-gray-400 font-normal"
              >{{ item.commentcounts }} comments</small
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from "vue";

interface SelectItem {
  value: string;
  label: string;
}

export default defineComponent({
  name: "SmoothSelectBox",
  props: {
    items: {
      type: Array as () => SelectItem[],
      required: true,
    },
    modelValue: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const isOpen = ref(false);
    const selectedValue = ref(props.modelValue);
    const dropdown = ref<HTMLElement | null>(null);
    const list = ref<HTMLElement | null>(null);

    const selectedItem = computed(() => {
      return props.items.find((item) => item.value === selectedValue.value);
    });

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };

    const selectItem = (item: SelectItem) => {
      selectedValue.value = item.value;
      emit("update:modelValue", item.value);
      isOpen.value = false;
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (list.value) {
        list.value.dataset.touchStartY = String(event.touches[0].clientY);
        list.value.dataset.scrollTop = String(list.value.scrollTop);
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (list.value) {
        const touchStartY = Number(list.value.dataset.touchStartY);
        const scrollTop = Number(list.value.dataset.scrollTop);
        const touchMoveY = event.touches[0].clientY;
        const deltaY = touchStartY - touchMoveY;

        list.value.scrollTop = scrollTop + deltaY;
      }
    };

    onMounted(() => {
      if (list.value) {
        list.value.addEventListener("touchstart", handleTouchStart);
        list.value.addEventListener("touchmove", handleTouchMove);
      }
    });

    onUnmounted(() => {
      if (list.value) {
        list.value.removeEventListener("touchstart", handleTouchStart);
        list.value.removeEventListener("touchmove", handleTouchMove);
      }
    });

    return {
      isOpen,
      selectedValue,
      toggleDropdown,
      selectItem,
      selectedItem,
      dropdown,
      list,
    };
  },
});
</script>

<style scoped>
.select-box {
  position: relative;
  width: 200px;
}
.selected-item {
  padding: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.arrow {
  margin-left: 10px;
}
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid #ccc;
  background-color: #fff;
  z-index: 1000;
  max-height: 200px; /* ドロップダウンの最大高さ */
  overflow: hidden;
}
.dropdown-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 200px; /* ドロップダウンリストの最大高さ */
  overflow-y: auto; /* 縦方向のスクロールを許可 */
  -webkit-overflow-scrolling: touch; /* 慣性スクロールを有効にする */
}
.dropdown-list li {
  padding: 10px;
  cursor: pointer;
}
.dropdown-list li.selected {
  background-color: #007bff;
  color: white;
}
.dropdown-list li:hover {
  background-color: #f1f1f1;
}
</style>
