import GlossaryService from '../services/glossary/GlossaryService'
import BaseSync from './BaseSync'

class GlossarySync implements BaseSync {
  send = async () => {}

  receive = async () => {
    const newVersion = await GlossaryService.getAPIVersion()

    if (newVersion !== undefined) {
      GlossaryService.update(newVersion)
    }
  }
}

export default new GlossarySync()
