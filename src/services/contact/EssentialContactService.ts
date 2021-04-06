import APIRequestMappingConstants from '../../constants/api/APIHTTPPathsConstants'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIPathsConstants from '../../constants/api/APIPathsConstants'
import SynchronizableService from '../sync/SynchronizableService'
import Database from '../../storage/Database'
import EssentialContactDataModel from '../../types/contact/api/EssentialContactDataModel'
import EssentialContactEntity from '../../types/contact/database/EssentialContactEntity'
import UserSettingsEntity from '../../types/user/database/UserSettingsEntity'
import ContactEntity from '../../types/contact/database/ContactEntity'
import ContactService from './ContactService'
import PhoneService from './PhoneService'
import PhoneEntity from '../../types/contact/database/PhoneEntity'
import TreatmentService from '../treatment/TreatmentService'
import Utils from '../../utils/Utils'
import WebSocketTopicPathService from '../websocket/path/WebSocketTopicPathService'
import GoogleContactService from './GoogleContactService'
import EssentialContactView from '../../types/contact/view/EssentialContactView'
import StringUtils from '../../utils/StringUtils'
import AuthEnum from '../../types/enum/AuthEnum'

class EssentialContactServiceImpl extends AutoSynchronizableService<
	number,
	EssentialContactDataModel,
	EssentialContactEntity
> {
	constructor() {
		super(
			Database.essentialContact,
			APIRequestMappingConstants.ESSENTIAL_CONTACT,
			WebSocketTopicPathService,
			APIPathsConstants.ESSENTIAL_CONTACT,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return [TreatmentService]
	}

	getSyncNecessaryAuthorities(): AuthEnum[] {
		return [AuthEnum.USER, AuthEnum.STAFF, AuthEnum.ADMIN]
	}

	async convertModelToEntity(
		model: EssentialContactDataModel,
	): Promise<EssentialContactEntity> {
		const entity: EssentialContactEntity = {
			name: model.name,
			description: model.description,
			color: model.color,
			isUniversal: 1,
		}

		if (model.treatmentIds) {
			const treatments = await TreatmentService.getAllByIds(model.treatmentIds)
			const treatmentLocalIds = treatments
				.filter(treatment => Utils.isNotEmpty(treatment.localId))
				.map(treatment => treatment.localId!)

			if (treatmentLocalIds.length > 0) {
				entity.isUniversal = 0
				entity.treatmentLocalIds = treatmentLocalIds
			}
		}

		return entity
	}

	async convertEntityToModel(
		entity: EssentialContactEntity,
	): Promise<EssentialContactDataModel> {
		const model: EssentialContactDataModel = {
			name: entity.name,
			description: entity.description,
			color: entity.color,
		}

		if (entity.treatmentLocalIds) {
			const treatments = await TreatmentService.getAllByLocalIds(
				entity.treatmentLocalIds,
			)
			model.treatmentIds = treatments
				.filter(treatment => Utils.isNotEmpty(treatment.id))
				.map(treatment => treatment.id!)
		}

		return model
	}

	private async getUniversalEssentialContacts(): Promise<
		EssentialContactEntity[]
	> {
		return this.table.where('isUniversal').equals(1).toArray()
	}

	private async getTreatmentEssentialContacts(
		settings: UserSettingsEntity,
	): Promise<EssentialContactEntity[]> {
		if (Utils.isNotEmpty(settings.treatmentLocalId)) {
			return this.table
				.where('treatmentLocalIds')
				.equals(settings.treatmentLocalId!)
				.toArray()
		} else return []
	}

	public async saveUserEssentialContacts(settings: UserSettingsEntity) {
		const essentialContacts: EssentialContactEntity[] = []

		const universalContactsPromise = this.getUniversalEssentialContacts()
		const treatmentContactPromise = this.getTreatmentEssentialContacts(settings)
		const results = await Promise.all([
			universalContactsPromise,
			treatmentContactPromise,
		])
		essentialContacts.push(...results[0], ...results[1])

		//TODO: Estudar possibilidade de uma saveAll em contatos também
		essentialContacts.forEach(async ec => {
			const savedContact = await ContactService.save(
				this.convertEntityToContactEntity(ec),
			)
			if (savedContact) {
				await GoogleContactService.saveGoogleContact(savedContact)
				savePhonesFromEssentialContact(ec, savedContact)
			}
		})

		const savePhonesFromEssentialContact = async (
			ec: EssentialContactEntity,
			c: ContactEntity,
		) => {
			if (ec.localId) {
				const phones = await PhoneService.getAllByEssentialContactLocalId(
					ec.localId,
				)
				if (phones.length > 0) {
					const newContactPhones: PhoneEntity[] = phones.map(p => {
						return {
							localContactId: c.localId,
							number: p.number,
							type: p.type,
							originalEssentialPhoneId: ec.id,
						}
					})
					await PhoneService.saveAll(newContactPhones)
				}
			}
		}
	}

	private convertEntityToContactEntity(entity: EssentialContactEntity): ContactEntity {
		const contactEntity: ContactEntity = {
			name: entity.name,
			description: entity.description,
			color: entity.color,
			localEssentialContactId: entity.localId,
		}

		return contactEntity
	}

	getEssentialContactViews(
		eContacts: EssentialContactEntity[],
		phones: PhoneEntity[],
	): EssentialContactView[] {
		return eContacts
			.map(e => ({
						contact: e,
						phones: PhoneService.filterByEssentialContact(e, phones),
					} as EssentialContactView),
			)
			.sort((a, b) => a.contact.name > b.contact.name ? 1 : -1)
	}

	filterEssentialContactViews(
		contacts: EssentialContactView[],
		searchTerm: string,
	): EssentialContactView[] {
		return contacts.filter(item => StringUtils.contains(item.contact.name, searchTerm))
	}
}

export default new EssentialContactServiceImpl()
