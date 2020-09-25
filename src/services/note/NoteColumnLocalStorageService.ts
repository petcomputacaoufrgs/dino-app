import NoteColumnVersionLocalStorage from "../../local_storage/note/NoteColumnVersionLocalStorage"
import NoteColumnSyncLocalStorage from "../../local_storage/note/NoteColumnSyncLocalStorage"

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

    removeUserData = () => {
        NoteColumnVersionLocalStorage.removeUserData()
        NoteColumnSyncLocalStorage.removeUserData()
    }
}

export default new NoteColumnLocalStorageService()