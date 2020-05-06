import UpdateService from '../../../services/UpdateService'
import NotesService from '../../../services/NotesService'
import LanguageSubProviderValue from '../language_sub_provider/value'
import UpdaterSubProviderValue from './value'

const UpdaterSubProvider = (languageContext: LanguageSubProviderValue): UpdaterSubProviderValue => {

    const update = () => {
        UpdateService.checkUpdates(languageContext)
        NotesService.checkUpdates()
    }

    const value: UpdaterSubProviderValue = {
        update: update
    }

    return value
}

export default UpdaterSubProvider