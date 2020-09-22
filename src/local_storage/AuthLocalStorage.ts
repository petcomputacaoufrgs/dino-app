import BaseLocalStorage from './BaseLocalStorage'
import LS_Constants from '../constants/LocalStorageKeysConstants'

class AuthLocalStorage extends BaseLocalStorage {
  getAuthToken = (): string => {
    const authToken = this.get(LS_Constants.AUTH_TOKEN)

    return this.convertStringOrNullToString(authToken)
  }

  setAuthToken = (accessToken: string) => {
    this.set(LS_Constants.AUTH_TOKEN, accessToken)
  }

  removeAuthToken = () => {
    this.remove(LS_Constants.AUTH_TOKEN)
  }

  getAuthTokenExpiresDate = (): number => {
    const expiresDate = this.get(LS_Constants.AUTH_TOKEN_EXPIRES_DATE)

    if (expiresDate) {
      return JSON.parse(expiresDate)
    }

    return 0
  }

  setAuthTokenExpiresDate = (expiresDate: number) => {
    this.set(LS_Constants.AUTH_TOKEN_EXPIRES_DATE, JSON.stringify(expiresDate))
  }

  removeAuthTokenExpiresDate = () => {
    this.remove(LS_Constants.AUTH_TOKEN_EXPIRES_DATE)
  }

  getTempAuthToken = (): string => {
    const authToken = this.get(LS_Constants.TEMP_AUTH_TOKEN)

    return this.convertStringOrNullToString(authToken)
  }

  setTempAuthToken = (accessToken: string) => {
    this.set(LS_Constants.TEMP_AUTH_TOKEN, accessToken)
  }

  removeTempAuthToken = () => {
    this.remove(LS_Constants.TEMP_AUTH_TOKEN)
  }

  getGoogleAccessToken = (): string | null => {
    return this.get(LS_Constants.GOOGLE_ACCESS_TOKEN)
  }

  setGoogleAccessToken = (googleAccessToken: string) => {
    this.set(LS_Constants.GOOGLE_ACCESS_TOKEN, googleAccessToken)
  }

  removeGoogleAccessToken = () => {
    this.remove(LS_Constants.GOOGLE_ACCESS_TOKEN)
  }

  getGoogleExpiresDate = (): number | null => {
    const expiresDate = this.get(LS_Constants.GOOGLE_EXPIRES_DATE)

    if (expiresDate) {
      return JSON.parse(expiresDate)
    }

    return null
  }

  setGoogleExpiresDate = (googleExpiredDate: number) => {
    this.set(
      LS_Constants.GOOGLE_EXPIRES_DATE,
      JSON.stringify(googleExpiredDate)
    )
  }

  removeGoogleExpiresDate = () => {
    this.remove(LS_Constants.GOOGLE_EXPIRES_DATE)
  }

  isRefreshRequired = (): boolean =>
    Boolean(this.get(LS_Constants.REFRESH_TOKEN_REQUIRED))

  setRefreshRequiredToTrue = () => {
    this.set(LS_Constants.REFRESH_TOKEN_REQUIRED, 't')
  }

  setRefreshRequiredToFalse = () => {
    this.remove(LS_Constants.REFRESH_TOKEN_REQUIRED)
  }

  removeUserData = () => {
    this.removeAuthToken()
    this.removeAuthTokenExpiresDate()
    this.removeGoogleAccessToken()
    this.removeGoogleExpiresDate()
  }

  cleanLoginGarbage = () => {
    this.setRefreshRequiredToFalse()
    this.removeTempAuthToken()
  }
}

export default new AuthLocalStorage()
