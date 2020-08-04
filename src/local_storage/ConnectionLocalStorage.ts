import BaseLocalStorage from './BaseLocalStorage'
import LS_Constants from '../constants/LocalStorageKeysConstants'

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

  private setConnectionState = (connected: boolean) => {
    this.set(LS_Constants.CONNECTION, JSON.stringify(connected))
  }
}

export default new ConnectionLocalStorage()
