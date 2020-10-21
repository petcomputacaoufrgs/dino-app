import GlossaryService from '../../services/glossary/GlossaryService'
import BaseSync from '../BaseSync'

class GlossarySync implements BaseSync {
  receive = async () => {
    const newVersion = await GlossaryService.getAPIVersion()

    if (newVersion !== undefined) {
      GlossaryService.update(newVersion)
    }
  }
}

export default new GlossarySync()
