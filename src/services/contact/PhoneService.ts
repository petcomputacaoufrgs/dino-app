import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import ContactsConstants from '../../constants/contact/ContactsConstants'
import LanguageBase from '../../constants/languages/LanguageBase'
import PhoneDataModel from '../../types/contact/api/PhoneDataModel'
import ContactEntity from '../../types/contact/database/ContactEntity'
import PhoneEntity from '../../types/contact/database/PhoneEntity'
import ArrayUtils from '../../utils/ArrayUtils'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import ContactService from './ContactService'
import ContactView from '../../types/contact/view/ContactView'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/Database'
import EssentialContactService from './EssentialContactService'
import Utils from '../../utils/Utils'

export class PhoneServiceImpl extends AutoSynchronizableService<
	number,
	PhoneDataModel,
	PhoneEntity
> {
	constructor() {
		super(
			Database.phone,
			APIRequestMappingConstants.PHONE,
			WebSocketQueuePathService,
			APIWebSocketDestConstants.PHONE,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return [ContactService, EssentialContactService]
	}

	async convertModelToEntity(
		model: PhoneDataModel,
	): Promise<PhoneEntity | undefined> {
		const entity: PhoneEntity = {
			number: model.number,
			type: model.type,
		}

		const contactId = model.contactId
		const essentialContactId = model.essentialContactId
		if (Utils.isNotEmpty(contactId)) {
			const contact = await ContactService.getById(contactId!)
			entity.localContactId = contact?.localId

			if (Utils.isNotEmpty(model.originalEssentialPhoneId)) {
				const originalEPhone = await this.getById(
					model.originalEssentialPhoneId!,
				)

				if (originalEPhone) {
					entity.localOriginalEssentialPhoneId = originalEPhone.localId
				}
			}
		} else if (Utils.isNotEmpty(essentialContactId)) {
			const essentialContact = await EssentialContactService.getById(
				essentialContactId!,
			)
			entity.localEssentialContactId = essentialContact?.localId
		} else return

		return entity
	}

	async convertEntityToModel(
		entity: PhoneEntity,
	): Promise<PhoneDataModel | undefined> {
		const model: PhoneDataModel = {
			number: entity.number,
			type: entity.type,
		}
		const localContactId = entity.localContactId
		const localEssentialContactId = entity.localEssentialContactId

		if (Utils.isNotEmpty(localContactId)) {
			const contact = await ContactService.getByLocalId(localContactId!)
			model.contactId = contact?.id
			if (Utils.isNotEmpty(entity.localOriginalEssentialPhoneId)) {
				const originalEPhone = await this.getByLocalId(
					entity.localOriginalEssentialPhoneId!,
				)

				if (originalEPhone && originalEPhone.id) {
					model.originalEssentialPhoneId = originalEPhone.id
					return model
				}
			} else {
				return model
			}
		} else if (Utils.isNotEmpty(localEssentialContactId)) {
			const essentialContact = await EssentialContactService.getByLocalId(
				localEssentialContactId!,
			)

			if (essentialContact && essentialContact.id) {
				model.essentialContactId = essentialContact.id
				return model
			}
		}
	}

	async getAllByContactLocalId(localContactId: number): Promise<PhoneEntity[]> {
		return this.table.where('localContactId').equals(localContactId).toArray()
	}

	async getAllByEssentialContactLocalId(
		localEssentialContactId: number,
	): Promise<PhoneEntity[]> {
		return this.table
			.where('localEssentialContactId')
			.equals(localEssentialContactId)
			.toArray()
	}

	getPhoneTypes = (
		phones: Array<PhoneEntity>,
		language: LanguageBase,
	): string => {
		if (phones.length > 0) {
			const types = ArrayUtils.removeRepeatedValues(
				phones.map(phone => phone.type),
			)

			return types.map(type => this.getPhoneType(type, language)).toString()
		}
		return ''
	}

	getPhoneType = (type: number, language: LanguageBase): string => {
		switch (type) {
			case ContactsConstants.PUBLIC_SERVICE:
				return language.CONTACTS_PUBLIC_SERVICE_PHONE

			case ContactsConstants.RESIDENTIAL:
				return language.CONTACTS_RESIDENTIAL_PHONE

			default:
				return language.CONTACTS_MOBILE_PHONE
		}
	}

	async deleteByContact(contact: ContactEntity): Promise<void> {
		if (Utils.isNotEmpty(contact.localId)) {
			const phones = await this.table
				.where('localContactId')
				.equals(contact.localId!)
				.toArray()

			if (phones.length > 0) {
				await this.deleteAll(phones)
			}
		}
	}

	filterByContact(
		contact: ContactEntity,
		phones: PhoneEntity[],
	): PhoneEntity[] | undefined {
		if (contact.localId) {
			return phones.filter(phone => phone.localContactId === contact.localId)
		}
	}

	getContactWithSamePhone(
		items: ContactView[],
		newPhones: PhoneEntity[],
		currentContact?: ContactView,
	): ContactView | undefined {
		return items.find(
			item =>
				(!currentContact ||
					item.contact.localId !== currentContact.contact.localId) &&
				item.phones.some(phone =>
					newPhones.some(newPhone => newPhone.number.includes(phone.number)),
				),
		)
	}
}

export default new PhoneServiceImpl()
