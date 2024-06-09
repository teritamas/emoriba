export default interface RegisterCommentRequest {
  coordinates: {
    latitude: number
    longitude: number
  }
  comment: string
  eventName: string
}
