import BaseSync from '../BaseSync'
import NoteService from '../../services/note/NoteService'
import NoteLocalStorageService from '../../services/note/NoteLocalStorageService'

class NoteSync implements BaseSync {
  sync = async () => {
    const shouldSync =
      NoteLocalStorageService.shouldSync() ||
      NoteLocalStorageService.shouldSyncOrder()
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
