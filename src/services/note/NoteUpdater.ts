import BaseUpdater from '../../types/services/BaseUpdater'
import NoteService from './NoteService'

class NoteUpdater implements BaseUpdater {
  checkUpdates = async (): Promise<void> => {
    const serverVersion = await NoteService.getVersionFromServer()

    if (serverVersion !== undefined) {
      NoteService.updateNotesFromServer(serverVersion)
    }
  }
}

export default new NoteUpdater()
