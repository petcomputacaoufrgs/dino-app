import AuthService from '../services/auth/AuthService'
import AppSettingsSync from './AppSettingsSync'
import LogAppErrorSync from './LogAppErrorSync'
import UserSync from './UserSync'
import ContactSync from './ContactSync'
import BaseSync from './BaseSync'
import GlossarySync from './GlossarySync'
import FaqSync from './FaqSync'
import NoteColumnSync from './note/NoteColumnSync'
import NoteSync from './note/NoteSync'

class Syncronizer {
  private executionGrups: BaseSync[][] = [
    [AppSettingsSync],
    [LogAppErrorSync],
    [GlossarySync],
    [NoteColumnSync, NoteSync],
    [ContactSync],
    [UserSync],
    [FaqSync],
  ]

  sync = async (onlyReceive?: boolean) => {
    if (AuthService.isAuthenticated()) {
      await this.syncGroupsIndependently(onlyReceive)
    }
  }

  private syncGroupsIndependently = async (onlyReceive?: boolean) => {
    const executionList = this.executionGrups
      .map(syncronizerGroup => this.syncGroupInOrder(syncronizerGroup, onlyReceive))
    await Promise.all(executionList)
  }

  private syncGroupInOrder = async (syncronizerGroup: BaseSync[], onlyReceive?: boolean) => {
    for (const syncronizer of syncronizerGroup) {
      if (syncronizer.receive) {
        await syncronizer.receive()
      }
      if (syncronizer.send && !onlyReceive) {
        await syncronizer.send()
      }
    }
  }
}

export default new Syncronizer()
