import GlossaryService from './GlossaryService'
import AuthService from './AuthService'
import AppSettingsService from './AppSettingsService'
import LanguageContextValue from '../provider/language_provider/context';

class UpdateService {
    checkUpdates = async (languageContext?: LanguageContextValue) => {
        if(AuthService.isAuthenticated()){
            GlossaryService.checkUpdate()
            AppSettingsService.checkUpdate(languageContext)
        }
    }
}

export default new UpdateService()

