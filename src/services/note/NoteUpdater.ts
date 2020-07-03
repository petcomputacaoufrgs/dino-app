import HttpStatus from 'http-status-codes'
import BaseUpdater from '../BaseUpdater'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import NoteModel from '../../types/note/NoteModel'
import NoteDoc from '../../types/note/database/NoteDoc'
import NoteDatabase from './database/NoteDatabase'
import NoteService from './NoteService'
import DinoAgentService from '../dino_agent/DinoAgentService'
import DinoAgentStatus from '../../types/dino_agent/DinoAgentStatus'
import NoteSyncLocalStorage from './local_storage/NoteSyncLocalStorage'

class NoteUpdater implements BaseUpdater {
  checkUpdates = async (): Promise<void> => {
    const serverVersion = await NoteService.getVersionFromServer()

    if (serverVersion !== undefined) {
      const localVersion = NoteService.getVersion()

      if (serverVersion !== localVersion) {
        await this.update(serverVersion)
      }

      return
    }
  }

  update = async (version: number): Promise<void> => {
    const request = DinoAgentService.get(DinoAPIURLConstants.NOTE_GET)

    if (request.status === DinoAgentStatus.OK) {
      try {
        const response = await request.get()

        if (response.status === HttpStatus.OK) {
          const notes: NoteModel[] = response.body

          const noteDocs: NoteDoc[] = notes.map(
            (n) =>
              ({
                external_id: n.id,
                order: n.order,
                answer: n.answer,
                answered: n.answered,
                lastUpdate: n.lastUpdate,
                question: n.question,
                tagNames: n.tags,
                savedOnServer: true,
              } as NoteDoc)
          )

          NoteService.setVersion(version)

          await NoteDatabase.putAll(noteDocs)

          return
        }
      } catch {
        /**TO-DO Salvar log de erro */
      }
    }
    NoteSyncLocalStorage.setShouldSync(true)
  }
}

export default new NoteUpdater()
