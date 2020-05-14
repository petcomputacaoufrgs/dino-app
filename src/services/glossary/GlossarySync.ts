import BaseSync from '../BaseSync'
import GlossaryService from './GlossaryService'
import GlossaryUpdater from './GlossaryUpdater'

class GlossarySync implements BaseSync {
  sync = async (): Promise<boolean> => {
    if (GlossaryService.shouldSync()) {
      GlossaryUpdater.checkUpdates()
    }

    return true
  }
}

export default new GlossarySync()
