import Superagent from 'superagent'
import AgentRequest from './AgentRequest'
import ConnectionService from '../../../services/connection/ConnectionService'
import AgentStatus from './AgentStatus'

export default class BaseAgent {

    put = async (url: string): Promise<AgentRequest> => {
        const _continue = await this.filterBeforeCreate()

        if (_continue) {
            const request = this.filterWhileCreating(Superagent.put(url)
                .on('error', this.onError)
                .on('response', this.onResponse))
            return this.getAgentRequest(request)
        } else {
            return this.getAgentConnectiontError()
        }
    }

    post = async (url: string): Promise<AgentRequest> => {
        const _continue = await this.filterBeforeCreate()

        if (_continue) {
            const request = this.filterWhileCreating(Superagent.post(url)
                .on('error', this.onError)
                .on('response', this.onResponse))

            return this.getAgentRequest(request)
        } else {
            return this.getAgentConnectiontError()
        }
    }

    get = async (url: string): Promise<AgentRequest> => {
        const _continue = await this.filterBeforeCreate()

        if (_continue) {
            const request = this.filterWhileCreating(Superagent.get(url)
                .on('error', this.onError)
                .on('response', this.onResponse))

            return this.getAgentRequest(request)
        } else {
            return this.getAgentConnectiontError()
        }
    }

    delete = async (url: string): Promise<AgentRequest> => {
        const _continue = await this.filterBeforeCreate()

        if (_continue) {
            const request = this.filterWhileCreating(Superagent.delete(url)
                .on('error', this.onError)
                .on('response', this.onResponse))

                
            return this.getAgentRequest(request)
        } else {
            return this.getAgentConnectiontError()
        }
    }

    protected filterBeforeCreate = async (): Promise<boolean> => { return true }

    protected filterWhileCreating = (request: Superagent.SuperAgentRequest): Superagent.SuperAgentRequest => {
        return request
    }

    protected onError = (err: any) => {}

    protected onResponse = (response: Superagent.Response) => {}

    protected getAgentRequest = (
        request: Superagent.SuperAgentRequest
    ): AgentRequest => {
        if (ConnectionService.isConnected()) {
            return { get: () => request, status: AgentStatus.OK }
        } else {
            return this.getAgentConnectiontError(request)
        }
    }

    protected getAgentConnectiontError = (
        request?: Superagent.SuperAgentRequest
    ): AgentRequest => {
        return { get: () => request, status: AgentStatus.DISCONNECTED }
    }

}

