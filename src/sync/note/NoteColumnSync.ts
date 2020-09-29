import BaseSync from '../BaseSync'
import NoteColumnService from '../../services/note/NoteColumnService'
import NoteSync from './NoteSync'
import NoteColumnEntity from '../../types/note/database/NoteColumnEntity'

class NoteColumnSync implements BaseSync {
  send = async () => {
    if (NoteColumnService.shouldSync()) {
      NoteColumnService.setShouldSync(false)

      const docs = await NoteColumnService.getColumns()

      const unsavedDocs: NoteColumnEntity[] = docs.filter(
        (docs) => !docs.savedOnServer
      )

      await NoteColumnService.saveColumnsOnServer(unsavedDocs)

      await NoteColumnService.deleteColumnsOnServer()

      await NoteColumnService.saveColumnsOrderOnServer()
    }

    await NoteSync.send()
  }

  receive = async () => {
    const serverVersion = await NoteColumnService.getVersionFromServer()

    if (serverVersion !== undefined) {
      await NoteColumnService.updateColumnsFromServer(serverVersion, true)
    }

    await NoteSync.receive()
  }
}

export default new NoteColumnSync()
