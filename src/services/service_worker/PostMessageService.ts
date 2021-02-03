import PostMessageData from '../../types/service_worker/PostMessageData'
import PostMessageType from '../../types/service_worker/PostMessageType'
import TabControlService from '../tab_control/TabControlService'

class PostMessageService {
	private hasServiceWorkerController: boolean

	constructor() {
		this.hasServiceWorkerController =
			process.env.NODE_ENV === 'production' &&
			Boolean(navigator.serviceWorker && navigator.serviceWorker.controller)
	}

	start = () => {
		this.postMessageSubscriber()
	}

	private postMessageSubscriber = () => {
		if (this.hasServiceWorkerController) {
			navigator.serviceWorker.addEventListener('message', event => {
				if (event.data && event.data.type) {
					if (event.data.type === PostMessageType.CHANGE_MAIN_TAB) {
						TabControlService.onMessageReceived()
						return
					}

					if (
						event.data.type === PostMessageType.TAB_PROOF_OF_LIFE_REQUISITION
					) {
						TabControlService.onProofOfLifeRequisition(event.data.info)
						return
					}
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
