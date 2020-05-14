import BaseSync from '../BaseSync'
import NoteService from './NoteService'
import NoteUpdater from './NoteUpdater'
import NoteUpdateModel from './api_model/NoteUpdateModel'

class NoteSync implements BaseSync {
  sync = async (): Promise<boolean> => {
    if (NoteService.shouldSync()) {
      const serverVersion = await NoteService.getVersionFromServer()

      if (serverVersion) {
        const localVersion = NoteService.getVersion()

        if (serverVersion > localVersion) {
          NoteUpdater.checkUpdates(serverVersion)
          return true
        }

        if (serverVersion <= localVersion) {
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
                } as NoteUpdateModel)
            )

          await NoteService.updateNotes(models)

          await NoteService.deleteNotesOnServer()

          NoteService.updateOrderOnServer(noteDocs)

          return true
        }
      }
    }

    NoteService.setShouldSync(true)

    return false
  }
}

export default new NoteSync()
