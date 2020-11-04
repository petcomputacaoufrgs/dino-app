import BaseSync from '../BaseSync'
import NoteColumnService from '../../services/note/NoteColumnService'
import NoteColumnSyncLocalStorage from '../../storage/local_storage/note/NoteColumnSyncLocalStorage'

class NoteColumnSync implements BaseSync {
  sync = async () => {
    const shouldSync =
      NoteColumnSyncLocalStorage.getShouldSync() ||
      NoteColumnSyncLocalStorage.getShouldSyncOrder()
    if (shouldSync) {
      await NoteColumnService.sync()
    } else {
      const serverVersion = await NoteColumnService.getVersionFromServer()

      if (serverVersion !== undefined) {
        await NoteColumnService.updateColumnsFromServer(serverVersion)
      }
    }
  }
}

export default new NoteColumnSync()
