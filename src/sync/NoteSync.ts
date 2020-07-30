import BaseSync from './BaseSync'
import NoteService from '../services/note/NoteService'
import NoteUpdateModel from '../types/note/NoteUpdateModel'

class NoteSync implements BaseSync {
  send = async () => {
    const serverVersion = await NoteService.getVersionFromServer()

    if (serverVersion !== undefined) {
      NoteService.setShouldSync(false)

      const localVersion = NoteService.getVersion()

      if (serverVersion > localVersion) {
        NoteService.updateNotesFromServer(serverVersion)
      } else if (NoteService.shouldSync()) {
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

    NoteService.setShouldSync(true)
  }

  receive = async () => {
    const serverVersion = await NoteService.getVersionFromServer()

    if (serverVersion !== undefined) {
      NoteService.updateNotesFromServer(serverVersion)
    }
  }
}

export default new NoteSync()
