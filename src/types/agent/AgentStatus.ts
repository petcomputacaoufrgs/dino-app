class AgentStatus {
  OK: AgentStatusValue = 'Ok'
  DISCONNECTED: AgentStatusValue = 'Disconnected'
}

export default new AgentStatus()

export type AgentStatusValue = 'Ok' | 'Disconnected'
