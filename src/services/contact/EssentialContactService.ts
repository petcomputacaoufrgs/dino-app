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
import WebSocketQueuePathService from '../websocket/path/WebSocketQueuePathService'
import PermissionEnum from '../../types/enum/PermissionEnum'
import APIWebSocketPathsConstants from '../../constants/api/APIWebSocketPathsConstants'
import EssentialPhoneService from './EssentialPhoneService'
import TreatmentEntity from '../../types/treatment/database/TreatmentEntity'
import ArrayUtils from '../../utils/ArrayUtils'
import { hasValue } from '../../utils/Utils'

const TRUE = 1
const FALSE = 0

type RemoveTreatmentAcumType = {
	toSave: EssentialContactEntity[]
	toDelete: EssentialContactEntity[]
}

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
	
	protected getDinoPermissions(): DinoPermission[] {
		return []
	}

	getSyncDependencies(): SynchronizableService[] {
		return [TreatmentService]
	}

	getPermissionsWhichCanEdit(): PermissionEnum[] {
		return [PermissionEnum.ADMIN, PermissionEnum.STAFF]
	}

	getPermissionsWhichCanRead(): PermissionEnum[] {
		return []
	}

	async convertModelToEntity(
		model: EssentialContactDataModel,
	): Promise<EssentialContactEntity> {
		const entity: EssentialContactEntity = {
			name: model.name,
			description: model.description,
			color: model.color,
			isUniversal: TRUE,
		}

		if (model.treatmentIds) {
			const treatments = await TreatmentService.getAllByIds(model.treatmentIds)
			const treatmentLocalIds = treatments
				.filter(treatment => hasValue(treatment.localId))
				.map(treatment => treatment.localId!)

			if (ArrayUtils.isNotEmpty(treatmentLocalIds)) {
				entity.isUniversal = FALSE
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
				.filter(treatment => hasValue(treatment.id))
				.map(treatment => treatment.id!)
		}

		return model
	}

	private async getUniversalEssentialContacts(): Promise<
		EssentialContactEntity[]
	> {
		return this.table.where('isUniversal').equals(TRUE).toArray()
	}

	private async getTreatmentEssentialContacts(
		settings: UserSettingsEntity,
	): Promise<EssentialContactEntity[]> {
		if (hasValue(settings.treatmentLocalId)) {
			return this.toList(
				this.table
					.where('treatmentLocalIds')
					.equals(settings.treatmentLocalId!),
			)
		} else return []
	}

	async removeTreatment(treatment: TreatmentEntity) {
		if (hasValue(treatment.localId)) {
			const essentialContacts = await this.getTreatmentNonUniversalEContacts(
				treatment.localId!,
			)

			const acum = essentialContacts.reduce(
				(acum, ec) => {
					ec.treatmentLocalIds = ec.treatmentLocalIds?.filter(
						t => t !== treatment.localId,
					)

					acum[
						ArrayUtils.isNotEmpty(ec.treatmentLocalIds) ? 'toSave' : 'toDelete'
					].push(ec)

					return acum
				},
				{ toSave: [], toDelete: [] } as RemoveTreatmentAcumType,
			)

			await Promise.all([
				this.saveAll(acum.toSave),
				this.deleteAll(acum.toDelete),
			])
		}
	}

	private getTreatmentNonUniversalEContacts = async (
		treatmentLocalId: number,
	) => {
		return await this.toList(
			this.table
				.where('treatmentLocalIds')
				.equals(treatmentLocalId)
				.filter(ec => ec.isUniversal === FALSE),
		)
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

		essentialContacts.forEach(async ec => {
			const savedContact = await ContactService.save(
				this.convertEntityToContactEntity(ec),
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
				const ePhones =
					await EssentialPhoneService.getAllByEssentialContactLocalId(
						ec.localId,
					)
				if (ArrayUtils.isNotEmpty(ePhones)) {
					const newContactPhones: PhoneEntity[] = ePhones.map(ePhone => {
						return {
							localContactId: c.localId,
							localEssentialPhoneId: ePhone.localId,
							number: ePhone.number,
							type: ePhone.type,
						}
					})
					await PhoneService.saveAll(newContactPhones)
				}
			}
		}
	}

	private convertEntityToContactEntity(
		entity: EssentialContactEntity,
	): ContactEntity {
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
