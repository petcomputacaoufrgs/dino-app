import BaseLocalStorage from '../../BaseLocalStorage'
import LS_Constants from '../../../constants/LocalStorageKeysConstants'

class NoteUpdateLocalStorage extends BaseLocalStorage {

    getUpdatingNotes = (): boolean => {
        const updating = this.get(LS_Constants.UPDATING_NOTES)

        if (updating) {
            return JSON.parse(updating)
        }

        return false
    }

    setUpdatingNotes = (updating: boolean) => {
        this.set(LS_Constants.UPDATING_NOTES, JSON.stringify(updating))
    }

    removeUpdatingNotes = () => {
        this.remove(LS_Constants.UPDATING_NOTES)
    }

    getUpdateNotesWithError = (): boolean => {
        const updateError = this.get(LS_Constants.UPDATE_NOTES_WITH_ERROR)

        if (updateError) {
            return JSON.parse(updateError)
        }

        return false
    }

    setUpdateNotesWithError = (hasError: boolean) => {
        this.set(LS_Constants.UPDATE_NOTES_WITH_ERROR, JSON.stringify(hasError))
    }

    removeUpdateNotesWithError = () => {
        this.remove(LS_Constants.UPDATE_NOTES_WITH_ERROR)
    }

    removeUserData = () => {
        this.removeUpdateNotesWithError()
        this.removeUpdatingNotes()
    }

}

export default new NoteUpdateLocalStorage()