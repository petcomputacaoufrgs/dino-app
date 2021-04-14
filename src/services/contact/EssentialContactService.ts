import APIHTTPPathsConstants from '../../constants/api/APIHTTPPathsConstants'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
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
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import PermissionEnum from '../../types/enum/PermissionEnum'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'
import EssentialPhoneService from './EssentialPhoneService'

class EssentialContactServiceImpl extends AutoSynchronizableService<
	number,
	EssentialContactDataModel,
	EssentialContactEntity
> {
	constructor() {
		super(
			Database.essentialContact,
			APIHTTPPathsConstants.ESSENTIAL_CONTACT,
			WebSocketQueuePathService,
			APIWebSocketPathsConstants.ESSENTIAL_CONTACT,
		)
	}

	getSyncDependencies(): SynchronizableService[] {
		return [TreatmentService]
	}

	getSyncNecessaryPermissions(): PermissionEnum[] {
		return []
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
				this.convertEntityToContactEntity(ec)
			)
			if (savedContact) {
				savePhonesFromEssentialContact(ec, savedContact)
			}
		})

		const savePhonesFromEssentialContact = async (
			ec: EssentialContactEntity,
			c: ContactEntity,
		) => {
			if (ec.localId) {
				const ePhones = await EssentialPhoneService.getAllByEssentialContactLocalId(
					ec.localId,
				)
				if (ePhones.length > 0) {
					const newContactPhones: PhoneEntity[] = ePhones.map(ePhone => {
						return {
							localContactId: c.localId,
							localEssentialPhoneId: ePhone.localId,
							number: ePhone.number,
							type: ePhone.type
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
}

export default new EssentialContactServiceImpl()
