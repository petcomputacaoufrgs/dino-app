class DinoAgentStatus {
  OK: DinoAgentStatusValue = 'Ok'
  DISCONNECTED: DinoAgentStatusValue = 'Disconnected'
}

export default new DinoAgentStatus()

export type DinoAgentStatusValue = 'Ok' | 'Disconnected'
