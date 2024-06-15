<template>
  <div>
    <svg ref="svg" />
    <p id="text" ref="text" class="text" />
    <p id="offscreen-text" ref="offscreenText" class="offscreen-text" />
    <p class="bg-yellow-200 font-bold bg-opacity-30 inline p-0.5">
      いまの気持ちをシェアしよう！
      <span class="count">{{ characterCount }} / {{ maxLength }}文字</span>
    </p>
    <div class="flex">
      <div class="voltage-container">
        <button
          type="button"
          class="voice-button w-15 h-15 text-white bg-white focus:ring-4 focus:outline-none focus:ring-green-300 rounded-lg text-sm px-2 py-2 text-center ml-2"
          @click="startSpeechRecognition"
        >
          <icon-mic />
        </button>
        <div class="voltage-bar"></div>
      </div>
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

// 入力フォームの字数制限
const maxLength = ref('30')
const characterCount = computed(() => comment.value.length)

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

  // 粒粒アニメーションを開始
  explodeText()

  // 1秒後に新しいコメントを設定する
  setTimeout(() => {
    comment.value = ''
    addPrompt(0)
  }, 1000)
  //comment.value = '' // 入力フォームをクリアする
}

/**
 * 音声認識を開始する関数
 */

const voiceVolume = ref(0)

const startSpeechRecognition = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    alert('このブラウザでは音声認識がサポートされていません。')
    return
  }

  const recognition = new SpeechRecognition()
  recognition.lang = 'ja-JP'
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  const voiceButton = document.querySelector('.voice-button')
  const voltageBar = document.querySelector('.voltage-bar')

  let audioContext
  let scriptProcessor

  recognition.onstart = () => {
    voiceButton.classList.add('blinking')
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(processVolume)
      .catch((err) => {
        console.error('マイクアクセスエラー:', err)
        voiceButton.classList.remove('blinking')
      })
  }

  recognition.onend = () => {
    voiceButton.classList.remove('blinking')
    voiceButton.classList.remove('low-volume', 'normal-volume', 'high-volume')
    voltageBar.style.height = 0
    console.log(voltageBar.style.height)
    stopVolumeMeasurement()
  }

  recognition.onresult = (event) => {
    comment.value = ''
    const transcript = event.results[0][0].transcript
    comment.value += transcript
    onInputChange()
  }

  recognition.onerror = (event) => {
    console.error('音声認識エラー:', event.error)
    voiceButton.classList.remove('blinking')
    voiceButton.classList.remove('low-volume', 'normal-volume', 'high-volume')
    voltageBar.style.height = 0
    stopVolumeMeasurement()
  }

  const processVolume = (stream) => {
    audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    const microphone = audioContext.createMediaStreamSource(stream)
    scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1)

    analyser.smoothingTimeConstant = 0.8
    analyser.fftSize = 1024

    microphone.connect(analyser)
    analyser.connect(scriptProcessor)
    scriptProcessor.connect(audioContext.destination)

    scriptProcessor.onaudioprocess = () => {
      const array = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(array)
      let maxValue = 0

      const length = array.length
      // ボルテージに基づいてクラスを変更
      voiceVolume.value = 0
      voiceButton.classList.remove('low-volume', 'normal-volume', 'high-volume')
      voltageBar.classList.remove('low-volume', 'normal-volume', 'high-volume')
      for (let i = 0; i < length; i++) {
        if (array[i] > maxValue) maxValue = array[i]
        if (maxValue > voiceVolume.value) voiceVolume.value = maxValue
        if (voiceVolume.value <= 100) {
          voiceButton.classList.add('low-volume')
          voltageBar.classList.add('low-volume')
        } else if (voiceVolume.value <= 150) {
          voiceButton.classList.add('normal-volume')
          voltageBar.classList.add('normal-volume')
        } else if (voiceVolume.value >= 200) {
          voiceButton.classList.add('high-volume')
          voltageBar.classList.add('high-volume')
        }
        voltageBar.style.height = `${voiceVolume.value}px`
      }
    }
  }
  const stopVolumeMeasurement = () => {
    if (scriptProcessor) {
      scriptProcessor.disconnect()
      scriptProcessor = null
    }
    if (audioContext) {
      audioContext.close()
      audioContext = null
    }
  }

  recognition.start()
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

// 送信時のアニメーション
const explodeText = () => {
  letters.forEach((letter, i) => {
    const particles = createParticleEffect(letter.onScreen, i)
    gsap.to(letter.onScreen, {
      duration: 1, // 少し遅く消える
      x: `+=${Math.random() * 200 - 100}`, // 横方向の飛距離を適度に
      y: `-= ${Math.random() * 200 + 100}`, // 縦方向を上昇するように変更
      scale: 0,
      opacity: 0,
      ease: Power2.easeOut,
      onComplete: () => {
        text.value!.removeChild(letter.onScreen)
        offscreenText.value!.removeChild(letter.offScreen)
      }
    })
    particles.forEach((particle) => {
      gsap.to(particle, {
        duration: 2, // 粒粒のアニメーション時間を長くする
        x: `+=${Math.random() * 200 - 100}`, // 横方向の飛距離を適度に
        y: `-= ${Math.random() * 200 + 100}`, // 縦方向を上昇するように変更
        opacity: 0,
        scale: 0,
        ease: Power2.easeOut,
        onComplete: () => {
          particle.remove()
        }
      })
    })
  })
  letters.length = 0
}

const createParticleEffect = (
  letter: HTMLElement,
  index: number
): HTMLElement[] => {
  const particles: HTMLElement[] = []
  const color = colors[index % colors.length]
  const bounds = letter.getBoundingClientRect()
  const letterWidth = bounds.width
  const letterHeight = bounds.height
  const particleSize = Math.min(letterWidth, letterHeight) / 10

  for (let i = 0; i < 100; i++) {
    // 粒粒の数を増やす
    const particle = document.createElement('div')
    particle.style.position = 'absolute'
    particle.style.width = `${particleSize}px`
    particle.style.height = `${particleSize}px`
    particle.style.backgroundColor =
      color.shades[Math.floor(Math.random() * color.shades.length)]
    particle.style.borderRadius = '50%' // 丸い粒粒にする
    particle.style.left = `${bounds.left + Math.random() * letterWidth}px`
    particle.style.top = `${bounds.top + Math.random() * letterHeight}px`
    document.body.appendChild(particle)
    particles.push(particle)
  }

  return particles
}
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

/*
    音声入力中であることを示すために、ボタンにアニメーションを追加
    ボタンの背景色を点滅させるアニメーションを追加します
 */
@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

.blinking {
  animation: blink 1s infinite;
}

/* 声量のボルテージのCSS */
.voltage-bar {
  z-index: -3;
  position: fixed;
  bottom: 0;
  width: 30px;
  height: 0px;
  transition:
    width 0.5s ease,
    background-color 0.5s ease;
}

.low-volume {
  background-color: #4caf50; /* 緑 */
}

.normal-volume {
  background-color: #ffeb3b; /* 黄色 */
}

.high-volume {
  background-color: #f44336; /* 赤 */
}
</style>
