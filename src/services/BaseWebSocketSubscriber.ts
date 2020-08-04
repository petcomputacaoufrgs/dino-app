export default interface BaseWebSocketSubscriber {
  path: string
  callback: (data: any) => void
}
