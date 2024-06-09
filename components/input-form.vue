<template>
  <div>
    <svg ref="svg" />
    <p id="text" ref="text" class="text" />
    <p id="offscreen-text" ref="offscreenText" class="offscreen-text" />
    <p class="bg-yellow-200 font-bold bg-opacity-30">
      いまの気持ちをシェアしよう！
      <span class="count">{{ characterCount }} / {{ maxLength }}文字</span>
    </p>
    <div class="flex">
      <label
        for="dropzone-file"
        class="flex flex-col items-center justify-center px-2 w-10 h-10 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
      >
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
          <icon-camera />
        </div>
        <input id="dropzone-file" type="file" class="hidden" />
      </label>
      <input
        id="input"
        ref="input"
        v-model="comment"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-5 p-2.5"
        type="text"
        autofocus
        :maxlength="maxLength"
        @keyup="onInputChange"
      />
      <button
        type="button"
        class="w-15 h-15 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-sm px-2 py-2 text-center"
        @click="registerButtonClick"
      >
        <icon-send />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap, Power3, Back, Power1, Power2 } from 'gsap'
import type RegisterCommentDto from '@/types/Models/RegisterComment/RegisterCommentDto'

const props = defineProps({
  cameraAreaHeight: {
    type: Number
  },
  cameraAreaWidth: {
    type: Number
  }
})

// 入力フォームの字数制限とバリデーション

const maxLength = ref('30')
const characterCount = computed(() => comment.value.length)
const isLimit = computed(() => characterCount.value >= maxLength)

// 入力フォームの値を取得する
const comment = ref('')
const emits = defineEmits(['registerButtonClick'])
/**
 * 登録ボタンがクリックされたときの処理
 */
const registerButtonClick = () => {
  const dto = {
    comment: comment.value
  } as RegisterCommentDto
  emits('registerButtonClick', dto) // 投稿する
  comment.value = '' // 入力フォームをクリアする
}

/**
 * この行以降、アニメーションの処理
 */
class SVGElement {
  element: Element

  constructor(element: Element) {
    this.element = element
  }

  set(attributeName: string, value: string) {
    //(this.element as SVGElement).setAttribute(attributeName, value);
  }

  style(property: string, value: string) {
    ;(this.element as SVGElement).style[property] = value
  }
}

const selectSVG = (id: string) => {
  const el = document.getElementById(id)
  return new SVGElement(el)
}

const createSVG = (type: string) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', type)
  return new SVGElement(el)
}

const svg = ref<SVGElement>()
const text = ref<HTMLElement>()
const offscreenText = ref<HTMLElement>()
const input = ref<HTMLInputElement>()
const letters: {
  onScreen: HTMLElement
  offScreen: HTMLElement
  char: string
  shift: boolean
}[] = []
// デフォルト表示用の5つの単語を格納した配列
const phrases = [
  'げきあつ！',
  'さいこう！',
  'どきどき！',
  'わくわく！',
  'ありがとう！'
]
let runPrompt = true
let width = 0
let height = 0
let textSize = 0
let textCenter = 0

const colors = [
  { main: '#FBDB4A', shades: ['#FAE073', '#FCE790', '#FADD65', '#E4C650'] },
  { main: '#F3934A', shades: ['#F7B989', '#F9CDAA', '#DD8644', '#F39C59'] },
  { main: '#EB547D', shades: ['#EE7293', '#F191AB', '#D64D72', '#C04567'] },
  { main: '#9F6AA7', shades: ['#B084B6', '#C19FC7', '#916198', '#82588A'] },
  { main: '#5476B3', shades: ['#6382B9', '#829BC7', '#4D6CA3', '#3E5782'] },
  { main: '#2BB19B', shades: ['#4DBFAD', '#73CDBF', '#27A18D', '#1F8171'] },
  { main: '#70B984', shades: ['#7FBE90', '#98CBA6', '#68A87A', '#5E976E'] }
]

