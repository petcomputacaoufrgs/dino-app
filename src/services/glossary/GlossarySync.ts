import BaseSync from '../../types/services/BaseSync'
import GlossaryService from './GlossaryService'
import GlossaryUpdater from './GlossaryUpdater'

class GlossarySync implements BaseSync {
  sync = async (): Promise<boolean> => {
    if (GlossaryService.shouldSync()) {
      GlossaryService.setShouldSync(false)
      GlossaryUpdater.checkUpdates()
    }

    return true
  }
}

export default new GlossarySync()
