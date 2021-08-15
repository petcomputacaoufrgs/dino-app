import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketPathsConstants'
import { KidsSpaceSettingsModel } from '../../types/kids_space/api/KidsSpaceSettingsModel'
import { KidsSpaceSettingsEntity } from '../../types/kids_space/database/KidsSpaceSettingsEntity'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import SynchronizableService from '../sync/SynchronizableService'
import UserService from '../user/UserService'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/Database'
import PermissionEnum from '../../types/enum/PermissionEnum'
import { LanguageContextType } from '../../context/language'
import DataConstants from '../../constants/app_data/DataConstants'
import StringUtils from '../../utils/StringUtils'

class KidsSpaceSettingsServiceImpl extends AutoSynchronizableService<
	number,
	KidsSpaceSettingsModel,
	KidsSpaceSettingsEntity
> {
	constructor() {
		super(
			Database.kidsSpaceSettings,
			APIHTTPPathsConstants.KIDS_SPACE_SETTINGS,
			WebSocketQueuePathService,
			APIWebSocketDestConstants.KIDS_SPACE_SETTINGS,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return [UserService]
	}

	getPermissionsWhichCanEdit(): PermissionEnum[] {
		return [PermissionEnum.USER]
	}

	getPermissionsWhichCanRead(): PermissionEnum[] {
		return [PermissionEnum.USER]
	}

	async convertModelToEntity(
		model: KidsSpaceSettingsModel,
	): Promise<KidsSpaceSettingsEntity | undefined> {
		const entity: KidsSpaceSettingsEntity = {
			color: model.color,
			hat: model.hat,
			firstSettingsDone: model.firstSettingsDone,
			parentsAreaPassword: model.parentsAreaPassword,
		}

		return entity
	}

	async convertEntityToModel(
		entity: KidsSpaceSettingsEntity,
	): Promise<KidsSpaceSettingsModel | undefined> {
		const model: KidsSpaceSettingsModel = {
			color: entity.color,
			hat: entity.hat,
			firstSettingsDone: entity.firstSettingsDone,
			parentsAreaPassword: entity.parentsAreaPassword,
		}

		return model
	}

	getDefaultKidsSpaceSettings = () => {
		return {
			color: 'default',
			hat: 'none',
			firstSettingsDone: false,
		} as KidsSpaceSettingsEntity
	}

	invalidPasswordError = (
		parentsAreaPassword: string,
		confirmParentsAreaPassword: string,
		language: LanguageContextType,
	) => {
		parentsAreaPassword = StringUtils.removeWhiteSpace(parentsAreaPassword)
		confirmParentsAreaPassword = StringUtils.removeWhiteSpace(
			confirmParentsAreaPassword,
		)

		if (
			parentsAreaPassword.length < DataConstants.USER_PASSWORD.MIN ||
			parentsAreaPassword.length > DataConstants.USER_PASSWORD.MAX
		) {
			return language.data.PASSWORD_LENGHT_ERROR_MESSAGE
		} else if (parentsAreaPassword !== confirmParentsAreaPassword) {
			return language.data.PASSWORD_CONFIRM_LENGHT_ERROR_MESSAGE
		}
		return undefined
	}

	saveParentsAreaPassword = async (parentsAreaPassword: string) => {
		parentsAreaPassword = StringUtils.removeWhiteSpace(parentsAreaPassword)

		let kidsSpaceSettings = await this.getFirst()
		if (kidsSpaceSettings === undefined) {
			kidsSpaceSettings = this.getDefaultKidsSpaceSettings()
		}
		kidsSpaceSettings.parentsAreaPassword = parentsAreaPassword
		this.save(kidsSpaceSettings)
	}
}

export default new KidsSpaceSettingsServiceImpl()
