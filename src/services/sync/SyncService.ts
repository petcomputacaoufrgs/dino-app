import AuthService from '../auth/AuthService'
import BaseSynchronizableService from './BaseSynchronizableService'
import SyncTree, { SyncTreeNode } from './SyncTree'
import SyncStateEnum from '../../types/sync/SyncStateEnum'
import SyncContextUpdater from '../../context/updater/SyncContextUpdater'
import SyncResolve from '../../types/sync/SyncResolve'

class SyncService {
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

  private tree: SyncTree

  private subscribedServices: BaseSynchronizableService[]

  private syncState: SyncStateEnum

  private resolves: SyncResolve[]

  constructor() {
    this.tree = new SyncTree()
    this.subscribedServices = []
    this.syncState = SyncStateEnum.SYNCED
    this.resolves = []
  }

  sync = async (): Promise<boolean> => {
    const isAuthenticated = await AuthService.isAuthenticated()

    if (isAuthenticated) {
      if (this.syncState === SyncStateEnum.SYNCHRONIZING) {
        return new Promise<boolean>(resolve => {
          this.resolves.push(resolve)
        })
      } else {
        this.setSynchronizing()
        const result: boolean = await this.syncTree()
        if (result) {
          this.setSynced()
        } else {
          //TODO Try again
          this.setNotSynced()
        }
        this.resolveAllAfterReturn(result)
        return result
      }
    }

    return true
  }

  subscribeService = (service: BaseSynchronizableService) => {
    this.subscribedServices.push(service)
    this.tree.add(service)
  }

  getState = () => {
    return this.syncState
  }

  setNotSynced = () => {
    this.syncState = SyncStateEnum.NOT_SYNCED
    SyncContextUpdater.update()
  }

  private resolveAllAfterReturn = (result: boolean) => {
    setTimeout(() => this.resolveAll(result), 0)
  }

  private resolveAll(result: boolean) {
    this.resolves.forEach(resolve => resolve(result))
    this.cleanResolveList()
  }

  private cleanResolveList() {
    this.resolves = []
  }

  private setSynchronizing = () => {
    this.syncState = SyncStateEnum.SYNCHRONIZING
    SyncContextUpdater.update()
  }

  private setSynced = () => {
    this.syncState = SyncStateEnum.SYNCED
    SyncContextUpdater.update()
  }

  private syncTree = async (): Promise<boolean> => {
    const result = await this.syncNodes(this.tree.root)
    this.cleanServicesResults()
    return result
  }

  private syncNodes = async (nodes: SyncTreeNode[]): Promise<boolean> => {
    const executionList = nodes.map(node => this.syncNode(node))
    const results = await Promise.all(executionList)
    return results.every(result => result)
  }   

  private syncNode = async (node: SyncTreeNode): Promise<boolean> => {
    if (node.dependencies.length > 0) {
      const executionList = node.dependencies.map(node => this.syncNode(node))
      const results = await Promise.all(executionList)
      if (results.some(result => !result)) {
        return false
      }
    }
    
    const result = await node.service.sync()
    return result
  }

  private cleanServicesResults = () => {
    this.subscribedServices.forEach(service => service.cleanResult())
  }
}

export default new SyncService()
