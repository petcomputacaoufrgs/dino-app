import NoteColumnVersionLocalStorage from '../../local_storage/note/NoteColumnVersionLocalStorage'
import NoteColumnSyncLocalStorage from '../../local_storage/note/NoteColumnSyncLocalStorage'

class NoteColumnLocalStorageService {
  setVersion = (version: number) => {
    NoteColumnVersionLocalStorage.setVersion(version)
  }

  getVersion = (): number => NoteColumnVersionLocalStorage.getVersion()

  shouldSync = (): boolean => {
    return NoteColumnSyncLocalStorage.getShouldSync()
  }

  setShouldSync = (should: boolean) => {
    return NoteColumnSyncLocalStorage.setShouldSync(should)
  }

  setShouldSyncOrder = (should: boolean) => {
    return NoteColumnSyncLocalStorage.setShouldSyncOrder(should)
  }

  shouldSyncOrder = (): boolean => {
    return NoteColumnSyncLocalStorage.getShouldSyncOrder()
  }

  removeUserData = () => {
    NoteColumnVersionLocalStorage.removeUserData()
    NoteColumnSyncLocalStorage.removeUserData()
  }
}

export default new NoteColumnLocalStorageService()
