import BaseSync from "../BaseSync"
import SynchronizableService from "../../services/synchronizable/SynchronizableService"
import { IndexableType, IndexableTypePart } from "dexie"
import SynchronizableDataModel from "../../types/synchronizable/api/SynchronizableDataModel"
import SynchronizableEntity from "../../types/synchronizable/database/SynchronizableEntity"
import SynchronizableRepository from "../../storage/database/synchronizable/SynchronizableRepository"

export default abstract class SynchronizableSync<
    ID extends IndexableType,
    LOCAL_ID extends IndexableTypePart,
    DATA_MODEL extends SynchronizableDataModel<ID>,
    ENTITY extends SynchronizableEntity<ID, LOCAL_ID>,
    REPOSITORY extends SynchronizableRepository<ID, LOCAL_ID, ENTITY>> implements BaseSync {

    protected service: SynchronizableService<ID, LOCAL_ID, DATA_MODEL, ENTITY, REPOSITORY>

    constructor(service: SynchronizableService<ID, LOCAL_ID, DATA_MODEL, ENTITY, REPOSITORY>) {
        this.service = service
    }

    sync = async () => {
        await this.service.sync()
    }
}