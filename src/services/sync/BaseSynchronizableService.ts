import SyncResolve from "../../types/sync/SyncResolve"
import SyncService from "./SyncService"

//TODO Conservar estado de sincronizado
export default abstract class BaseSynchronizableService {
  /**
   * @description Function that performs data synchronization with the API
   */
  protected abstract doSync(): Promise<boolean>

  /**
   * @description Return a list of dependencies for synchronization.
   * A dependencie occurs when an synchronizable entity has reference for another that needs to be synchronized first
   */
  abstract getDependencies(): BaseSynchronizableService[]

  private isSynchronizing: boolean

  private result: boolean | undefined

  private resolves: SyncResolve[]
  
  constructor() {
    this.isSynchronizing = false
    this.resolves = []
    this.subscribe()
  }

  cleanResult = () => {
    this.result = undefined
  }

  async sync(): Promise<boolean> {
    if (this.result !== undefined) {
      return this.result
    } else if (this.isSynchronizing) {
      return new Promise<boolean>(resolve => {
        this.resolves.push(resolve)
      })
    } else {
      this.isSynchronizing = true
      const result = await this.doSync()
      this.result = result
      this.isSynchronizing = false
      this.resolveAllAfterReturn(result)
      return result
    } 
  }

  private subscribe = () => {
    window.addEventListener('load', () => { 
      SyncService.subscribeService(this)
    })
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
}
