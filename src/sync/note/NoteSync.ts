import BaseSync from '../BaseSync'
import NoteService from '../../services/note/NoteService'
import NoteEntity from '../../types/note/database/NoteEntity'

class NoteSync implements BaseSync {
  send = async () => {
    if (NoteService.shouldSync()) {
      NoteService.setShouldSync(false)

      const noteDocs = await NoteService.getNotes()

      const unsavedNotes = noteDocs
        .filter((noteDoc) => !noteDoc.savedOnServer)
        
      this.removeExternalId(unsavedNotes)

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

  private removeExternalId(notes: NoteEntity[]) {
    notes.forEach(noteDocs => noteDocs.external_id = undefined)
  }
}

export default new NoteSync()
