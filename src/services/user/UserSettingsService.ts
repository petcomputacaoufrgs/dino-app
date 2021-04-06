import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import UserSettingsDataModel from '../../types/user/api/UserSettingsDataModel'
import UserSettingsEntity from '../../types/user/database/UserSettingsEntity'
import APIRequestMappingConstants from '../../constants/api/APIHTTPPathsConstants'
import APIPathsConstants from '../../constants/api/APIPathsConstants'
import TreatmentService from '../treatment/TreatmentService'
import LanguageBase from '../../constants/languages/LanguageBase'
import ColorThemeEnum from '../../types/enum/ColorThemeEnum'
import PT from '../../constants/languages/PT'
import EN from '../../constants/languages/EN'
import FontSizeEnum from '../../types/enum/FontSizeEnum'
import OptionType from '../../types/OptionType'
import TreatmentEntity from '../../types/treatment/database/TreatmentEntity'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/Database'
import GoogleScopeService from '../auth/google/GoogleScopeService'
import LanguageEnum from '../../types/enum/LanguageEnum'
import AuthEnum from '../../types/enum/AuthEnum'

class UserSettingsServiceImpl extends AutoSynchronizableService<
	number,
	UserSettingsDataModel,
	UserSettingsEntity
> {
	constructor() {
		super(
			Database.userSettings,
			APIRequestMappingConstants.USER_SETTINGS,
			WebSocketQueuePathService,
			APIPathsConstants.USER_SETTINGS,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return [GoogleScopeService, TreatmentService]
	}

	getSyncNecessaryAuthorities(): AuthEnum[] {
		return []
	}

	async convertModelToEntity(
		model: UserSettingsDataModel,
	): Promise<UserSettingsEntity | undefined> {
		const entity: UserSettingsEntity = {
			colorTheme: model.colorTheme,
			declineGoogleContacts: model.declineGoogleContacts,
			fontSize: model.fontSize,
			includeEssentialContact: model.includeEssentialContact,
			language: model.language || this.getDefaultLanguageCode(),
			firstSettingsDone: model.firstSettingsDone,
			step: model.step,
		}

		if (model.treatmentId) {
			const treatment = await TreatmentService.getById(model.treatmentId)

			if (treatment) {
				entity.treatmentLocalId = treatment.localId
			}
		}

		return entity
	}


	async convertEntityToModel(
		entity: UserSettingsEntity,
	): Promise<UserSettingsDataModel | undefined> {
		const model: UserSettingsDataModel = {
			colorTheme: entity.colorTheme,
			declineGoogleContacts: entity.declineGoogleContacts,
			fontSize: entity.fontSize,
			includeEssentialContact: entity.includeEssentialContact,
			language: entity.language,
			firstSettingsDone: entity.firstSettingsDone,
			step: entity.step,
		}

		if (entity.treatmentLocalId) {
			const treatment = await TreatmentService.getByLocalId(
				entity.treatmentLocalId,
			)
			if (treatment && treatment.id) {
				model.treatmentId = treatment.id
			}
		}

		return model
	}

	getColorThemeOptions(language: LanguageBase): OptionType[] {
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

	getFontSizeOptions(language: LanguageBase): OptionType[] {
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

	getLanguagesOptions(language: LanguageBase): OptionType[] {
		return [
			{
				code: LanguageEnum.PORTUGUESE,
				name: language.LANGUAGE_PORTUGUESE,
			},
			{
				code: LanguageEnum.ENGLISH,
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

	getEssentialContactGrant(
		userSettings: UserSettingsEntity | undefined,
	): boolean | undefined {
		if (userSettings) {
			return userSettings.includeEssentialContact
		} else {
			return undefined
		}
	}

	async getTreatment(
		userSettings: UserSettingsEntity,
	): Promise<TreatmentEntity | undefined> {
		if (userSettings.treatmentLocalId) {
			return TreatmentService.getByLocalId(userSettings.treatmentLocalId)
		}

		return undefined
	}

	getFirstSettingsDone = async (): Promise<boolean | undefined> => {
		const userSettings = await this.getFirst()

		if (userSettings) {
			return userSettings.firstSettingsDone
		} else {
			return false
		}
	}

	getLanguage = (userSettings: UserSettingsEntity): LanguageBase => {
		if (userSettings && userSettings.language === LanguageEnum.ENGLISH) {
			return new EN()
		} else {
			return new PT()
		}
	}

	getDefaultLanguage = (): LanguageBase => {
		if (navigator && navigator.language) {
			if (navigator.language.startsWith('pt')) {
				return new PT()
			}
		}
		return new EN()
	}

	getDefaultLanguageCode = (): number => {
		return this.getDefaultLanguage().LANGUAGE_CODE
	}

	getColorThemeCode = (
		userSettings: UserSettingsEntity | undefined,
	): number => {
		return userSettings
			? userSettings.colorTheme
			: this.getDefaultColorThemeCode()
	}

	getDefaultColorThemeCode = () => {
		return ColorThemeEnum.DEVICE
	}

	getDefaultEssentialContactGrant = () => {
		return true
	}

	getColorThemeName = (userSettings: UserSettingsEntity): string => {
		if (userSettings) {
			switch (userSettings.colorTheme) {
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

	getFontSize = (userSettings: UserSettingsEntity): string => {
		if (userSettings) {
			switch (userSettings.fontSize) {
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

	getFontSizeCode = (userSettings: UserSettingsEntity | undefined): number => {
		return userSettings ? userSettings.fontSize : this.getDefaultFontSizeCode()
	}

	getDefaultFontSizeCode = (): number => {
		return FontSizeEnum.DEFAULT
	}

	getSystemColorThemeName = (): string => {
		const matchDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
		if (matchDarkMode && matchDarkMode.matches) {
			return 'dark'
		}

		return 'light'
	}
}

export default new UserSettingsServiceImpl()
