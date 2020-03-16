import AuthRequestModel from '../model/AuthRequestModel'
import Superagent from 'superagent'
import DinoApiConstants from '../constants/DinoApiConstants'

class LoginService {
    login = async (token: string) => {
        const authRequestModel = new AuthRequestModel(token)
        const response = await Superagent.post(DinoApiConstants.PATH_AUTH_GOOGLE).send(authRequestModel)
        
        return response
    }
}

export default new LoginService()