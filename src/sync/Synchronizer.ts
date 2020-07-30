import AuthService from '../services/auth/AuthService'
import AppSettingsSync from './AppSettingsSync'
import NoteSync from './NoteSync'
import LogAppErrorSync from './LogAppErrorSync'
import UserSync from './UserSync'
import BaseSync from './BaseSync'

class SyncService {
  private syncronizers: BaseSync[] = [
    AppSettingsSync,
    LogAppErrorSync,
    NoteSync,
    UserSync,
  ]

  sync = () => {
    this.receive()
    this.send()
  }

  send = () => {
    if (AuthService.isAuthenticated()) {
      this.syncronizers.forEach((syncronizer) => {
        syncronizer.send()
      })
    }
  }

  receive = () => {
    if (AuthService.isAuthenticated()) {
      this.syncronizers.forEach((syncronizer) => {
        syncronizer.receive()
      })
    }
  }
}

export default new SyncService()
