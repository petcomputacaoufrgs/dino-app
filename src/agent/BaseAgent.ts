import Superagent from 'superagent'
import AgentRequest, { AgentRequestInfo } from '../types/agent/AgentRequest'
import ConnectionService from '../services/connection/ConnectionService'

type AgentResolve<AUTH> =  (value: AUTH | undefined | PromiseLike<AUTH | undefined>) => void

const TIME_MARGIN_OF_ERROR_IN_MS = 300000

export default abstract class BaseAgent<AUTH> {
  private refreshingAuth: boolean
  private resolves: AgentResolve<AUTH>[]
  
  constructor() {
    this.refreshingAuth = false
    this.resolves = []
  }

  /**
   * Called to get the current auth
   */
  abstract getAuth(): Promise<AUTH | undefined>

  /**
   * Method to refresh agent auth
   */
  abstract refreshAuth(): Promise<AUTH | undefined>
  
  /**
   * Called when refresh fails
   */
  abstract getTokenExpiresDate(auth: AUTH): Date | undefined

  /**
   * Return true if user has valid authentication
   */
  abstract isAuthenticated(auth: AUTH): boolean 

  /**
   * Override to add authentication on request
   * @param request return request with authentication
   */
  protected addAuth (
    request: Superagent.SuperAgentRequest,
    auth: AUTH
  ): Superagent.SuperAgentRequest {
    return request
  }
    
  /**
   * Called when an error occur
   */
  protected onError = (err: any) => {}

  /**
   * Called when resposta return
   */
  protected onResponse = (response: Superagent.Response) => {}

  /**
   * Called after send the request, in this step you can add data to request
   * @param request return request
   */
  protected filterWhileCreating = (
    request: Superagent.SuperAgentRequest
  ): Superagent.SuperAgentRequest => {
    return request
  }

  put = async (url: string): Promise<AgentRequest> => {
    const request = this.filterWhileCreating(
      Superagent.put(url)
        .on('error', this.onError)
        .on('response', this.onResponse)
    )

    return this.getAgentRequest({
      request: request,
      canGo: this.canGo(),
    })
  }

  patch = async (url: string): Promise<AgentRequest> => {
    const request = this.filterWhileCreating(
      Superagent.patch(url)
        .on('error', this.onError)
        .on('response', this.onResponse)
    )

    return this.getAgentRequest({
      request: request,
      canGo: this.canGo(),
    })
  }

  post = async (url: string): Promise<AgentRequest> => {
    const request = this.filterWhileCreating(
      Superagent.post(url)
        .on('error', this.onError)
        .on('response', this.onResponse)
    )

    return this.getAgentRequest({
      request: request,
      canGo: this.canGo(),
    })
  }

  get = async (url: string): Promise<AgentRequest> => {
    const request = this.filterWhileCreating(
      Superagent.get(url)
        .on('error', this.onError)
        .on('response', this.onResponse)
    )

    return this.getAgentRequest({
      request: request,
      canGo: this.canGo(),
    })
  }

  delete = async (url: string): Promise<AgentRequest> => {
    const request = this.filterWhileCreating(
      Superagent.delete(url)
        .on('error', this.onError)
        .on('response', this.onResponse)
    )

    return this.getAgentRequest({
      request: request,
      canGo: this.canGo(),
    })
  }

  private getUpdatedAuth = async (): Promise<AUTH | undefined> => {
    const auth = await this.getAuth()
    
    if (!auth) {
      return
    }

    const isAuthenticated = this.isAuthenticated(auth)

    if (!isAuthenticated) {
      return
    }

    const expiresDate = this.getTokenExpiresDate(auth)

    if (expiresDate) {
      const isExpired = this.isExpired(expiresDate)
      if (isExpired) {
        return this.awaitRefreshAuth()
      }
    }

    return auth
  }

  private isExpired = (expiresDate: Date): boolean => {
    const expiresDateWithMargin = expiresDate.getTime() - TIME_MARGIN_OF_ERROR_IN_MS
    
    const nowInMS = new Date().getTime()

    return expiresDateWithMargin <= nowInMS
  }

  private awaitRefreshAuth = async (): Promise<AUTH | undefined> => {
    if (this.refreshingAuth) {
      return new Promise<AUTH | undefined>(resolve => {
        this.resolves.push(resolve)
      })
    } else {
      this.refreshingAuth = true

      const auth = await this.refreshAuth()

      this.refreshingAuth = false
      
      this.resolveAllAfterReturn(auth)

      return auth
    } 
  }

  private resolveAllAfterReturn = (auth: AUTH | undefined) => {
    setTimeout(() => this.resolveAll(auth), 0)
  }

  private resolveAll(auth: AUTH | undefined) {
    this.resolves.forEach(resolve => resolve(auth))
    this.cleanResolveList()
  }

  private cleanResolveList() {
    this.resolves = []
  }

  private canGo = () => {
    return ConnectionService.isConnected()
  }

  private setBody = (
    info: AgentRequestInfo,
    body: string | object
  ): AgentRequest => {
    info.request.send(body)
    return this.getAgentRequest(info)
  }

  private addHeader = (
    info: AgentRequestInfo,
    key: string,
    value: string
  ): AgentRequest => {
    info.request.set(key, value)
    return this.getAgentRequest(info)
  }

  private authenticate = async (info: AgentRequestInfo): Promise<AgentRequest> => {
    const auth = await this.getUpdatedAuth()

    if (auth) {
      info.request = this.addAuth(info.request, auth)
    }

    return this.getAgentRequest(info)
  }

  private getAgentRequest = (info: AgentRequestInfo): AgentRequest => {
    return {
      go: async (): Promise<Superagent.Response> => await info.request,
      canGo: info.canGo,
      authenticate: () => this.authenticate(info),
      setBody: (body: string | object) => this.setBody(info, body),
      addHeader: (key: string, value: string) =>
        this.addHeader(info, key, value),
    }
  }
}
