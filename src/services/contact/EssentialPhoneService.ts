import APIHTTPPathsConstants from "../../constants/api/APIHTTPPathsConstants"
import APIWebSocketPathsConstants from "../../constants/api/APIWebSocketPathsConstants"
import Database from "../../storage/Database"
import EssentialPhoneDataModel from "../../types/contact/api/EssentialPhoneDataModel"
import EssentialContactEntity from "../../types/contact/database/EssentialContactEntity"
import EssentialPhoneEntity from "../../types/contact/database/EssentialPhoneEntity"
import PermissionEnum from "../../types/enum/PermissionEnum"
import Utils from "../../utils/Utils"
import AutoSynchronizableService from "../sync/AutoSynchronizableService"
import SynchronizableService from "../sync/SynchronizableService"
import WebSocketTopicPathService from "../websocket/path/WebSocketTopicPathService"
import EssentialContactService from "./EssentialContactService"

class EssentialPhoneService extends AutoSynchronizableService<
	number,
	EssentialPhoneDataModel,
	EssentialPhoneEntity
> {
    constructor() {
		super(
			Database.essentialPhone,
			APIHTTPPathsConstants.ESSENTIAL_PHONE,
			WebSocketTopicPathService,
			APIWebSocketPathsConstants.ESSENTIAL_PHONE,
		)
	}
    
    getSyncDependencies(): SynchronizableService[] {
		return [EssentialContactService]
	}

	getSyncNecessaryPermissions(): PermissionEnum[] {
		return []
	}

    async convertModelToEntity(model: EssentialPhoneDataModel): Promise<EssentialPhoneEntity | undefined> {
        const entity: EssentialPhoneEntity = {
			number: model.number,
			type: model.type,
		}

        const essentialContactId = model.essentialContactId
		if (Utils.isNotEmpty(essentialContactId)) {
			const essentialContact = await EssentialContactService.getById(essentialContactId!)
			entity.localEssentialContactId = essentialContact?.localId
		}

		return entity
    }
    
    async convertEntityToModel(entity: EssentialPhoneEntity): Promise<EssentialPhoneDataModel | undefined> {
        const model: EssentialPhoneDataModel = {
			number: entity.number,
			type: entity.type
		}

		const localEssentialContactId = entity.localEssentialContactId

		if (Utils.isNotEmpty(localEssentialContactId)) {
			const essentialContact = await EssentialContactService.getByLocalId(localEssentialContactId!)
			model.essentialContactId = essentialContact?.id

			return model
		}
    }

	async getAllByEssentialContactLocalId(
		localEssentialContactId: number,
	): Promise<EssentialPhoneEntity[]> {
		return this.table
			.where('localEssentialContactId')
			.equals(localEssentialContactId)
			.toArray()
	}

    filterByEssentialContact(eContact: EssentialContactEntity, ePhones: EssentialPhoneEntity[]) {
        if (eContact.localId) {
			return ePhones.filter(ePhone => ePhone.localEssentialContactId === eContact.localId)
		}
    }
}

export default new EssentialPhoneService()