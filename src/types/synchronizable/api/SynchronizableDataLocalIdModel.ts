import SynchronizableDataModel from "./SynchronizableDataModel"

export default interface SynchronizableDataLocalIdModel<ID, LOCAL_ID> extends SynchronizableDataModel<ID> {
    localId: LOCAL_ID
}