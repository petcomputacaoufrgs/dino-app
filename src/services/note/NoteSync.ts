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
        console.log('update from server')
        NoteUpdater.update(serverVersion)
        NoteService.setShouldSync(false)

        return true
      }

      if (NoteService.shouldSync()) {
        console.log('update from app')
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

        console.log(models)

        await NoteService.updateNotes(models)

        await NoteService.deleteNotesOnServer()

        NoteService.updateOrderOnServer(noteDocs)
      } else {
        console.log('dont sync')
      }

      return true
    }

    NoteService.setShouldSync(true)

    return false
  }
}

export default new NoteSync()
