import { AgentStatusValue } from './AgentStatus'
import Superagent from 'superagent'

export default interface AgentRequest {
  get: () => Superagent.SuperAgentRequest
  status: AgentStatusValue
}
