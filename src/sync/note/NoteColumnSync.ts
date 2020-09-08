import BaseSync from "../BaseSync"
import NoteColumnService from "../../services/note/NoteColumnService"
import NoteColumnDoc from "../../types/note/database/NoteColumnDoc"

class NoteColumnSync implements BaseSync {
  send = async () => {
    if (NoteColumnService.shouldSync()) {
      NoteColumnService.setShouldSync(false)

      const docs = await NoteColumnService.getColumns()

      const notSavedDocs: NoteColumnDoc[] = docs
        .filter((docs) => !docs.savedOnServer)

      await NoteColumnService.saveColumnsOnServer(notSavedDocs)

      await NoteColumnService.deleteColumnsOnServer()

      NoteColumnService.saveColumnsOrderOnServer(docs)
    }
  }

  receive = async () => {
    const serverVersion = await NoteColumnService.getVersionFromServer()

    if (serverVersion !== undefined) {
      NoteColumnService.updateColumnsFromServer(serverVersion)
    }
  }
}

export default new NoteColumnSync()
