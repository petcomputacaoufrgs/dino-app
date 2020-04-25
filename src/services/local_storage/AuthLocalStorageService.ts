import { LocalStorageService } from './LocalStorageService'
import LS_Constants from "../../constants/LocalStorageKeysConstants"

class AuthLocalStorageService extends LocalStorageService {
    
    getAuthToken = () : string => {
        const authToken = this.get(LS_Constants.AUTH_TOKEN)
        
        return this.convertStringOrNullToString(authToken)
    }

    setAuthToken = (accessToken: string) => {
        this.set(LS_Constants.AUTH_TOKEN, accessToken)
    }
    
    removeAuthToken = () => {
        this.remove(LS_Constants.AUTH_TOKEN)
    }

}

export default new AuthLocalStorageService()
