import DinoAgentService from '../dino_agent/DinoAgentService'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import HttpStatus from 'http-status-codes'
import sleep from '../../utils/SleepUtils'
import ConnectionLocalStorage from './local_storage/ConnectionLocalStorage'
import ArrayUtils from '../../utils/ArrayUtils'

export type ConnectionListennerCallback = (online: boolean) => void

const DELAY_TO_VERIFY_DINO_CONNECTION = 5000

class ConnectionListenerService {
  callbacks = [] as ConnectionListennerCallback[]
  firstVerification = true

  constructor() {
    this.start()
  }

  addEventListener = (callback: ConnectionListennerCallback) => {
    if (!this.callbacks.includes(callback)) {
      this.callbacks.push(callback)
    }
  }

  removeEventListener = (callback: ConnectionListennerCallback) => {
    this.callbacks = ArrayUtils.remove(this.callbacks, callback)
  }

  isConnected = (): boolean => {
    return ConnectionLocalStorage.isConnected()
  }

  isDiconnected = (): boolean => {
    return ConnectionLocalStorage.isDisconnected()
  }

  private start = async () => {
    window.addEventListener('online', async () => {
      this.awaitForDinoConnection()
    })

    window.addEventListener('offline', () => {
      this.setDisconnected()
    })
  }

  private awaitForDinoConnection = async () => {
    while (navigator.onLine) {
      const isDinoConnected = await this.isDinoConnected()

      if (isDinoConnected) {
        this.setConnected()
        break
      }

      await sleep(DELAY_TO_VERIFY_DINO_CONNECTION)
    }
  }

  private isDinoConnected = async (): Promise<Boolean> => {
    try {
      const request = DinoAgentService.get(DinoAPIURLConstants.TEST_CONNECTION)

      const response = await request.get()

      return response.status === HttpStatus.OK
    } catch {
      return false
    }
  }

  private setConnected = () => {
    console.log(this.isDiconnected())
    console.log(this.firstVerification)

    if (this.isDiconnected() || this.firstVerification) {
      ConnectionLocalStorage.setConnected()

      this.callbacks.forEach((callback) => callback(true))

      if (this.firstVerification) {
        this.firstVerification = false
      }
    }
  }

  private setDisconnected = () => {
    if (this.isConnected() || this.firstVerification) {
      ConnectionLocalStorage.setDisconnected()

      this.callbacks.forEach((callback) => callback(false))

      if (this.firstVerification) {
        this.firstVerification = false
      }
    }
  }
}

export default new ConnectionListenerService()
