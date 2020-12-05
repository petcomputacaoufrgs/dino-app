import AuthService from '../services/auth/AuthService'
import AppSettingsSync from './app_settings/AppSettingsSync'
import LogAppErrorSync from './log_app_error/LogAppErrorSync'
import UserSync from './user/UserSync'
import ContactSync from './contact/ContactSync'
import BaseSync from './BaseSync'
import GlossarySync from './glossary/GlossarySync'
import FaqSync from './faq/FaqSync'
import NoteColumnSync from './note/NoteColumnSync'
import NoteSync from './note/NoteSync'
import SyncService from '../services/sync/SyncService'
import ConnectionService from '../services/connection/ConnectionService'

//TODO: Se tudo for refatorado rever classes Sync 
class Synchronizer {
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
      SyncService.setSynchronizing()
      await this.syncGroupsIndependently(onlyReceive)
      if (ConnectionService.isConnected()) {
        SyncService.setSynced()
      }
    }
  }

  private syncGroupsIndependently = async (onlyReceive?: boolean) => {
    const executionList = this.executionGrups.map((syncronizerGroup) =>
      this.syncGroupInOrder(syncronizerGroup, onlyReceive)
    )
    await Promise.all(executionList)
  }

  private syncGroupInOrder = async (
    syncronizerGroup: BaseSync[],
    onlyReceive?: boolean
  ) => {
    for (const syncronizer of syncronizerGroup) {
      if (syncronizer.sync) {
        await syncronizer.sync()
      }
      if (syncronizer.receive) {
        await syncronizer.receive()
      }
      if (syncronizer.send && !onlyReceive) {
        await syncronizer.send()
      }
    }
  }
}

export default new Synchronizer()
