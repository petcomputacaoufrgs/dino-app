import PostMessageData from "../../types/service_worker/PostMessageData"
import PostMessageType from "../../types/service_worker/PostMessageType"
import TabControlService from "../tab_control/TabControlService"

class PostMessageService {
  private hasServiceWorkerController: boolean

  constructor() {
    this.hasServiceWorkerController = Boolean(navigator.serviceWorker && navigator.serviceWorker.controller)
  }

  register = async () => {
    await this.postMessageSubscriber()
  }

  private postMessageSubscriber = async () => {
    if (this.hasServiceWorkerController) {
			navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type && event.data.type === PostMessageType.CHANGE_MAIN_TAB) {
          TabControlService.onMessageReceived(event.data)
        }
			})
		}
  }

  sendPostMessage = <T>(message: PostMessageData<T>) => {
    if (this.hasServiceWorkerController) {
			navigator.serviceWorker.controller!.postMessage(message)
		}
  }
}

export default new PostMessageService()