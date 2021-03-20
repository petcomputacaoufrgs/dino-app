import Superagent from 'superagent'

export interface AgentRequestInfo {
	request: Superagent.SuperAgentRequest
	hasPermission: boolean
	canGo: boolean
}

export default interface AgentRequest<PERMISSION> {
	go: () => Promise<Superagent.Response>
	authenticate: (permissions?: PERMISSION[]) => Promise<void>
	addPermission: (permission: PERMISSION) =>  Promise<void>
	setBody: (body: string | object) => AgentRequest<PERMISSION>
	addHeader: (key: string, value: string) => AgentRequest<PERMISSION>
	canGo: boolean
	hasPermissions: boolean
}