import BaseSync from './BaseSync'
import NoteService from '../services/note/NoteService'
import NoteUpdateModel from '../types/note/NoteUpdateModel'

class NoteSync implements BaseSync {
  send = async () => {
    console.log('send...')
      
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
              answered: doc.answered,
            } as NoteUpdateModel)
        )

      await NoteService.updateNotes(models)

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
