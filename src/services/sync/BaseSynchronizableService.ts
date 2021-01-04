import SyncService from "./SyncService"

type SyncResolve =  (value: boolean | PromiseLike<boolean>) => void

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

  private resolves: SyncResolve[]
  
  constructor() {
    this.isSynchronizing = false
    this.resolves = []
    this.subscribe()
  }

  subscribe = () => {
    window.addEventListener('load', () => SyncService.subscribeService(this))
  }

  async sync(): Promise<boolean> {
    if (this.isSynchronizing) {
      return new Promise<boolean>(resolve => {
        this.resolves.push(resolve)
      })
    } else {
      this.isSynchronizing = true

      const result = await this.doSync()

      console.log(this)

      this.isSynchronizing = false
      
      this.resolveAllAfterReturn(result)
      
      return result
    } 
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
