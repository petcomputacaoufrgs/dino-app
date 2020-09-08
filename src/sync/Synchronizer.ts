import AuthService from '../services/auth/AuthService'
import AppSettingsSync from './AppSettingsSync'
import NoteSync from './note/NoteSync'
import LogAppErrorSync from './LogAppErrorSync'
import UserSync from './UserSync'
import ContactSync from './ContactSync'
import BaseSync from './BaseSync'
import GlossarySync from './GlossarySync'
import FaqSync from './FaqSync'
import NoteColumnSync from './note/NoteColumnSync'

class Syncronizer {
  private syncronizers: BaseSync[] = [
    AppSettingsSync,
    LogAppErrorSync,
    GlossarySync,
    NoteSync,
    NoteColumnSync,
    ContactSync,
    UserSync,
    FaqSync,
  ]

  sync = async () => {
    await this.receive()
    this.send()
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
