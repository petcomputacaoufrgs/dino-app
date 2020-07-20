import Superagent from 'superagent'
import AgentRequest from './AgentRequest'
import ConnectionService from '../../../services/connection/ConnectionService'
import AgentStatus from './AgentStatus'

export default class BaseAgent {

    put = async (url: string): Promise<AgentRequest> => {
        await this.filterBeforeCreate()

        const request = this.filterWhileCreating(Superagent.put(url)
            .on('error', this.onError)
            .on('response', this.onResponse))

        return this.getAgentRequest(request)
    }

    post = async (url: string): Promise<AgentRequest> => {
        await this.filterBeforeCreate()

        const request = this.filterWhileCreating(Superagent.post(url)
            .on('error', this.onError)
            .on('response', this.onResponse))

        return this.getAgentRequest(request)
    }

    get = async (url: string): Promise<AgentRequest> => {
        await this.filterBeforeCreate()

        const request = this.filterWhileCreating(Superagent.get(url)
            .on('error', this.onError)
            .on('response', this.onResponse))

        return this.getAgentRequest(request)
    }

    delete = async (url: string): Promise<AgentRequest> => {
        await this.filterBeforeCreate() 

        const request = this.filterWhileCreating(Superagent.delete(url)
            .on('error', this.onError)
            .on('response', this.onResponse))

            
        return this.getAgentRequest(request)
    }

    protected filterBeforeCreate = async () => {
        return
    }

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
            return { get: () => request, status: AgentStatus.DISCONNECTED }
        }
    }

}

