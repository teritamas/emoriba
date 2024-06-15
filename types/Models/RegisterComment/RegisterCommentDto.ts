import type { VoiceVolume } from '@/types/Constant/VoiceVolume'

export default interface RegisterCommentDto {
  comment: string
  voiceVolume: VoiceVolume
  // 画像も登録できるようにしたい
}
