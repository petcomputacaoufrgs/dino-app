type WebSocketCallback<DATA_TYPE> = (data: DATA_TYPE | undefined) => Promise<void>

export default WebSocketCallback
