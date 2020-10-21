import NoteVersionLocalStorage from '../../local_storage/note/NoteVersionLocalStorage'
import NoteSyncLocalStorage from '../../local_storage/note/NoteSyncLocalStorage'

class NoteLocalStorageService {
  setVersion = (version: number) => {
    NoteVersionLocalStorage.setVersion(version)
  }

  getVersion = (): number => NoteVersionLocalStorage.getVersion()

  shouldSync = (): boolean => {
    return NoteSyncLocalStorage.getShouldSync()
  }

  setShouldSync = (should: boolean) => {
    return NoteSyncLocalStorage.setShouldSync(should)
  }

  setShouldSyncOrder = (should: boolean) => {
    return NoteSyncLocalStorage.setShouldSyncOrder(should)
  }

  shouldSyncOrder = (): boolean => {
    return NoteSyncLocalStorage.getShouldSyncOrder()
  }

  removeUserData = () => {
    NoteVersionLocalStorage.removeUserData()
    NoteSyncLocalStorage.removeUserData()
  }
}

export default new NoteLocalStorageService()
