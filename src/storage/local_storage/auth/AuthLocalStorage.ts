import BaseLocalStorage from '../BaseLocalStorage'
import LS_Constants from '../../../constants/local_storage/LocalStorageKeysConstants'

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

  getGoogleAuthScopes = (): string[] | null => {
    const scopes = this.get(LS_Constants.GOOGLE_SCOPES)

    if (scopes) {
      return JSON.parse(scopes)
    }

    return null
  }

  setGoogleAuthScopes = (scopes: string[]) => {
    this.set(LS_Constants.GOOGLE_SCOPES, JSON.stringify(scopes))
  }

  removeGoogleAuthScopes = () => {
    this.remove(LS_Constants.GOOGLE_SCOPES)
  }

  isRefreshRequired = (): boolean => {
    const value = this.get(LS_Constants.REFRESH_TOKEN_REQUIRED)

    if (value !== null) {
      return JSON.parse(value)
    }

    return false
  }

  setRefreshRequiredToTrue = () => {
    this.set(LS_Constants.REFRESH_TOKEN_REQUIRED, JSON.stringify(true))
  }

  setRefreshRequiredToFalse = () => {
    this.remove(LS_Constants.REFRESH_TOKEN_REQUIRED)
  }

  isRefreshingAccessToken = (): boolean => {
    const value = this.get(LS_Constants.IS_REFRESHING_ACCESS_TOKEN)

    if (value !== null) {
      return JSON.parse(value)
    }

    return false
  }

  setRefreshingAccessToken = (value: boolean) => {
    this.set(LS_Constants.IS_REFRESHING_ACCESS_TOKEN, JSON.stringify(value))
  }

  removeRefreshingAccessToken = () => {
    this.remove(LS_Constants.IS_REFRESHING_ACCESS_TOKEN)
  }

  successRefreshingAccessToken = (): boolean => {
    const value = this.get(LS_Constants.SUCCESS_REFRESHING_ACCESS_TOKEN)

    if (value === null) {
      return true
    }

    return JSON.parse(value)
  }

  setSuccessRefreshingAccessToken = (value: boolean) => {
    this.set(
      LS_Constants.SUCCESS_REFRESHING_ACCESS_TOKEN,
      JSON.stringify(value)
    )
  }

  removeSuccessRefreshingAccessToken = () => {
    this.remove(LS_Constants.SUCCESS_REFRESHING_ACCESS_TOKEN)
  }

  isRefreshingGoogleAccessToken = (): boolean => {
    const value = this.get(LS_Constants.IS_REFRESHING_GOOGLE_ACCESS_TOKEN)

    if (value !== null) {
      return JSON.parse(value)
    }

    return false
  }

  setRefreshingGoogleAccessToken = (value: boolean) => {
    this.set(
      LS_Constants.IS_REFRESHING_GOOGLE_ACCESS_TOKEN,
      JSON.stringify(value)
    )
  }

  removeRefreshingGoogleAccessToken = () => {
    this.remove(LS_Constants.IS_REFRESHING_GOOGLE_ACCESS_TOKEN)
  }

  successRefreshingGoogleAccessToken = (): boolean => {
    const value = this.get(LS_Constants.SUCCESS_REFRESHING_GOOGLE_ACCESS_TOKEN)

    if (value === null) {
      return true
    }

    return JSON.parse(value)
  }

  setSuccessRefreshingGoogleAccessToken = (value: boolean) => {
    this.set(
      LS_Constants.SUCCESS_REFRESHING_GOOGLE_ACCESS_TOKEN,
      JSON.stringify(value)
    )
  }

  getDeclinedContactsGrant = (): boolean => {
    const value = this.get(LS_Constants.DECLINED_CONTACTS_GRANT)

    if (value === null) {
      return false
    }

    return JSON.parse(value)
  }

  setDeclinedContactsGrant = (declined: boolean) => {
    this.set(
      LS_Constants.DECLINED_CONTACTS_GRANT,
      JSON.stringify(declined)
    )
  }


  removeSuccessRefreshingGoogleAccessToken = () => {
    this.remove(LS_Constants.SUCCESS_REFRESHING_GOOGLE_ACCESS_TOKEN)
  }

  removeUserData = () => {
    this.removeAuthToken()
    this.removeAuthTokenExpiresDate()
    this.removeGoogleAccessToken()
    this.removeGoogleExpiresDate()
    this.removeGoogleAuthScopes()
    this.removeRefreshingAccessToken()
    this.removeSuccessRefreshingAccessToken()
    this.removeRefreshingGoogleAccessToken()
    this.removeSuccessRefreshingGoogleAccessToken()
  }

  cleanLoginGarbage = () => {
    this.setRefreshRequiredToFalse()
    this.removeRefreshingAccessToken()
    this.removeSuccessRefreshingAccessToken()
    this.removeRefreshingGoogleAccessToken()
    this.removeSuccessRefreshingGoogleAccessToken()
  }
}

export default new AuthLocalStorage()
