import BaseLocalStorage from '../../../types/services/BaseLocalStorage'
import LS_Constants from '../../../constants/LocalStorageKeysConstants'

class UserLocalStorage extends BaseLocalStorage {
  getEmail = (): string | null => this.get(LS_Constants.EMAIL)

  setEmail = (email: string) => {
    this.set(LS_Constants.EMAIL, email)
  }

  removeEmail = () => {
    this.remove(LS_Constants.EMAIL)
  }

  getName = (): string =>
    this.convertStringOrNullToString(this.get(LS_Constants.NAME))

  setName = (name: string) => {
    this.set(LS_Constants.NAME, name)
  }

  removeName = () => {
    this.remove(LS_Constants.NAME)
  }

  getPictureUrl = (): string =>
    this.convertStringOrNullToString(this.get(LS_Constants.PICTURE_URL))

  setPictureUrl = (pictureUrl: string) => {
    this.set(LS_Constants.PICTURE_URL, pictureUrl)
  }

  removePictureUrl = () => {
    this.remove(LS_Constants.PICTURE_URL)
  }

  removeUserData = () => {
    this.removeEmail()
    this.removeName()
    this.removePictureUrl()
  }
}

export default new UserLocalStorage()
