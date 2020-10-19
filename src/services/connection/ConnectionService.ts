import Superagent from 'superagent'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import HttpStatus from 'http-status-codes'
import sleep from '../../utils/SleepUtils'
import ConnectionLocalStorage from '../../local_storage/connection/ConnectionLocalStorage'
import ArrayUtils from '../../utils/ArrayUtils'
import LogAppErrorService from '../log_app_error/LogAppErrorService'

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

  isDisconnected = (): boolean => {
    return ConnectionLocalStorage.isDisconnected()
  }

  private start = () => {
    if (navigator.onLine) {
      ConnectionLocalStorage.setConnected()
      this.awaitForDinoConnection()
    } else {
      ConnectionLocalStorage.setDisconnected()
    }

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

  private isDinoConnected = async (): Promise<Boolean> => {
    try {
      const request = Superagent.get(DinoAPIURLConstants.TEST_CONNECTION)

      const response = await request

      return response.status === HttpStatus.OK
    } catch (e) {
      LogAppErrorService.saveError(e)
    }

    return false
  }

  private setConnected = () => {
    if (this.isDisconnected()) {
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
