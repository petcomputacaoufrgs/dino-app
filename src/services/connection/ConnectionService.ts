import Superagent from 'superagent'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import HttpStatus from 'http-status-codes'
import sleep from '../../utils/SleepUtils'
import ConnectionLocalStorage from './local_storage/ConnectionLocalStorage'
import ArrayUtils from '../../utils/ArrayUtils'

export type ConnectionListennerCallback = (online: boolean) => void

const DELAY_TO_VERIFY_DINO_CONNECTION = 2500

class ConnectionService {
  callbacks = [] as ConnectionListennerCallback[]

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

  private start = () => {
    ConnectionLocalStorage.setConnected()
    this.awaitForDinoConnection()

    window.addEventListener('online', async () => {
      this.awaitForDinoConnection()
    })

    window.addEventListener('offline', () => {
      this.setDisconnected()
    })
  }

  private awaitForDinoConnection = async () => {
    let isConnected = this.isConnected()

    while (navigator.onLine) {
      const isDinoConnected = await this.isDinoConnected()

      if (isDinoConnected) {
        this.setConnected()
        break
      } else if (isConnected) {
        isConnected = false
        this.setDisconnected()
      }

      await sleep(DELAY_TO_VERIFY_DINO_CONNECTION)
    }
  }

  private isDinoConnected = async(): Promise<Boolean> => {
    try {
      const request = Superagent.get(DinoAPIURLConstants.TEST_CONNECTION)

      const response = await request

      return response.status === HttpStatus.OK
    } catch {
      /** TO-DO Log error */
    }

    return false
  }

  private setConnected = () => {
    if (this.isDiconnected()) {
      ConnectionLocalStorage.setConnected()

      this.callbacks.forEach((callback) => callback(true))
    }
  }

  private setDisconnected = () => {
    if (this.isConnected()) {
      ConnectionLocalStorage.setDisconnected()

      this.callbacks.forEach((callback) => callback(false))
    }
  }
}

export default new ConnectionService()
