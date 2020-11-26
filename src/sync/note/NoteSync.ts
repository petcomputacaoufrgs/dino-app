import BaseSync from '../BaseSync'
import NoteService from '../../services/note/NoteService'
import NoteColumnSyncLocalStorage from '../../storage/local_storage/note/NoteColumnSyncLocalStorage'

class NoteSync implements BaseSync {
  sync = async () => {
    const shouldSync =
      NoteColumnSyncLocalStorage.getShouldSync() ||
      NoteColumnSyncLocalStorage.getShouldSyncOrder()
    if (shouldSync) {
      await NoteService.sync()
    } else {
      const serverVersion = await NoteService.getVersionFromServer()

      if (serverVersion !== undefined) {
        await NoteService.updateNotesFromServer(serverVersion)
      }
    }
  }
}

export default new NoteSync()
