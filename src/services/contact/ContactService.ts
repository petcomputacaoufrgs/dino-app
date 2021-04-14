import ContactDataModel from '../../types/contact/api/ContactDataModel'
import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import ContactEntity from '../../types/contact/database/ContactEntity'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import SynchronizableService from '../sync/SynchronizableService'
import PhoneService from './PhoneService'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/Database'
import EssentialContactService from './EssentialContactService'
import Utils from '../../utils/Utils'
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

	getSyncDependencies(): SynchronizableService[] {
		return [EssentialContactService]
	}

	getSyncNecessaryPermissions(): PermissionEnum[] {
		return [PermissionEnum.USER]
	}

	async convertModelToEntity(model: ContactDataModel): Promise<ContactEntity> {
		const entity: ContactEntity = {
			name: model.name,
			description: model.description,
			color: model.color,
		}

		if (Utils.isNotEmpty(model.essentialContactId)) {
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

		if (Utils.isNotEmpty(entity.localEssentialContactId)) {
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
		return this.table.where('localEssentialContactId').aboveOrEqual(0).toArray()
	}

	async deleteUserEssentialContacts() {
		const contacts = await this.getAllDerivatedFromEssential()

		const phoneDeletePromises = contacts.map(contact => {
			return PhoneService.deleteByContact(contact)
		})

		await Promise.all(phoneDeletePromises)

		await this.deleteAll(contacts)
	}
}

export default new ContactServiceImpl()
