import SynchronizableDataLocalIdModel from "../SynchronizableDataLocalIdModel"

export interface SynchronizableSyncResponseModel<
    ID,
    LOCAL_ID,
    DATA_MODEL extends SynchronizableDataLocalIdModel<ID, LOCAL_ID>
> {
    save: Array<DATA_MODEL>

    delete: Array<ID>

    success: boolean

    error: string
}