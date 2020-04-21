import GlossaryService from './GlossaryService'
import AuthService from './AuthService'
import AppSettingsService from './AppSettingsService'
import LanguageProviderValue from '../components/language_provider/LanguageProviderValue';

class UpdateService {
    checkUpdates = async (languageProvider?: LanguageProviderValue) => {
        if(AuthService.isAuthenticated()){
            GlossaryService.checkUpdate()
            AppSettingsService.checkUpdate(languageProvider)
        }
    }
}

export default new UpdateService()

