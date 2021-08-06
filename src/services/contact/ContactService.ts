import ContactDataModel from '../../types/contact/api/ContactDataModel'
import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import ContactEntity from '../../types/contact/database/ContactEntity'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import SynchronizableService from '../sync/SynchronizableService'
import PhoneService from './PhoneService'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/Database'
import EssentialContactService from './EssentialContactService'
import DinoPermission from '../../types/auth/api/DinoPermissions'
import AuthService from '../auth/AuthService'
import { hasValue } from '../../utils/Utils'
import PermissionEnum from '../../types/enum/PermissionEnum'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'

class ContactServiceImpl extends AutoSynchronizableService<
	number,
	ContactDataModel,
	ContactEntity
> {
	constructor() {
		super(
			Database.contact,
			APIHTTPPathsConstants.CONTACT,
			WebSocketQueuePathService,
			APIWebSocketPathsConstants.CONTACT,
		)
	}

	protected getDinoPermissions(): DinoPermission[] {
		return [DinoPermission.RESPONSIBLE]
	}

	getSyncDependencies(): SynchronizableService[] {
		return [EssentialContactService]
	}

	getPermissionsWhichCanEdit(): PermissionEnum[] {
		return [PermissionEnum.USER]
	}

	getPermissionsWhichCanRead(): PermissionEnum[] {
		return [PermissionEnum.USER]
	}

	async convertModelToEntity(model: ContactDataModel): Promise<ContactEntity> {
		const entity: ContactEntity = {
			name: model.name,
			description: model.description,
			color: model.color,
		}

		if (hasValue(model.essentialContactId)) {
			const essentialContact = await EssentialContactService.getById(
				model.essentialContactId!,
			)
			if (essentialContact) {
				entity.localEssentialContactId = essentialContact.localId
			}
		}

		return entity
	}

	async convertEntityToModel(entity: ContactEntity): Promise<ContactDataModel> {
		const model: ContactDataModel = {
			name: entity.name,
			description: entity.description,
			color: entity.color,
		}

		if (hasValue(entity.localEssentialContactId)) {
			const essentialContact = await EssentialContactService.getByLocalId(
				entity.localEssentialContactId!,
			)

			if (essentialContact) {
				model.essentialContactId = essentialContact.id
			}
		}

		return model
	}

	async getAllDerivatedFromEssential(): Promise<ContactEntity[]> {
		return this.toList(
			this.table.where('localEssentialContactId').aboveOrEqual(0),
		)
	}

	async deleteUserEssentialContacts() {
		const hasPermission = await AuthService.hasPermissions(this.getDinoPermissions())
		if (!hasPermission) return
		
		const contacts = await this.getAllDerivatedFromEssential()

		const phoneDeletePromises = contacts.map(contact => {
			return PhoneService.deleteByContact(contact)
		})

		await Promise.all(phoneDeletePromises)

		await this.deleteAll(contacts)
	}
}

export default new ContactServiceImpl()
