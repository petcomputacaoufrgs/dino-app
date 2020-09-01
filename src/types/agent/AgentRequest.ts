import Superagent from 'superagent'

export interface AgentRequestInfo {
  request: Superagent.SuperAgentRequest
  canGo: boolean
}

export default interface AgentRequest {
  go: () => Promise<Superagent.Response>
  authenticate: () => AgentRequest
  setBody: (body: string | object) => AgentRequest
  addHeader: (key: string, value: string) => AgentRequest
  canGo: boolean
}
