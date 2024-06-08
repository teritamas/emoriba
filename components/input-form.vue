<template>
  <div>
    <svg ref="svg" />
    <p
      id="text"
      ref="text"
      class="text"
    />
    <p
      id="offscreen-text"
      ref="offscreenText"
      class="offscreen-text"
    />
    <span>いま、どんな気持ち？みんなにシェアしよう！</span>
    <div class="flex">
      <label
        for="dropzone-file"
        class="flex flex-col items-center justify-center px-2 w-10 h-10 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            viewBox="0 0 512 512"
            style="width: 24px; height: 24px; opacity: 1"
          >
            <g>
              <path
                d="M256,224.828c-34.344,0-62.156,28.078-62.156,62.719s27.813,62.719,62.156,62.719s62.156-28.078,62.156-62.719
		S290.344,224.828,256,224.828z"
              />
              <path
                d="M478.766,135.75h-58.625c-13.078,0-24.938-7.75-30.297-19.781l-17.547-39.313
		c-5.359-12.016-17.234-19.766-30.313-19.766H170.016c-13.078,0-24.953,7.75-30.328,19.766l-17.531,39.313
		C116.797,128,104.938,135.75,91.859,135.75H33.234C14.875,135.75,0,150.766,0,169.266v252.328c0,18.5,14.875,33.516,33.234,33.516
		h244.25h201.281c18.344,0,33.234-15.016,33.234-33.516V169.266C512,150.766,497.109,135.75,478.766,135.75z M256,403.844
		c-63.688,0-115.297-52.063-115.297-116.297S192.313,171.234,256,171.234s115.297,52.078,115.297,116.313
		S319.688,403.844,256,403.844z"
              />
            </g>
          </svg>
        </div>
        <input
          id="dropzone-file"
          type="file"
          class="hidden"
        >
      </label>
      <input
        id="input"
        ref="input"
        v-model="comment"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-5 p-2.5"
        type="text"
        autofocus
        maxlength="30"
        @keyup="onInputChange"
      >
      <button
        type="button"
        class="w-15 h-15 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-2 py-2 text-center"
        @click="registerButtonClick"
      >
        <svg
          viewBox="0 0 512 512"
          style="width: 24px; height: 24px; opacity: 1"
        >
          <g>
            <polygon
              style="fill: white"
              points="121.71,463.73 211.257,394.524 121.71,333.638 	"
            />
            <polygon
              style="fill: white"
              points="0,216.127 122.938,305.26 465.837,86.043 152.628,326.791 335.73,459.532 512,48.27 	"
            />
          </g>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type RegisterCommentDto } from "@/types/Models/RegisterComment/RegisterCommentDto";
import { TweenLite, Power3, Back, Power1, Power2 } from "gsap";

class SVGElement {
  element: Element;

  constructor(element: Element) {
    this.element = element;
  }

  set(attributeName: string, value: string) {
    //(this.element as SVGElement).setAttribute(attributeName, value);
  }

  style(property: string, value: string) {
    (this.element as SVGElement).style[property] = value;
  }
}

const selectSVG = (id: string) => {
  const el = document.getElementById(id);
  return new SVGElement(el);
};

const createSVG = (type: string) => {
  const el = document.createElementNS("http://www.w3.org/2000/svg", type);
  return new SVGElement(el);
};

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

const props = defineProps({
  cameraAreaHeight: {
    type: Number,
  },
  cameraAreaWidth: {
    type: Number,
  },
});
const svg = ref<SVGElement>();
const text = ref<HTMLElement>();
const offscreenText = ref<HTMLElement>();
const input = ref<HTMLInputElement>();
const letters: {
  onScreen: HTMLElement;
  offScreen: HTMLElement;
  char: string;
  shift: boolean;
}[] = [];
const prompt = ["s", "t", "a", "r", "t", " ", "t", "y", "p", "i", "n", "g"];
let runPrompt = true;
let width = 0;
let height = 0;
let textSize = 0;
let textCenter = 0;

