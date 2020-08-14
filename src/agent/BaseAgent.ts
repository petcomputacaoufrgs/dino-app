import Superagent from 'superagent'
import AgentRequest, { AgentRequestInfo } from '../types/agent/AgentRequest'
import ConnectionService from '../services/connection/ConnectionService'

export default class BaseAgent {
  put = async (url: string): Promise<AgentRequest> => {
    const request = this.filterWhileCreating(
      Superagent.put(url)
        .on('error', this.onError)
        .on('response', this.onResponse)
    )

    return this.getAgentRequest({
      request: request,
      canGo: await this.canGo()
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
      canGo: await this.canGo()
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
      canGo: await this.canGo()
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
      canGo: await this.canGo()
    })
  }

  protected addAuth = (
    request: Superagent.SuperAgentRequest
  ): Superagent.SuperAgentRequest => {
    return request
  }

  protected filterBeforeCreate = async (): Promise<boolean> => {
    return true
  }

  protected filterWhileCreating = (
    request: Superagent.SuperAgentRequest
  ): Superagent.SuperAgentRequest => {
    return request
  }

  protected onError = (err: any) => {}

  protected onResponse = (response: Superagent.Response) => {}

  private canGo = async () => {
    return ConnectionService.isConnected() && await this.filterBeforeCreate()
  }

  private setBody = (
    info: AgentRequestInfo,
    body: string | object,
  ): AgentRequest => {
    info.request.send(body)
    return this.getAgentRequest(info)
  }

  private addHeader = (
    info: AgentRequestInfo,
    key: string,
    value: string,
  ): AgentRequest => {
    info.request.set(key, value)
    return this.getAgentRequest(info)
  }

  private authenticate = (
    info: AgentRequestInfo
  ): AgentRequest => {
    info.request = this.addAuth(info.request)
    return this.getAgentRequest(info)
  }

  private getAgentRequest = (
    info: AgentRequestInfo
  ): AgentRequest => {
    return {
      go: async (): Promise<Superagent.Response> => await info.request,
      canGo: info.canGo,
      authenticate: () => this.authenticate(info),
      setBody: (body: string | object) => this.setBody(info, body),
      addHeader: (key: string, value: string) => this.addHeader(info, key, value)
    }
  }
}
