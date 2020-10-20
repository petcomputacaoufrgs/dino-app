import BaseLocalStorage from '../BaseLocalStorage'
import LS_Constants from '../../constants/local_storage/LocalStorageKeysConstants'

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

  getEmail = (): string =>
    this.convertStringOrNullToString(this.get(LS_Constants.EMAIL))

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

  getSavePictureWithError = (): boolean | null => {
    const savedValue = this.get(LS_Constants.SAVE_PICTURE_WITH_ERROR)

    if (savedValue) {
      return JSON.parse(savedValue)
    }

    return null
  }

  setSavePictureWithError = (isWithError: boolean) => {
    this.set(LS_Constants.SAVE_PICTURE_WITH_ERROR, JSON.stringify(isWithError))
  }

  removeSavePictureWithError = () => {
    this.remove(LS_Constants.SAVE_PICTURE_WITH_ERROR)
  }

  removeUserData = () => {
    this.removeEmail()
    this.removeName()
    this.removePictureURL()
    this.removeSavedPicture()
    this.removeVersion()
    this.removeSavePictureWithError()
  }
}

export default new UserLocalStorage()
