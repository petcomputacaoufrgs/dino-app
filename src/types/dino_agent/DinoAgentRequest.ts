import { DinoAgentStatusValue } from './DinoAgentStatus'
import Superagent from 'superagent'

export default interface DinoAgentRequest {
  get: () => Superagent.SuperAgentRequest
  status: DinoAgentStatusValue
}
