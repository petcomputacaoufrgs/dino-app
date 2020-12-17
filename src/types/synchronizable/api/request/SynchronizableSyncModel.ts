import SynchronizableDataLocalIdModel from "../SynchronizableDataLocalIdModel"
import SynchronizableDeleteModel from "./SynchronizableDeleteModel"

export default interface SynchronizableSyncModel<
    ID,
    LOCAL_ID,
    DATA_MODEL extends SynchronizableDataLocalIdModel<ID, LOCAL_ID>>
{
    save: Array<DATA_MODEL>
    delete: Array<SynchronizableDeleteModel<ID>>
}