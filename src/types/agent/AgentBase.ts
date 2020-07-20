import Superagent from 'superagent'
import AgentRequest from './AgentRequest'
import ConnectionService from '../../services/connection/ConnectionService'
import AgentStatus from './AgentStatus'

export default class AgentBase {

    put = (url: string): AgentRequest => {
        const request = this.filter(Superagent.put(url)
            .on('error', this.onError)
            .on('response', this.onResponse))

        return this.getAgentRequest(request)
    }

    post = (url: string): AgentRequest => {
        const request = this.filter(Superagent.post(url)
            .on('error', this.onError)
            .on('response', this.onResponse))

        return this.getAgentRequest(request)
    }

    get = (url: string): AgentRequest => {
        const request = this.filter(Superagent.get(url)
            .on('error', this.onError)
            .on('response', this.onResponse))

        return this.getAgentRequest(request)
    }

    delete = (url: string): AgentRequest => {
        const request = this.filter(Superagent.delete(url)
            .on('error', this.onError)
            .on('response', this.onResponse))

            
        return this.getAgentRequest(request)
    }

    protected filter = (request: Superagent.SuperAgentRequest): Superagent.SuperAgentRequest => {
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

