import SynchronizableService from "../synchronizable/SynchronizableService"
import UserSettingsDataModel from '../../types/user/api/UserSettingsDataModel'
import UserSettingsEntity from "../../types/user/database/UserSettingsEntity"
import UserSettingsRepository, { UserSettingsRepositoryImpl } from '../../storage/database/user/UserSettingsRepository'
import APIRequestMappingConstants from "../../constants/api/APIRequestMappingConstants"
import APIWebSocketDestConstants from "../../constants/api/APIWebSocketDestConstants"
import TreatmentService from "../treatment/TreatmentService"
import { ColorThemeOption } from "../../types/context_provider/ColorThemeContextType"
import LanguageBase from '../../constants/languages/LanguageBase'
import ColorThemeEnum from "../../types/user/view/ColorThemeEnum"
import { FontSizeOption } from "../../types/context_provider/FontSizeContextType"
import { Language } from "../../types/context_provider/LanguageContextType"
import LanguageCodeConstants from "../../constants/languages/LanguageCodeConstants"
import PT from "../../constants/languages/PT"
import EN from "../../constants/languages/EN"
import { UserSettingsContextType } from '../../context/provider/user_settings/index'
import FontSizeEnum from "../../types/user/view/FontSizeEnum"
import TreatmentEntity from '../../types/treatment/database/TreatmentEntity'