const resizePage = () => {
  width = props.cameraAreaWidth
  height = props.cameraAreaHeight
  //  svg.value?.set('height', height.toString())
  //  svg.value?.set('width', width.toString())
  //  svg.value?.set('viewBox', `0 0 ${width} ${height}`)
  resizeLetters()
}

const resizeLetters = () => {
  textSize = props.cameraAreaWidth / (letters.length + 2)
  if (textSize > 150) textSize = 150
  text.value!.style.fontSize = `${textSize}px`
  text.value!.style.height = `${textSize}px`
  text.value!.style.lineHeight = `${textSize}px`
  text.value!.style.width = `${props.cameraAreaWidth}px`
  offscreenText.value!.style.fontSize = `${textSize}px`
  const textRect = text.value!.getBoundingClientRect()
  textCenter = textRect.top + textRect.height / 2
  positionLetters()
}

const positionLetters = () => {
  letters.forEach((letter) => {
    const timing = letter.shift ? 0.1 : 0
    gsap.to(letter.onScreen, timing, {
      x: letter.offScreen.offsetLeft + 'px',
      ease: Power3.easeInOut
    })
    letter.shift = true
  })
}

const animateLetterIn = (letter: HTMLElement) => {
  const yOffset = (0.5 + Math.random() * 0.5) * textSize
  gsap.fromTo(letter, 0.4, { scale: 0 }, { scale: 1, ease: Back.easeOut })
  gsap.fromTo(letter, 0.4, { opacity: 0 }, { opacity: 1, ease: Power3.easeOut })
  gsap.to(letter, 0.2, { y: -yOffset, ease: Power3.easeInOut })
  gsap.to(letter, 0.2, { y: 0, ease: Power3.easeInOut, delay: 0.2 })
  const rotation = -50 + Math.random() * 100
  gsap.to(letter, 0.2, { rotation: rotation, ease: Power3.easeInOut })
  gsap.to(letter, 0.2, {
    rotation: 0,
    ease: Power3.easeInOut,
    delay: 0.2
  })
}

const addDecor = (letter: HTMLElement, color: { shades: string[] }) => {
  setTimeout(() => {
    const rect = letter.getBoundingClientRect()
    const x0 = letter.offsetLeft + letter.offsetWidth / 2
    const y0 = textCenter - textSize * 0.5
    const shade = color.shades[Math.floor(Math.random() * 4)]
    //for (let i = 0; i < 8; i++) addTri(x0, y0, shade)
    //for (let i = 0; i < 8; i++) addCirc(x0, y0)
  }, 150)
}

const addTri = (x0: number, y0: number, shade: string) => {
  const tri = createSVG('polygon')
  const a = Math.random()
  const a2 = a + (-0.2 + Math.random() * 0.4)
  const r = textSize * 0.52
  const r2 = r + textSize * Math.random() * 0.2
  const x = x0 + r * Math.cos(2 * Math.PI * a)
  const y = y0 + r * Math.sin(2 * Math.PI * a)
  const x2 = x0 + r2 * Math.cos(2 * Math.PI * a2)
  const y2 = y0 + r2 * Math.sin(2 * Math.PI * a2)
  const triSize = textSize * 0.1
  const scale = 0.3 + Math.random() * 0.7
  const offset = triSize * scale
  tri.set('points', `0,0 ${triSize * 2},0 ${triSize},${triSize * 2}`)
  tri.style('fill', shade)
  svg.value!.appendChild(tri.element)
  gsap.fromTo(
    tri.element,
    0.6,
    {
      rotation: Math.random() * 360,
      scale: scale,
      x: x - offset,
      y: y - offset,
      opacity: 1
    },
    {
      x: x2 - offset,
      y: y2 - offset,
      opacity: 0,
      ease: Power1.easeInOut,
      onComplete: () => {
        svg.value!.removeChild(tri.element)
      }
    }
  )
}

