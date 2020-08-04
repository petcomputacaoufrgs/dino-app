import BaseLocalStorage from '../../../types/services/BaseLocalStorage'
import LS_Constants from '../../../constants/LocalStorageKeysConstants'

class UserLocalStorage extends BaseLocalStorage {
  setVersion = (version: number) => {
    this.set(LS_Constants.USER_VERSION, JSON.stringify(version))
  }

  getVersion = (): number => {
    const version = this.get(LS_Constants.USER_VERSION)

    return version ? Number(version) : 0
  }

  removeVersion = () => {
    this.remove(LS_Constants.USER_VERSION)
  }

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

  getPictureURL = (): string =>
    this.convertStringOrNullToString(this.get(LS_Constants.PICTURE_URL))

  setPictureURL = (pictureURL: string) => {
    this.set(LS_Constants.PICTURE_URL, pictureURL)
  }

  removePictureURL = () => {
    this.remove(LS_Constants.PICTURE_URL)
  }

  getSavedPicture = (): string =>
    this.convertStringOrNullToString(this.get(LS_Constants.SAVED_PICTURE))

  setSavedPicture = (base64Photo: string) => {
    this.set(LS_Constants.SAVED_PICTURE, base64Photo)
  }

  removeSavedPicture = () => {
    this.remove(LS_Constants.SAVED_PICTURE)
  }

  removeUserData = () => {
    this.removeEmail()
    this.removeName()
    this.removePictureURL()
    this.removeSavedPicture()
    this.removeVersion()
  }
}

export default new UserLocalStorage()
