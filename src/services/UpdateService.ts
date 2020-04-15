import GlossaryService from './GlossaryService'
import AuthService from './AuthService'

class UpdateService {
    checkUpdates = async () => {
        if(AuthService.isAuthenticated()){
            GlossaryService.checkUpdate()
        }
    }
}

export default new UpdateService()

