import BaseSync from './BaseSync'
import NoteService from '../services/note/NoteService'
import NoteSaveModel from '../types/note/NoteSaveModel'

class NoteSync implements BaseSync {
  send = async () => {      
    if (NoteService.shouldSync()) {
      NoteService.setShouldSync(false)

      const noteDocs = await NoteService.getDatabaseNotes()

      const models = noteDocs
        .filter((noteDoc) => !noteDoc.savedOnServer)
        .map(
          (doc) =>
            ({
              id: doc.external_id,
              answer: doc.answer,
              question: doc.question,
              tagNames: doc.tagNames,
              lastUpdate: doc.lastUpdate,
            } as NoteSaveModel)
        )

      await NoteService.saveNotesOnServer(models)

      await NoteService.deleteNotesOnServer()

      NoteService.updateOrderOnServer(noteDocs)
    }
  }

  receive = async () => {
    const serverVersion = await NoteService.getVersionFromServer()

    if (serverVersion !== undefined) {
      NoteService.updateNotesFromServer(serverVersion)
    }
  }
}

export default new NoteSync()
