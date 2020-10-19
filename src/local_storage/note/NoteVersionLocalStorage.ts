import LS_Constants from '../../constants/local_storage/LocalStorageKeysConstants'
import BaseLocalStorage from '../BaseLocalStorage'

class NoteVersionLocalStorage extends BaseLocalStorage {
  getVersion = (): number => {
    const version = this.get(LS_Constants.NOTE_VERSION)

    if (version) {
      return JSON.parse(version)
    }

    return -1
  }

  setVersion = (version: number) => {
    this.set(LS_Constants.NOTE_VERSION, JSON.stringify(version))
  }

  removeVersion = () => {
    this.remove(LS_Constants.NOTE_VERSION)
  }

  removeUserData = () => {
    this.removeVersion()
  }
}

export default new NoteVersionLocalStorage()
