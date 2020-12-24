import SynchronizableWSGenericModel from '../../types/synchronizable/api/web_socket/SynchronizableWSGenericModel'

type SynchronizableWSGenericCallBackFunction = (
  model: SynchronizableWSGenericModel<any>
) => Promise<void>

interface QueueItem {
  model: SynchronizableWSGenericModel<any>
  callback: SynchronizableWSGenericCallBackFunction
}

class SynchronizableWSSubscriberQueue {
  private queueItems: QueueItem[]
  private running: boolean

  constructor() {
    this.queueItems = []
    this.running = false
  }

  addItem(
    callback: SynchronizableWSGenericCallBackFunction,
    model: SynchronizableWSGenericModel<any>
  ) {
    this.queueItems.push({
      callback: callback,
      model: model,
    })

    if (!this.running) {
      this.running = true
      this.run()
    }
  }

  private async run() {
    while (this.queueItems.length > 0) {
      const item = this.queueItems.shift()

      if (item) {
        await item.callback(item.model)
      }
    }

    this.running = false
  }
}

export default new SynchronizableWSSubscriberQueue()
