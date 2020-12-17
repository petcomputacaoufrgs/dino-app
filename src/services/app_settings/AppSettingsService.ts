import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import AppSettingsLocalStorage from '../../storage/local_storage/app_settings/AppSettingsLocalStorage'
import DinoAgentService from '../../agent/DinoAgentService'
import LanguageBase from '../../constants/languages/LanguageBase'
import PT from '../../constants/languages/PT'
import EN from '../../constants/languages/EN'
import AppSettingsContextUpdater from '../../context/updater/AppSettingsContextUpdater'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import LanguageCodeConstants from '../../constants/languages/LanguageCodeConstants'
import AppSettingsRequestAndResponseModel from '../../types/app_settings/AppSettingsRequestAndResponseModel'
import ColorThemeEnum from '../../types/app_settings/ColorThemeEnum'
import FontSizeEnum from '../../types/app_settings/FontSizeEnum'

class AppSettingsService {
  listenner = {}

  get = (): AppSettingsRequestAndResponseModel => {
    const savedVersion = AppSettingsLocalStorage.getAppSettingsVersion()

    const savedAppSettings = AppSettingsLocalStorage.getAppSettings()

    if (savedVersion !== 0) {
      if (savedAppSettings) {
        return savedAppSettings
      }
    }

    return savedAppSettings ? savedAppSettings : this.getDefaultAppSettings()
  }

  set = (appSettings: AppSettingsRequestAndResponseModel) => {
    this.updateLocalAppSettings(appSettings)

    this.saveOnServer(appSettings)
  }

  update = async (newVersion: number) => {
    const savedVersion = this.getVersion()

    if (newVersion !== savedVersion) {
      const appSettings = await this.getServer()

      if (appSettings) {
        AppSettingsLocalStorage.setAppSettingsVersion(newVersion)
        this.updateLocalAppSettings(appSettings)
      } else {
        this.setShouldSync(true)
      }
    }
  }

  getVersion = (): number => AppSettingsLocalStorage.getAppSettingsVersion()

  getServerVersion = async (): Promise<number | undefined> => {
    const request = await DinoAgentService.get(
      APIRequestMappingConstants.APP_SETTINGS_VERSION
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().go()
        const version: number = response.body
        return version
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return undefined
  }

  getServer = async (): Promise<
    AppSettingsRequestAndResponseModel | undefined
  > => {
    const request = await DinoAgentService.get(
      APIRequestMappingConstants.APP_SETTINGS_GET
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().go()
        const appSettings: AppSettingsRequestAndResponseModel = response.body
        return appSettings
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return undefined
  }

  removeUserData = () => {
    AppSettingsLocalStorage.removeUserData()
  }

  getDefaultAppSettings = (): AppSettingsRequestAndResponseModel => {
    const defaultAppSettings: AppSettingsRequestAndResponseModel = {
      language: navigator.language.slice(0, 2),
      fontSize: FontSizeEnum.DEFAULT,
      colorTheme: ColorThemeEnum.DEVICE,
      essentialContactGrant: true
    }

    return defaultAppSettings
  }

  shouldSync = (): boolean => AppSettingsLocalStorage.getShouldSync()

  setShouldSync = (should: boolean) => {
    AppSettingsLocalStorage.setShouldSync(should)
  }

  saveOnServer = async (
    model: AppSettingsRequestAndResponseModel
  ): Promise<void> => {
    const request = await DinoAgentService.post(
      APIRequestMappingConstants.APP_SETTINGS_SAVE
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(model).go()
        const newVersion = response.body
        AppSettingsLocalStorage.setAppSettingsVersion(newVersion)
        return
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    AppSettingsLocalStorage.setShouldSync(true)
  }

  getLanguageBase = (): LanguageBase => {
    const language = this.get().language

    return this.getLanguageBaseByCode(language)
  }

  getColorTheme = (): number => {
    const colorTheme = this.get().colorTheme

    return colorTheme
  }

  getFontSize = (): number => {
    const fontSize = this.get().fontSize

    return fontSize
  }

  getColorThemeName = (code: number): string => {
    switch (code) {
      case 1:
        return 'light'
      case 2:
        return 'dark'
      case 3:
        return 'high_contrast'
      case 4:
        return this.getSystemColorThemeName()
      default:
        return 'light'
    }
  }

  getFontSizeName = (code: number): string => {
    switch (code) {
      case 1:
        return 'default'
      case 2:
        return 'large'
      case 3:
        return 'larger'
      default:
        return 'default'
    }
  }

  getSystemColorThemeName = (): string => {
    const matchDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
    if (matchDarkMode && matchDarkMode.matches) {
      return 'dark'
    }

    return 'light'
  }

  returnAppSettingsToDefault = (): void => {
    const appSettings = this.getDefaultAppSettings()
    this.updateLocalAppSettings(appSettings)
  }

  getEssentialContactGrant = (): boolean => {
    return this.get().essentialContactGrant
  }

  setEssentialContactGrant = (value: boolean) => {
    const savedAppSettings = this.get()
    savedAppSettings.essentialContactGrant = value
    this.set(savedAppSettings)
  }

  private updateLocalAppSettings = (
    appSettings: AppSettingsRequestAndResponseModel
  ) => {
    AppSettingsLocalStorage.setAppSettings(appSettings)
    AppSettingsContextUpdater.update()
  }

  private getLanguageBaseByCode = (languageCode: string): LanguageBase => {
    if (languageCode === LanguageCodeConstants.PORTUGUESE) {
      return new PT()
    } else {
      return new EN()
    }
  }
}

export default new AppSettingsService()
