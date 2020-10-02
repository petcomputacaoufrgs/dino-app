import BaseSync from '../BaseSync'
import NoteService from '../../services/note/NoteService'
import NoteLocalStorageService from '../../services/note/NoteLocalStorageService'

class NoteSync implements BaseSync {
  sync = async () => {
    const shouldSync =
      NoteLocalStorageService.shouldSync() ||
      NoteLocalStorageService.shouldSyncOrder()
    if (shouldSync) {
      await NoteService.sync()
    } else {
      const serverVersion = await NoteService.getVersionFromServer()

      if (serverVersion !== undefined) {
        await NoteService.updateNotesFromServer(serverVersion)
      }
    }
  }

  send = async () => {
    if (NoteService.shouldSync()) {
      NoteService.setShouldSync(false)

      const notes = await NoteService.getNotes()

      const unsavedNotes = notes.filter((note) => !note.savedOnServer)

      await NoteService.saveNotesOnServer(unsavedNotes)

      await NoteService.deleteNotesOnServer()

      await NoteService.saveOrderOnServer()
    }
  }

  receive = async () => {
    const serverVersion = await NoteService.getVersionFromServer()
    if (serverVersion !== undefined) {
      await NoteService.updateNotesFromServer(serverVersion, true)
    }
  }
}

export default new NoteSync()
