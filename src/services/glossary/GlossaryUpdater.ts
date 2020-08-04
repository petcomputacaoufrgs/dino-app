import GlossaryService from './GlossaryService'
import BaseUpdater from '../../types/services/BaseUpdater'

class GlossaryUpdater implements BaseUpdater {
  checkUpdates = async () => {
    const newVersion = await GlossaryService.getAPIVersion()

    if (newVersion === undefined) {
      return
    }

    GlossaryService.update(newVersion)
  }
}

export default new GlossaryUpdater()
