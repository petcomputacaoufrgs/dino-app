import SubscriberItem from '../types/web_socket/SubscriberItem'

const CONFLIT_POOL_DELAY_MS = 250

export default abstract class BaseWebSocketSubscriber {
  items: SubscriberItem[]
  updating: boolean

  constructor(items: SubscriberItem[]) {
    this.updating = false
    this.items = items
  }

  async conflictingMethodsQueue(f: () => Promise<void>) {
    if (this.updating) {
      setTimeout(() => this.conflictingMethodsQueue(f), CONFLIT_POOL_DELAY_MS)
    } else {
      this.updating = true
      await f()
      this.updating = false
    }
  }
}
