import GlossaryService from './GlossaryService'
import AuthService from './AuthService'

class UpdateService {

    checkUpdates = async () => {
        if(AuthService.isAuthenticated()){
            console.log('updating...')
            GlossaryService.checkUpdate()
        }
    }
}

export default new UpdateService()

