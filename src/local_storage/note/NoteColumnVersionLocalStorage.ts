import BaseLocalStorage from "../BaseLocalStorage"
import LS_Constants from '../../constants/LocalStorageKeysConstants'

class NoteColumnVersionLocalStorage extends BaseLocalStorage {
  getVersion = (): number => {
    const version = this.get(LS_Constants.NOTE_COLUMN_VERSION)

    if (version) {
      return JSON.parse(version)
    }

    return -1
  }

  setVersion = (version: number) => {
    this.set(LS_Constants.NOTE_COLUMN_VERSION, JSON.stringify(version))
  }

  removeVersion = () => {
    this.remove(LS_Constants.NOTE_COLUMN_VERSION)
  }

  removeUserData = () => {
    this.removeVersion()
  }
}

export default new NoteColumnVersionLocalStorage()