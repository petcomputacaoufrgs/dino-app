import { LocalStorageService } from './LocalStorageService'
import LS_Constants from '../../constants/LocalStorageKeysConstants'
import NoteLocalModel from '../../model/local_storage/NoteLocalModel';
import NoteTagLocalModel from '../../model/local_storage/NoteTagLocalModel';

class NotesLocalStorageService extends LocalStorageService {
    
    getNotes = (): NoteLocalModel[] => {
        const items = this.get(LS_Constants.NOTE)

        if (items) {
            return JSON.parse(items)
        }

        return []
    }
    
    setNotes = (notes: NoteLocalModel[]) => {
        this.set(LS_Constants.NOTE, JSON.stringify(notes))
    }

    removeNotes = () => {
        this.remove(LS_Constants.NOTE)
    }

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

    getTags = (): NoteTagLocalModel[] => {
        const items = this.get(LS_Constants.NOTE_TAGS)

        if (items) {
            return JSON.parse(items)
        }

        return []
    }

    setTags = (tags: NoteTagLocalModel[]) => {
        this.set(LS_Constants.NOTE_TAGS, JSON.stringify(tags))
    }

    removeTags = () => {
        this.remove(LS_Constants.NOTE_TAGS)
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

    getNotesToDelete = (): NoteLocalModel[] => {
        const notesToDelete = this.get(LS_Constants.NOTES_TO_DELETE)

        if (notesToDelete) {
            return JSON.parse(notesToDelete)
        }
        
        return []
    }

    setNotesToDelete = (notesToDelete: NoteLocalModel[]) => {
        this.set(LS_Constants.NOTES_TO_DELETE, JSON.stringify(notesToDelete))
    }

    removeNotesToDelete = () => {
        this.remove(LS_Constants.NOTES_TO_DELETE)
    }
    
    removeUserData = () => {
        this.removeNotes()
        this.removeTags()
        this.removeUpdateNotesWithError()
        this.removeUpdatingNotes()
        this.removeVersion()
        this.removeNotesToDelete()
    }

}

export default new NotesLocalStorageService()