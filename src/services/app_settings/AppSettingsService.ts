import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import AppSettingsLocalStorage from '../../local_storage/app_settings/AppSettingsLocalStorage'
import DinoAgentService from '../../agent/DinoAgentService'
import LanguageBase from '../../constants/languages/LanguageBase'
import PT from '../../constants/languages/PT'
import EN from '../../constants/languages/EN'
import AppSettingsContextUpdater from '../../context_updater/AppSettingsContextUpdater'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import LanguageCodeConstants from '../../constants/languages/LanguageCodeConstants'
import AppSettingsRequestAndResponseModel from '../../types/app_settings/AppSettingsRequestAndResponseModel'
import ColorThemeEnum from '../../types/app_settings/ColorThemeEnum'

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
      DinoAPIURLConstants.APP_SETTINGS_VERSION
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().go()
        const version: number = response.body
        return version
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    return undefined
  }

  getServer = async (): Promise<AppSettingsRequestAndResponseModel | undefined> => {
    const request = await DinoAgentService.get(
      DinoAPIURLConstants.APP_SETTINGS_GET
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().go()
        const appSettings: AppSettingsRequestAndResponseModel = response.body
        return appSettings
      } catch (e) {
        LogAppErrorService.saveError(e)
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
      colorTheme: ColorThemeEnum.CLASSIC
    }

    return defaultAppSettings
  }

  shouldSync = (): boolean => AppSettingsLocalStorage.getShouldSync()

  setShouldSync = (should: boolean) => {
    AppSettingsLocalStorage.setShouldSync(should)
  }

  saveOnServer = async (model: AppSettingsRequestAndResponseModel): Promise<void> => {
    const request = await DinoAgentService.post(
      DinoAPIURLConstants.APP_SETTINGS_SAVE
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(model).go()
        const newVersion = response.body
        AppSettingsLocalStorage.setAppSettingsVersion(newVersion)
        return
      } catch (e) {
        LogAppErrorService.saveError(e)
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

  getColorThemeName = (code: number): string => {
    switch (code) {
      case 1:
        return 'classic'
      case 2: 
        return 'dark'
      case 3:
        return 'high_contrast'
      default:
        return 'classic'
    }
  }

  returnAppSettingsToDefault = (): void => {
    const appSettings = this.getDefaultAppSettings()
    this.updateLocalAppSettings(appSettings)
  }

  private updateLocalAppSettings = (appSettings: AppSettingsRequestAndResponseModel) => {
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
