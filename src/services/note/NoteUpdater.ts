import BaseUpdater from '../BaseUpdater'
import NoteService from './NoteService'

class NoteUpdater implements BaseUpdater {
  checkUpdates = async (): Promise<void> => {
    const serverVersion = await NoteService.getVersionFromServer()

    if (serverVersion !== undefined) {
      await NoteService.updateNotesFromServer(serverVersion)

      return
    }
  }
}

export default new NoteUpdater()
