import APIRequestMappingConstants from "../../constants/api/APIRequestMappingConstants";
import APIWebSocketDestConstants from "../../constants/api/APIWebSocketDestConstants";
import { KidsSpaceSettingsModel } from "../../types/kids_space/api/KidsSpaceSettingsModel";
import { KidsSpaceSettingsEntity } from "../../types/kids_space/database/KidsSpaceSettingsEntity";
import AutoSynchronizableService from "../sync/AutoSynchronizableService";
import SynchronizableService from "../sync/SynchronizableService";
import UserService from "../user/UserService";
import WebSocketQueuePathService from "../websocket/path/WebSocketQueuePathService";
import Database from "../../storage/Database";

class KidsSpaceSettingsServiceImpl extends AutoSynchronizableService<
    number,
    KidsSpaceSettingsModel,
    KidsSpaceSettingsEntity
> {
    constructor() {
        super(
			Database.kidsSpaceSettings,
			APIRequestMappingConstants.KIDS_SPACE_SETTINGS,
			WebSocketQueuePathService,
			APIWebSocketDestConstants.KIDS_SPACE_SETTINGS,
		)
    }
    
    getSyncDependencies(): SynchronizableService[] {
		return [UserService]
	}

    async convertModelToEntity(model: KidsSpaceSettingsModel): Promise<KidsSpaceSettingsEntity | undefined> {
        const entity: KidsSpaceSettingsEntity = {
            color: model.color,
            firstSettingsDone: model.firstSettingsDone
        }
        
        return entity
    }

    async convertEntityToModel(entity: KidsSpaceSettingsEntity): Promise<KidsSpaceSettingsModel | undefined> {
        const model: KidsSpaceSettingsModel = {
            color: entity.color,
            firstSettingsDone: entity.firstSettingsDone
        } 

        return model
    }
}

export default new KidsSpaceSettingsServiceImpl()