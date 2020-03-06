import AuthRequestModel from '../model/AuthRequestModel';

class LoginService {
    login = (token: string) => {
        const authRequestModel = new AuthRequestModel(token)
        console.log(authRequestModel.token)
    }
}

export default new LoginService()