import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import DataConstants from '../../constants/app_data/DataConstants'
import LanguageBase from '../../constants/languages/LanguageBase'
import PhoneDataModel from '../../types/contact/api/PhoneDataModel'
import ContactEntity from '../../types/contact/database/ContactEntity'
import PhoneEntity from '../../types/contact/database/PhoneEntity'
import ArrayUtils from '../../utils/ArrayUtils'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import ContactService from './ContactService'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/Database'
import Utils from '../../utils/Utils'
import PermissionEnum from '../../types/enum/PermissionEnum'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'
import EssentialPhoneService from './EssentialPhoneService'

export class PhoneServiceImpl extends AutoSynchronizableService<
	number,
	PhoneDataModel,
	PhoneEntity
> {
	constructor() {
		super(
			Database.phone,
			APIHTTPPathsConstants.PHONE,
			WebSocketQueuePathService,
			APIWebSocketPathsConstants.PHONE,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return [ContactService]
	}

	getSyncNecessaryPermissions(): PermissionEnum[] {
		return [PermissionEnum.USER]
	}

	async convertModelToEntity(
		model: PhoneDataModel,
	): Promise<PhoneEntity | undefined> {
		const entity: PhoneEntity = {
			number: model.number,
			type: model.type,
		}

		const contactId = model.contactId
		if (Utils.isNotEmpty(contactId)) {
			const contact = await ContactService.getById(contactId!)
			entity.localContactId = contact?.localId
		}

		const essentialPhoneId = model.essentialPhoneId
		if (Utils.isNotEmpty(essentialPhoneId)) {
			const ePhone = await EssentialPhoneService.getById(essentialPhoneId!)
			if (ePhone) {
				entity.localEssentialPhoneId = ePhone.localId
			}
		}

		return entity
	}

	async convertEntityToModel(
		entity: PhoneEntity,
	): Promise<PhoneDataModel | undefined> {
		const model: PhoneDataModel = {
			number: entity.number,
			type: entity.type,
		}

		const localEPhoneId = entity.localEssentialPhoneId

		if (Utils.isNotEmpty(localEPhoneId)) {
			const ePhone = await EssentialPhoneService.getByLocalId(localEPhoneId!)
			if (ePhone) {
				model.essentialPhoneId = ePhone.id
			}
		}

		const localContactId = entity.localContactId

		if (Utils.isNotEmpty(localContactId)) {
			const contact = await ContactService.getByLocalId(localContactId!)
			model.contactId = contact?.id

			return model
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
			case DataConstants.CONTACT_PHONE_CODE_PUBLIC_SERVICE:
				return language.CONTACT_PUBLIC_SERVICE_PHONE

			case DataConstants.CONTACT_PHONE_CODE_RESIDENTIAL:
				return language.CONTACT_RESIDENTIAL_PHONE

			default:
				return language.CONTACT_MOBILE_PHONE
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
}

export default new PhoneServiceImpl()