const colors = [
  { main: "#FBDB4A", shades: ["#FAE073", "#FCE790", "#FADD65", "#E4C650"] },
  { main: "#F3934A", shades: ["#F7B989", "#F9CDAA", "#DD8644", "#F39C59"] },
  { main: "#EB547D", shades: ["#EE7293", "#F191AB", "#D64D72", "#C04567"] },
  { main: "#9F6AA7", shades: ["#B084B6", "#C19FC7", "#916198", "#82588A"] },
  { main: "#5476B3", shades: ["#6382B9", "#829BC7", "#4D6CA3", "#3E5782"] },
  { main: "#2BB19B", shades: ["#4DBFAD", "#73CDBF", "#27A18D", "#1F8171"] },
  { main: "#70B984", shades: ["#7FBE90", "#98CBA6", "#68A87A", "#5E976E"] },
];

const resizePage = () => {
  width = props.cameraAreaWidth;
  height = props.cameraAreaHeight;
  svg.value?.set("height", height.toString());
  svg.value?.set("width", width.toString());
  svg.value?.set("viewBox", `0 0 ${width} ${height}`);
  resizeLetters();
};

const resizeLetters = () => {
  textSize = props.cameraAreaWidth / (letters.length + 2);
  if (textSize > 150) textSize = 150;
  text.value!.style.fontSize = `${textSize}px`;
  text.value!.style.height = `${textSize}px`;
  text.value!.style.lineHeight = `${textSize}px`;
  text.value!.style.width = `${props.cameraAreaWidth}px`;
  offscreenText.value!.style.fontSize = `${textSize}px`;
  const textRect = text.value!.getBoundingClientRect();
  textCenter = textRect.top + textRect.height / 2;
  positionLetters();
};

const positionLetters = () => {
  letters.forEach((letter) => {
    const timing = letter.shift ? 0.1 : 0;
    TweenLite.to(letter.onScreen, timing, {
      x: letter.offScreen.offsetLeft + "px",
      ease: Power3.easeInOut,
    });
    letter.shift = true;
  });
};

const animateLetterIn = (letter: HTMLElement) => {
  const yOffset = (0.5 + Math.random() * 0.5) * textSize;
  TweenLite.fromTo(letter, 0.4, { scale: 0 }, { scale: 1, ease: Back.easeOut });
  TweenLite.fromTo(
    letter,
    0.4,
    { opacity: 0 },
    { opacity: 1, ease: Power3.easeOut }
  );
  TweenLite.to(letter, 0.2, { y: -yOffset, ease: Power3.easeInOut });
  TweenLite.to(letter, 0.2, { y: 0, ease: Power3.easeInOut, delay: 0.2 });
  const rotation = -50 + Math.random() * 100;
  TweenLite.to(letter, 0.2, { rotation: rotation, ease: Power3.easeInOut });
  TweenLite.to(letter, 0.2, {
    rotation: 0,
    ease: Power3.easeInOut,
    delay: 0.2,
  });
};

const addDecor = (letter: HTMLElement, color: { shades: string[] }) => {
  setTimeout(() => {
    const rect = letter.getBoundingClientRect();
    const x0 = letter.offsetLeft + letter.offsetWidth / 2;
    const y0 = textCenter - textSize * 0.5;
    const shade = color.shades[Math.floor(Math.random() * 4)];
    for (let i = 0; i < 8; i++) addTri(x0, y0, shade);
    for (let i = 0; i < 8; i++) addCirc(x0, y0);
  }, 150);
};

const addTri = (x0: number, y0: number, shade: string) => {
  const tri = createSVG("polygon");
  const a = Math.random();
  const a2 = a + (-0.2 + Math.random() * 0.4);
  const r = textSize * 0.52;
  const r2 = r + textSize * Math.random() * 0.2;
  const x = x0 + r * Math.cos(2 * Math.PI * a);
  const y = y0 + r * Math.sin(2 * Math.PI * a);
  const x2 = x0 + r2 * Math.cos(2 * Math.PI * a2);
  const y2 = y0 + r2 * Math.sin(2 * Math.PI * a2);
  const triSize = textSize * 0.1;
  const scale = 0.3 + Math.random() * 0.7;
  const offset = triSize * scale;
  tri.set("points", `0,0 ${triSize * 2},0 ${triSize},${triSize * 2}`);
  tri.style("fill", shade);
  svg.value!.element.appendChild(tri.element);
  TweenLite.fromTo(
    tri.element,
    0.6,
    {
      rotation: Math.random() * 360,
      scale: scale,
      x: x - offset,
      y: y - offset,
      opacity: 1,
    },
    {
      x: x2 - offset,
      y: y2 - offset,
      opacity: 0,
      ease: Power1.easeInOut,
      onComplete: () => {
        svg.value!.element.removeChild(tri.element);
      },
    }
  );
};