export class UserSettingsServiceImpl extends SynchronizableService<
number,
number,
UserSettingsDataModel,
UserSettingsEntity,
UserSettingsRepositoryImpl> {
    async convertModelToEntity(model: UserSettingsDataModel): Promise<UserSettingsEntity | undefined> {
        const entity:  UserSettingsEntity = {
          colorTheme: model.colorTheme,
          declineGoogleContacts: model.declineGoogleContacts,
          fontSize: model.fontSize,
          includeEssentialContact: model.includeEssentialContact,
          language: model.language,
          syncGoogleContacts: model.syncGoogleContacts,
          firstSettingsDone: model.firstSettingsDone,
          settingsStep: model.settingsStep
        }

        if (model.treatmentId) {
          const treatment = await TreatmentService.getById(model.treatmentId)

          if (treatment) {
            entity.treatmentLocalId = treatment.localId
          }
        }
      
        return entity
    }
    
    async convertEntityToModel(entity: UserSettingsEntity): Promise<UserSettingsDataModel | undefined> {
      const model: UserSettingsDataModel = {
        colorTheme: entity.colorTheme,
        declineGoogleContacts: entity.declineGoogleContacts,
        fontSize: entity.fontSize,
        includeEssentialContact: entity.includeEssentialContact,
        language: entity.language,
        syncGoogleContacts: entity.syncGoogleContacts,
        firstSettingsDone: entity.firstSettingsDone,
        settingsStep: entity.settingsStep
      }
  
      if (entity.treatmentLocalId) {
        const treatment = await TreatmentService.getByLocalId(entity.treatmentLocalId)
        if (treatment && treatment.id) {
          model.treatmentId = treatment.id
        }
      }

      return model
    }

    async saveLocally(entity: UserSettingsEntity) {
      await this.localSave(entity)
      this.updateContext()
    }

    getColorThemeOptions(language: LanguageBase): ColorThemeOption[] {  
      return [
        {
          code: ColorThemeEnum.DEVICE,
          name: language.DEVICE_DEFAULT_THEME_NAME,
        },
        {
          code: ColorThemeEnum.LIGHT,
          name: language.LIGHT_THEME_NAME,
        },
        {
          code: ColorThemeEnum.DARK,
          name: language.DARK_THEME_NAME,
        },
        {
          code: ColorThemeEnum.DALTONIAN,
          name: language.DALTONIAN_THEME_NAME,
        },
      ]
    }

    getFontSizeOptions(language: LanguageBase): FontSizeOption[] {
      return [
        {
          code: FontSizeEnum.DEFAULT,
          name: language.DEFAULT_FONT_SIZE_NAME,
        },
        {
          code: FontSizeEnum.LARGE,
          name: language.LARGE_FONT_SIZE_NAME,
        },
        {
          code: FontSizeEnum.LARGER,
          name: language.LARGER_FONT_SIZE_NAME,
        },
      ]
    }

    getLanguages(language: LanguageBase): Language[] {  
      return [
        {
          code: LanguageCodeConstants.PORTUGUESE,
          name: language.LANGUAGE_PORTUGUESE,
        },
        {
          code: LanguageCodeConstants.ENGLISH,
          name: language.LANGUAGE_ENGLISH,
        },
      ]
    }

    setHTMLLanguage(language: LanguageBase) {
      const html = document.getElementById('html')
  
      if (html) {
        html.lang = language.ISO_LANGUAGE_CODE
      }
    }

    getUserSettingsEntity(userSettings: UserSettingsContextType): UserSettingsEntity | undefined {
      return userSettings.data.length > 0 ? userSettings.data[0] : undefined
    }

    getEssentialContactGrant(userSettings: UserSettingsContextType): boolean | undefined {
      const entity = this.getUserSettingsEntity(userSettings)

      if (entity) {
        return entity.includeEssentialContact
      } else {
        return undefined
      }
    }

    getTreatment(userSettings: UserSettingsContextType, treatments: TreatmentEntity[]): TreatmentEntity | undefined {
      const entity = this.getUserSettingsEntity(userSettings)

      if (entity && entity.treatmentLocalId) {
        const treatment = treatments.find(treatment => treatment.localId === entity.treatmentLocalId)
        if (treatment) {
          return treatment
        }
      }

      return undefined
    }

    getFirstSettingsDone(userSettings: UserSettingsContextType): boolean | undefined {
      const entity = this.getUserSettingsEntity(userSettings)

      if (entity) {
        return entity.firstSettingsDone
      } else {
        return undefined
      }
    }

    getSyncGoogleContact(userSettings: UserSettingsContextType): boolean {
      const entity = this.getUserSettingsEntity(userSettings)

      if (entity) {
        return entity.syncGoogleContacts
      } else {
        return false
      }
    }

    getDeclinedGoogleContact(userSettings: UserSettingsContextType): boolean {
      const entity = this.getUserSettingsEntity(userSettings)

      if (entity) {
        return entity.declineGoogleContacts
      } else {
        return false
      }
    }

    getLanguage = (userSettings: UserSettingsContextType): LanguageBase => {
      const entity = this.getUserSettingsEntity(userSettings)

      if (entity && entity.language === LanguageCodeConstants.ENGLISH) {
        return new EN()
      } else {
        return new PT()
      }
    }

    getColorThemeCode = (userSettings: UserSettingsContextType): number => {
      const entity = this.getUserSettingsEntity(userSettings)

      return entity ? entity.colorTheme : 4
    }

    getColorTheme = (userSettings: UserSettingsContextType): string => {
      const entity = this.getUserSettingsEntity(userSettings)

      if (entity) {
        switch (entity.colorTheme) {
          case 1:
            return 'light'
          case 2:
            return 'dark'
          case 3:
            return 'high_contrast'
          case 4:
            return this.getSystemColorThemeName()
          default:
            return this.getSystemColorThemeName()
        }
      }

      return this.getSystemColorThemeName()
    }

    getFontSizeCode = (userSettings: UserSettingsContextType): number => {
      const entity = this.getUserSettingsEntity(userSettings)

      return entity ? entity.fontSize : 1
    }

    getFontSize = (userSettings: UserSettingsContextType): string => {
      const entity = this.getUserSettingsEntity(userSettings)

      if (entity) {
        switch (entity.fontSize) {
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
      return 'default'
    }

    getSystemColorThemeName = (): string => {
      const matchDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
      if (matchDarkMode && matchDarkMode.matches) {
        return 'dark'
      }
  
      return 'light'
    }
}

export default new UserSettingsServiceImpl(
    UserSettingsRepository,
    APIRequestMappingConstants.USER_SETTINGS,
    APIWebSocketDestConstants.USER_SETTINGS_UPDATE,
    APIWebSocketDestConstants.USER_SETTINGS_DELETE
  )
  