import BaseSync from '../BaseSync'
import NoteColumnService from '../../services/note/NoteColumnService'
import NoteColumnEntity from '../../types/note/database/NoteColumnEntity'

class NoteColumnSync implements BaseSync {
  send = async () => {
    if (NoteColumnService.shouldSync()) {
      NoteColumnService.setShouldSync(false)

      const columns = await NoteColumnService.getColumns()

      const unsavedColumns: NoteColumnEntity[] = columns.filter(
        (column) => !column.savedOnServer
      )

      await NoteColumnService.saveColumnsOnServer(unsavedColumns)

      await NoteColumnService.deleteColumnsOnServer()

      await NoteColumnService.saveColumnsOrderOnServer()
    }
  }

  receive = async () => {
    const serverVersion = await NoteColumnService.getVersionFromServer()

    if (serverVersion !== undefined) {
      await NoteColumnService.updateColumnsFromServer(serverVersion, true)
    }
  }
}

export default new NoteColumnSync()
