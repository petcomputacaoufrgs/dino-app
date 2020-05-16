import BaseSync from '../BaseSync'
import NoteService from './NoteService'
import NoteUpdater from './NoteUpdater'
import NoteUpdateModel from './api_model/NoteUpdateModel'

class NoteSync implements BaseSync {
  sync = async (): Promise<boolean> => {
    const serverVersion = await NoteService.getVersionFromServer()

    if (serverVersion !== undefined) {
      const localVersion = NoteService.getVersion()

      if (serverVersion > localVersion) {
        NoteUpdater.update(serverVersion)
        NoteService.setShouldSync(false)

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
                answered: doc.answered
              } as NoteUpdateModel)
          )

        await NoteService.updateNotes(models)

        await NoteService.deleteNotesOnServer()

        NoteService.updateOrderOnServer(noteDocs)
      }

      return true

    }

    NoteService.setShouldSync(true)

    return false

  }
}

export default new NoteSync()