const addCirc = (x0: number, y0: number) => {
  const circ = createSVG('circle')
  const a = Math.random()
  const r = textSize * 0.52
  const r2 = r + textSize
  const x = x0 + r * Math.cos(2 * Math.PI * a)
  const y = y0 + r * Math.sin(2 * Math.PI * a)
  const x2 = x0 + r2 * Math.cos(2 * Math.PI * a)
  const y2 = y0 + r2 * Math.sin(2 * Math.PI * a)
  const circSize = textSize * 0.05 * Math.random()
  circ.set('r', circSize)
  circ.style('fill', '#eee')
  svg.value!.appendChild(circ.element)
  gsap.fromTo(
    circ.element,
    0.6,
    { x: x - circSize, y: y - circSize, opacity: 1 },
    {
      x: x2 - circSize,
      y: y2 - circSize,
      opacity: 0,
      ease: Power1.easeInOut,
      onComplete: () => {
        svg.value!.removeChild(circ.element)
      }
    }
  )
}

const addLetter = (char: string, i: number) => {
  const letter = document.createElement('span')
  const oLetter = document.createElement('span')
  letter.innerHTML = char
  oLetter.innerHTML = char
  if (!letter) return
  text.value!.appendChild(letter)
  const color = colors[i % colors.length]
  letter.style.color = color.main
  offscreenText.value!.appendChild(oLetter)
  letters[i] = {
    offScreen: oLetter,
    onScreen: letter,
    char: char,
    shift: false
  }
  animateLetterIn(letter)
  addDecor(oLetter, color)
}

const addLetters = (value: string[]) => {
  value.forEach((char, i) => {
    if (letters[i] && letters[i].char !== char) {
      letters[i].onScreen.innerHTML = char
      letters[i].offScreen.innerHTML = char
      letters[i].char = char
    }
    if (letters[i] === undefined) {
      addLetter(char, i)
    }
  })
}

const animateLetterOut = (
  letter: {
    onScreen: HTMLElement
    offScreen: HTMLElement
    char: string
    shift: boolean
  },
  i: number
) => {
  gsap.to(letter.onScreen, 0.1, {
    scale: 0,
    opacity: 0,
    ease: Power2.easeIn,
    onComplete: () => {
      offscreenText.value!.removeChild(letter.offScreen)
      text.value!.removeChild(letter.onScreen)
      positionLetters()
    }
  })
  letters.splice(i, 1)
}

const removeLetters = (value: string[]) => {
  for (let i = letters.length - 1; i >= 0; i--) {
    const letter = letters[i]
    if (value[i] === undefined) {
      animateLetterOut(letter, i)
    }
  }
}

const onInputChange = () => {
  const value =
    comment.value === '' ? [] : comment.value.toLowerCase().split('')
  addLetters(value)
  removeLetters(value)
  resizeLetters()
}

const keyup = (e: KeyboardEvent) => {
  if (runPrompt) {
    comment.value = ''
    runPrompt = false
  }
  onInputChange()
}

// ランダムに単語を選択する関数
const getRandomPhrase = () => {
  const randomIndex = Math.floor(Math.random() * phrases.length)
  return phrases[randomIndex]
}

// ランダムに選択された単語をpromptとして設定
const prompt = getRandomPhrase().split('')

// 一文字ずつ出力する関数
const addPrompt = (i) => {
  setTimeout(() => {
    if (runPrompt && prompt[i]) {
      comment.value = comment.value + prompt[i]
      onInputChange()
      addPrompt(i + 1)
    }
  }, 300)
}

onMounted(() => {
  svg.value = selectSVG('svg')
  text.value = document.getElementById('text')!
  offscreenText.value = document.getElementById('offscreen-text')!
  input.value = document.getElementById('input') as HTMLInputElement
  resizePage()
  window.addEventListener('resize', resizePage)
  input.value.addEventListener('keyup', keyup)
  input.value.focus()
  addPrompt(0)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizePage)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Rubik+Mono+One&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Murecho:wght@100..900&display=swap');
p span {
  font-weight: bold;
  font-family: 'Rubik Mono One', 'Murecho', 'Noto Sans JP', sans-serif;
}

.count {
  font-family: 'Murecho', 'Noto Sans JP', sans-serif;
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
