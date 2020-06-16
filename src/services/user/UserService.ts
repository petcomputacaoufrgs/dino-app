import UserLocalStorage from './local_storage/UserLocalStorage'
import AuthService from '../auth/AuthService'
import AppSettingsService from '../app_settings/AppSettingsService'
import NoteService from '../note/NoteService'

class UserService {
  getPictureUrl = () => {
    return UserLocalStorage.getPictureUrl()
  }

  setPictureUrl = (url: string) => {
    UserLocalStorage.setPictureUrl(url)
  }

  getName = () => {
    return UserLocalStorage.getName()
  }

  setName = (name: string) => {
    UserLocalStorage.setName(name)
  }

  getEmail = () => UserLocalStorage.getEmail()

  setEmail = (email: string) => {
    UserLocalStorage.setEmail(email)
  }

  removeUserData() {
    UserLocalStorage.removeUserData()
    AuthService.removeUserData()
    AppSettingsService.removeUserData()
    NoteService.removeUserData()
  }
}

export default new UserService()
