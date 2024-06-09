import { defineNuxtPlugin } from '#app'
import { Toast, Col, Button, Picker } from 'vant'

import 'vant/lib/index.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast).use(Picker).use(Col).use(Button)
})
