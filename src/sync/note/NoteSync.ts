import BaseSync from '../BaseSync'
import NoteService from '../../services/note/NoteService'
import NoteSaveModel from '../../types/note/server/NoteSaveRequestModel'

class NoteSync implements BaseSync {
  send = async () => {
    if (NoteService.shouldSync()) {
      NoteService.setShouldSync(false)

      const noteDocs = await NoteService.getNotes()

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
              columnTitle: doc.columnTitle,
            } as NoteSaveModel)
        )

      await NoteService.saveNotesOnServer(models)

      await NoteService.deleteNotesOnServer()

      const docsOrder = await NoteService.getNotes()

      NoteService.saveOrderOnServer(docsOrder)
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
