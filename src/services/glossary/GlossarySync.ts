import BaseSync from '../BaseSync'
import GlossaryService from './GlossaryService'
import GlossaryUpdater from './GlossaryUpdater'

class GlossarySync implements BaseSync {
  sync = async () => {
    if (GlossaryService.shouldSync()) {
      GlossaryUpdater.checkUpdates()
    }
  }
}

export default new GlossarySync()
