import AuthService from '../auth/AuthService'
import BaseSynchronizableService from './BaseSynchronizableService'
import SynchronizationTree, { SynchronizationNode } from './SynchTree'
import SyncStateEnum from '../../types/sync/SyncStateEnum'
import SyncContextUpdater from '../../context/updater/SyncContextUpdater'

class SynchronizationService {
  /*private executionGrups: BaseSynchronizableService[][][] = [
    [[UserService]],
    [[GoogleScopeService]],
    [
      [TreatmentService],
      [FaqService, UserService],
      [FaqItemService, FaqUserQuestionService],
    ],
    [[GlossaryService]],
    [[NoteColumnService], [NoteService]],
    [[ContactService], [PhoneService], [GoogleContactService]],
    [[LogAppErrorService]],
  ]*/

  private tree: SynchronizationTree

  private synchronizationState: SyncStateEnum

  constructor() {
    this.tree = new SynchronizationTree()
    this.synchronizationState = SyncStateEnum.SYNCED
  }

  sync = async () => {
    const isAuthenticated = await AuthService.isAuthenticated()

    if (isAuthenticated) {
      this.setSynchronizing()
      const result: boolean = await this.syncTree()
      if (result) {
        this.setSynced()
      } else {
        //TODO Try again
        this.setNotSynced()
      }

      console.log(this.synchronizationState)
    }
  }

  subscribeService = (service: BaseSynchronizableService) => {
    this.tree.add(service)
  }

  getState = () => {
    return this.synchronizationState
  }

  setNotSynced = () => {
    this.synchronizationState = SyncStateEnum.NOT_SYNCED
    SyncContextUpdater.update()
  }

  private setSynchronizing = () => {
    this.synchronizationState = SyncStateEnum.SYNCHRONIZING
    SyncContextUpdater.update()
  }

  private setSynced = () => {
    this.synchronizationState = SyncStateEnum.SYNCED
    SyncContextUpdater.update()
  }

  private syncTree = (): Promise<boolean> => {
    return this.syncNodes(this.tree.root)
  }

  private syncNodes = async (nodes: SynchronizationNode[]): Promise<boolean> => {
    const executionList = nodes.map(node => this.syncNode(node))
    const results = await Promise.all(executionList)
    return results.some(result => !result)
  }   

  private syncNode = async (node: SynchronizationNode): Promise<boolean> => {
    if (node.dependencies.length > 0) {
      const executionList = node.dependencies.map(node => this.syncNode(node))
      const results = await Promise.all(executionList)
      if (results.some(result => !result)) {
        return false
      }
    }
    /*
    console.log("=======================")
    console.log("start syncing")
    console.log(node.service)
    console.log("=======================")*/
    const result = await node.service.sync()
    /*console.log("=======================")
    console.log("stop syncing")
    console.log(node.service)
    console.log("=======================")*/
    return result
  }
}

export default new SynchronizationService()
