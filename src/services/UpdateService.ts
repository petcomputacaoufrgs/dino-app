import GlossaryService from './GlossaryService'
import AuthService from './AuthService'
import AppSettingsService from './AppSettingsService'
import LanguageSubProviderValue from '../provider/app_provider/language_sub_provider/value';

class UpdateService {
    checkUpdates = async (languageContext?: LanguageSubProviderValue) => {
        if(AuthService.isAuthenticated()){
            GlossaryService.checkUpdate()
            AppSettingsService.checkUpdate(languageContext)
        }
    }
}

export default new UpdateService()

