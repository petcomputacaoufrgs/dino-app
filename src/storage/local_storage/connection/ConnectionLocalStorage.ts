import BaseLocalStorage from '../BaseLocalStorage'
import LS_Constants from '../../../constants/local_storage/LocalStorageKeysConstants'

class ConnectionLocalStorage extends BaseLocalStorage {
  isConnected = (): boolean => {
    const isConnected = this.get(LS_Constants.CONNECTION)

    return isConnected ? JSON.parse(isConnected) : true
  }

  isDisconnected = (): boolean => {
    return !this.isConnected()
  }

  setConnected = () => {
    this.setConnectionState(true)
  }

  setDisconnected = () => {
    this.setConnectionState(false)
  }

  setTryingToConnected = (value: boolean) => {
    this.set(LS_Constants.TRYING_CONNECTION, JSON.stringify(value))
  }

  isTryingToConnected = () => {
    const value = this.get(LS_Constants.TRYING_CONNECTION)

    if (value) {
      return JSON.parse(value)
    }

    return false
  }

  private setConnectionState = (connected: boolean) => {
    this.set(LS_Constants.CONNECTION, JSON.stringify(connected))
  }
}

export default new ConnectionLocalStorage()
