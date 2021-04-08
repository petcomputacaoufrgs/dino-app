import ContactDataModel from '../../types/contact/api/ContactDataModel'
import APIRequestMappingConstants from '../../constants/api/APIHTTPPathsConstants'
import ContactEntity from '../../types/contact/database/ContactEntity'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIPathsConstants from '../../constants/api/APIPathsConstants'
import PhoneEntity from '../../types/contact/database/PhoneEntity'
import StringUtils from '../../utils/StringUtils'
import ContactView from '../../types/contact/view/ContactView'
import SynchronizableService from '../sync/SynchronizableService'
import PhoneService from './PhoneService'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/Database'
import EssentialContactService from './EssentialContactService'
import Utils from '../../utils/Utils'
import EssentialContactView from '../../types/contact/view/EssentialContactView'
import PermissionEnum from '../../types/enum/AuthEnum'

class ContactServiceImpl extends AutoSynchronizableService<
	number,
	ContactDataModel,
	ContactEntity
> {
	constructor() {
		super(
			Database.contact,
			APIRequestMappingConstants.CONTACT,
			WebSocketQueuePathService,
			APIPathsConstants.CONTACT,
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

	getContactViews(
		contacts: ContactEntity[],
		phones: PhoneEntity[]
	): ContactView[] {
		return contacts
			.map(
				contact =>
					({
						contact: contact,
						phones: PhoneService.filterByContact(contact, phones)
					} as ContactView),
			)
			.sort((a, b) => this.contactViewSort(a, b))
	}

	filterContactViews(
		contacts: Array<ContactView | EssentialContactView>,
		searchTerm: string,
	) {
		return contacts.filter((item) => StringUtils.contains(item.contact.name, searchTerm))
	}

	private contactViewSort(a: ContactView, b: ContactView) {
		const bComesFirst = 1
		const aComesFirst = -1

		const sortByName = () => {
			return a.contact.name > b.contact.name ? bComesFirst : aComesFirst
		}

		const aIsEssential = Utils.isNotEmpty(a.contact.localEssentialContactId)
		const bIsEssential = Utils.isNotEmpty(b.contact.localEssentialContactId)

		if (aIsEssential) {
			if (bIsEssential) {
				return sortByName()
			} else {
				return aComesFirst
			}
		} else if (bIsEssential) {
			return bComesFirst
		}

		return sortByName()
	}
}

export default new ContactServiceImpl()
