import LocalStorage from './LocalStorage'
import LS_Constants from '../constants/LocalStorageKeysConstants'
import NoteDoc from '../database/note/NoteDoc'

class NotesLocalStorage extends LocalStorage {

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

    getNotesToDelete = (): NoteDoc[] => {
        const notesToDelete = this.get(LS_Constants.NOTES_TO_DELETE)

        if (notesToDelete) {
            return JSON.parse(notesToDelete)
        }
        
        return []
    }

    setNotesToDelete = (noteDocs: NoteDoc[]) => {
        this.set(LS_Constants.NOTES_TO_DELETE, JSON.stringify(noteDocs))
    }

    removeNotesToDelete = () => {
        this.remove(LS_Constants.NOTES_TO_DELETE)
    }
    
    removeUserData = () => {
        this.removeUpdateNotesWithError()
        this.removeUpdatingNotes()
        this.removeVersion()
        this.removeNotesToDelete()
    }

}

export default new NotesLocalStorage()