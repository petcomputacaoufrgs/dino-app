import AuthLocalStorage from '../local_storage/AuthLocalStorage'
import UserAuthDataStorage from '../local_storage/UserLocalStorage'
import SettingsLocalStorage from '../local_storage/SettingsLocalStorage'
import NotesLocalStorage from '../local_storage/NotesLocalStorage'
import UserLocalStorage from '../local_storage/UserLocalStorage'

class UserService {

    getPictureUrl() {
        return UserLocalStorage.getPictureUrl()
    }

    getName() {
        return UserLocalStorage.getName()
    }

    getEmail() {
        return UserLocalStorage.getEmail()
    }

    removeUserData() {
        AuthLocalStorage.removeUserData()
        UserAuthDataStorage.removeUserData()
        SettingsLocalStorage.removeUserData()
        NotesLocalStorage.removeUserData()
    }
}

export default new UserService()