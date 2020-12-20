import AuthService from '../services/auth/AuthService'
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
import PhoneSync from './contact/PhoneSync'
import GoogleContactSync from './contact/GoogleContactSync'
import FaqItemSync from './faq/FaqItemSync'
import FaqUserQuestionSync from './faq/FaqUserQuestionSync'
import TreatmentSync from './treatment/TreatmentSync'
import UserSettingsSync from './user/UserSettingsSync'

//TODO: Se tudo for refatorado rever classes Sync
class Synchronizer {
  private executionGrups: BaseSync[][][] = [
    [[UserSettingsSync], [FaqSync], [FaqItemSync, FaqUserQuestionSync]],
    [[TreatmentSync], ],
    [[UserSync]],
    [[GlossarySync]],
    [[NoteColumnSync], [NoteSync]],
    [[ContactSync], [PhoneSync, GoogleContactSync]],
    [[LogAppErrorSync]],
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
    syncronizerGroup: BaseSync[][],
    onlyReceive?: boolean
  ): Promise<void> => {
    for (const items of syncronizerGroup) {
      await this.syncItemsInGroupIndependently(items, onlyReceive)
    }
  }

  private syncItemsInGroupIndependently = async (
    items: BaseSync[],
    onlyReceive?: boolean
  ) => {
    const executionList = items.map((item) => this.syncItem(item, onlyReceive))
    await Promise.all(executionList)
  }

  private syncItem = async (
    item: BaseSync,
    onlyReceive?: boolean
  ) => {
    if (item.sync) {
      await item.sync()
    }
    if (item.receive) {
      await item.receive()
    }
    if (item.send && !onlyReceive) {
      await item.send()
    }
  }
}

export default new Synchronizer()
