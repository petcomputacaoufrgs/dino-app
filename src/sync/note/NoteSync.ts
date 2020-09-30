import BaseSync from '../BaseSync'
import NoteService from '../../services/note/NoteService'

class NoteSync implements BaseSync {
  send = async () => {
    if (NoteService.shouldSync()) {
      NoteService.setShouldSync(false)

      const notes = await NoteService.getNotes()

      const unsavedNotes = notes
        .filter((note) => !note.savedOnServer)

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
