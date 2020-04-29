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
        this.remove(LS_Constants.NOTE)
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

}

export default new NotesLocalStorageService()