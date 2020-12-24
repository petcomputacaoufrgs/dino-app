import Superagent from 'superagent'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import HttpStatus from 'http-status-codes'
import sleep from '../../utils/SleepUtils'
import ConnectionLocalStorage from '../../storage/local_storage/connection/ConnectionLocalStorage'
import ArrayUtils from '../../utils/ArrayUtils'

export type ConnectionListennerCallback = (online: boolean) => void

const DELAY_TO_VERIFY_DINO_CONNECTION = 2000

class ConnectionService {
  callbacks: ConnectionListennerCallback[]
  tryingToConnect: boolean
  constructor() {
    this.callbacks = []
    this.tryingToConnect = false
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

  isDinoConnected = async (): Promise<Boolean> => {
    const isConnected = await this.internalIsDinoConnected()

    if (!isConnected) {
      this.verify()
    }

    return isConnected
  }

  verify = () => {
    if (navigator.onLine) {
      this.awaitForDinoConnection()
    } else {
      this.setDisconnected()
    }
  }

  private internalIsDinoConnected = async (): Promise<Boolean> => {
    try {
      const request = Superagent.get(APIRequestMappingConstants.TEST_CONNECTION)

      const response = await request

      return response.status === HttpStatus.OK
    } catch (e) {
      return false
    }
  }

  private start = () => {
    if (navigator.onLine) {
      ConnectionLocalStorage.setConnected()
      this.awaitForDinoConnection()
    } else {
      ConnectionLocalStorage.setDisconnected()
    }

    window.addEventListener('online', () => {
      this.awaitForDinoConnection()
    })

    window.addEventListener('offline', () => {
      this.setDisconnected()
    })
  }

  private awaitForDinoConnection = async () => {
    if (!this.tryingToConnect) {
      this.tryingToConnect = true
      while (navigator.onLine) {
        const isDinoConnected = await this.isDinoConnected()
        if (isDinoConnected) {
          this.setConnected()
          this.tryingToConnect = false
          break
        } else {
          this.setDisconnected()
        }

        await sleep(DELAY_TO_VERIFY_DINO_CONNECTION)
      }
    }
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
