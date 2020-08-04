import GlossaryService from './GlossaryService'
import BaseUpdater from '../BaseUpdater'

class GlossaryUpdater implements BaseUpdater {
  checkUpdates = async () => {
    const newVersion = await GlossaryService.getAPIVersion()

    if (newVersion === undefined) {
      GlossaryService.setShouldSync(true)
      return
    }

    GlossaryService.update(newVersion)
  }
}

export default new GlossaryUpdater()
