import BaseSync from '../BaseSync'
import NoteService from '../../services/note/NoteService'

class NoteSync implements BaseSync {
  send = async () => {
    if (NoteService.shouldSync()) {
      NoteService.setShouldSync(false)

      const noteDocs = await NoteService.getNotes()

      const unsavedNotes = noteDocs
        .filter((noteDoc) => !noteDoc.savedOnServer)

      await NoteService.saveNotesOnServer(unsavedNotes)

      await NoteService.deleteNotesOnServer()

      await NoteService.saveOrderOnServer()
    }
  }

  receive = async () => {
    const serverVersion = await NoteService.getVersionFromServer()
    if (serverVersion !== undefined) {
      await NoteService.updateNotesFromServer(serverVersion)
    }
  }
}

export default new NoteSync()