const addCirc = (x0: number, y0: number) => {
  const circ = createSVG("circle");
  const a = Math.random();
  const r = textSize * 0.52;
  const r2 = r + textSize;
  const x = x0 + r * Math.cos(2 * Math.PI * a);
  const y = y0 + r * Math.sin(2 * Math.PI * a);
  const x2 = x0 + r2 * Math.cos(2 * Math.PI * a);
  const y2 = y0 + r2 * Math.sin(2 * Math.PI * a);
  const circSize = textSize * 0.05 * Math.random();
  circ.set("r", circSize);
  circ.style("fill", "#eee");
  svg.value!.element.appendChild(circ.element);
  TweenLite.fromTo(
    circ.element,
    0.6,
    { x: x - circSize, y: y - circSize, opacity: 1 },
    {
      x: x2 - circSize,
      y: y2 - circSize,
      opacity: 0,
      ease: Power1.easeInOut,
      onComplete: () => {
        svg.value!.element.removeChild(circ.element);
      },
    }
  );
};

const addLetter = (char: string, i: number) => {
  const letter = document.createElement("span");
  const oLetter = document.createElement("span");
  letter.innerHTML = char;
  oLetter.innerHTML = char;
  text.value!.appendChild(letter);
  const color = colors[i % colors.length];
  letter.style.color = color.main;
  offscreenText.value!.appendChild(oLetter);
  letters[i] = {
    offScreen: oLetter,
    onScreen: letter,
    char: char,
    shift: false,
  };
  animateLetterIn(letter);
  addDecor(oLetter, color);
};

const addLetters = (value: string[]) => {
  value.forEach((char, i) => {
    if (letters[i] && letters[i].char !== char) {
      letters[i].onScreen.innerHTML = char;
      letters[i].offScreen.innerHTML = char;
      letters[i].char = char;
    }
    if (letters[i] === undefined) {
      addLetter(char, i);
    }
  });
};

const animateLetterOut = (
  letter: {
    onScreen: HTMLElement;
    offScreen: HTMLElement;
    char: string;
    shift: boolean;
  },
  i: number
) => {
  TweenLite.to(letter.onScreen, 0.1, {
    scale: 0,
    opacity: 0,
    ease: Power2.easeIn,
    onComplete: () => {
      offscreenText.value!.removeChild(letter.offScreen);
      text.value!.removeChild(letter.onScreen);
      positionLetters();
    },
  });
  letters.splice(i, 1);
};

const removeLetters = (value: string[]) => {
  for (let i = letters.length - 1; i >= 0; i--) {
    const letter = letters[i];
    if (value[i] === undefined) {
      animateLetterOut(letter, i);
    }
  }
};

const onInputChange = () => {
  const value =
    comment.value === "" ? [] : comment.value.toLowerCase().split("");
  addLetters(value);
  removeLetters(value);
  resizeLetters();
};

const keyup = (e: KeyboardEvent) => {
  if (runPrompt) {
    comment.value = "";
    runPrompt = false;
  }
  onInputChange();
};

const addPrompt = (i: number) => {
  setTimeout(() => {
    if (runPrompt && prompt[i]) {
      comment.value = comment.value + prompt[i];
      onInputChange();
      addPrompt(i + 1);
    }
  }, 300);
};

onMounted(() => {
  svg.value = selectSVG("svg");
  text.value = document.getElementById("text")!;
  offscreenText.value = document.getElementById("offscreen-text")!;
  input.value = document.getElementById("input") as HTMLInputElement;
  resizePage();
  window.addEventListener("resize", resizePage);
  input.value.addEventListener("keyup", keyup);
  input.value.focus();
  addPrompt(0);
});

onUnmounted(() => {
  window.removeEventListener("resize", resizePage);
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Rubik+Mono+One&display=swap");

p span {
  font-family: "Rubik Mono One", "Noto Sans JP", sans-serif;
}

#svg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 0;
}

.text,
.offscreen-text {
  top: 50%;
  transform: translateY(-50%);
  display: block;
  position: absolute;
  margin: 0;
}

.offscreen-text {
  text-align: center;
  top: -9999px;
}

.text span {
  position: absolute;
}
</style>