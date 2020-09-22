import BaseSync from '../BaseSync'
import NoteColumnService from '../../services/note/NoteColumnService'
import NoteColumnDoc from '../../types/note/database/NoteColumnDoc'
import NoteSync from './NoteSync'

class NoteColumnSync implements BaseSync {
  send = async () => {
    if (NoteColumnService.shouldSync()) {
      NoteColumnService.setShouldSync(false)

      const docs = await NoteColumnService.getColumns()

      const unsavedDocs: NoteColumnDoc[] = docs.filter(
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
      await NoteColumnService.updateColumnsFromServer(serverVersion)
    }

    await NoteSync.receive()
  }
}

export default new NoteColumnSync()
