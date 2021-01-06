import SyncResolve from "../../types/sync/SyncResolve"
import WebSocketSubscriberableService from "../websocket/WebSocketSubscriberableService"
import SyncService from "./SyncService"

export default abstract class SynchronizableService extends WebSocketSubscriberableService {
  /**
   * @description Return a list of dependencies for synchronization.
   * A service will await for its dependencies to be syncronized.
   * A dependencie occurs whenever an synchronizable entity has reference for another (the seconds needs to be synchronized first).
   * A dependencie can be used for another reasons.
   * A sync dependency is also a websocket dependency, in other words, if service A is dependent of services B and C and a
   * websocket request arrive for any method in A, B and C so the service A's callback will only be called after B and C callback are completed.
   */
  abstract getSyncDependencies(): SynchronizableService[]

  /**
   * @description Function that performs data synchronization with the API
   */
  protected abstract doSync(): Promise<boolean>

  /**
   * @description Override to add new dependencies for websocket.
   * A websocket dependencie occurs when any websocket function of another service needs to be completed to call one of this service.
   * A SynchronizableService is websocket dependent of itself and of this sync dependencies services.
   */
  getWebSocketExtraDependencies(): WebSocketSubscriberableService[] {
    return []
  }

  private isSynchronizing: boolean

  private syncResult: boolean | undefined

  private syncResolves: SyncResolve[]
  
  constructor() {
    super()
    this.isSynchronizing = false
    this.syncResolves = []
    this.subscribeInSyncService()
  }

  getWebSocketDependencies(): WebSocketSubscriberableService[] {
    const webSocketDependencies: WebSocketSubscriberableService[] = []
    webSocketDependencies.push(...this.getSyncDependencies())
    webSocketDependencies.push(...this.getWebSocketExtraDependencies())
    webSocketDependencies.push(this)
    
    return webSocketDependencies
  }

  cleanResult = () => {
    this.syncResult = undefined
  }

  async sync(): Promise<boolean> {
    if (this.syncResult !== undefined) {
      return this.syncResult
    } else if (this.isSynchronizing) {
      return new Promise<boolean>(resolve => {
        this.syncResolves.push(resolve)
      })
    } else {
      this.isSynchronizing = true
      const result = await this.doSync()
      this.syncResult = result
      this.isSynchronizing = false
      this.resolveAllAfterReturn(result)
      return result
    } 
  }

  private subscribeInSyncService = () => {
    window.addEventListener('load', () => { 
      SyncService.subscribeService(this)
    })
  }

  private resolveAllAfterReturn = (result: boolean) => {
    setTimeout(() => this.resolveAll(result), 0)
  }

  private resolveAll(result: boolean) {
    this.syncResolves.forEach(resolve => resolve(result))
    this.cleanResolveList()
  }

  private cleanResolveList() {
    this.syncResolves = []
  }
}
