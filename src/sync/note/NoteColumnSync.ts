import BaseSync from '../BaseSync'
import NoteColumnService from '../../services/note/NoteColumnService'
import NoteColumnLocalStorageService from '../../services/note/NoteColumnLocalStorageService'

class NoteColumnSync implements BaseSync {
  sync = async () => {
    const shouldSync =
      NoteColumnLocalStorageService.shouldSync() ||
      NoteColumnLocalStorageService.shouldSyncOrder()
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
