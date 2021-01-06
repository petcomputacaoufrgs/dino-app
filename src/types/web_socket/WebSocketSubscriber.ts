import WebSocketCallback from "./WebSocketCallback"

export default interface WebSocketSubscriber<DATA_TYPE> {
  path: string
  callback: WebSocketCallback<DATA_TYPE>
}