import HttpStatus from 'http-status-codes'
import BaseUpdater from '../BaseUpdater'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import AuthService from '../auth/AuthService'
import NoteAPIModel from './api_model/NoteAPIModel'
import NoteDoc from './database/NoteDoc'
import NoteDatabase from './database/NoteDatabase'
import NoteService from './NoteService'
import DinoAgentService from '../dino_agent/DinoAgentService'

class NoteUpdater implements BaseUpdater{

    checkUpdates = async (): Promise<void> => {
      NoteService.setUpdateNotesWithoutError()
  
      if (AuthService.isAuthenticated()) { 
        NoteService.setUpdatingNotes()
  
        const response = await DinoAgentService.get(DinoAPIURLConstants.NOTE_GET_VERSION)
  
        if (response.status === HttpStatus.OK) {
          const serverVersion: number = response.body
  
          const savedVersion = NoteService.getVersion()
  
          if (serverVersion !== savedVersion) {
            await this.updateNotesVersion(serverVersion)
          } 
        } else {
          NoteService.setUpdateNotesWithError()
        }
          
        NoteService.setNotesUpdated()
      }
    }
  
    private updateNotesVersion = async (version: number): Promise<void> => {
      const response = await DinoAgentService.get(DinoAPIURLConstants.NOTE_GET)
  
      if (response.status === HttpStatus.OK) {
        const notes: NoteAPIModel[] = response.body
  
        const noteDocs: NoteDoc[] = notes.map(n => ({
            external_id: n.id,
            order: n.order,
            answer: n.answer,
            answered: n.answered,
            lastUpdate: n.lastUpdate,
            question: n.question,
            tagNames: n.tags,
            savedOnServer: true
          } as NoteDoc
        ))
  
        NoteService.setVersion(version)
  
        await NoteDatabase.putAll(noteDocs)
      }
  
      NoteService.setUpdateNotesWithError()
    } 
      
}

export default new NoteUpdater()