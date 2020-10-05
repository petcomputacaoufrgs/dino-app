import AuthService from '../services/auth/AuthService'
import AppSettingsSync from './AppSettingsSync'
import NoteSync from './NoteSync'
import LogAppErrorSync from './LogAppErrorSync'
import UserSync from './UserSync'
import ContactSync from './ContactSync'
import BaseSync from './BaseSync'
import GlossarySync from './GlossarySync'
import FaqSync from './FaqSync'
import SyncService from '../services/sync/SyncService'

class Syncronizer {
  private syncronizers: BaseSync[] = [
    AppSettingsSync,
    LogAppErrorSync,
    GlossarySync,
    NoteSync,
    ContactSync,
    UserSync,
    FaqSync,
  ]

  sync = async () => {
    SyncService.setSynchronizing()
    await this.receive()
    await this.send()
    SyncService.setSynced()
  }

  send = async () => {
    if (AuthService.isAuthenticated()) {
      const executionList = this.syncronizers
        .filter((sincronizer) => sincronizer.send)
        .map((sincronizer) => sincronizer.send!())
      await Promise.all(executionList)
    }
  }

  receive = async () => {
    if (AuthService.isAuthenticated()) {
      const executionList = this.syncronizers
        .filter((sincronizer) => sincronizer.receive)
        .map((sincronizer) => sincronizer.receive!())
      await Promise.all(executionList)
    }
  }
}

export default new Syncronizer()
