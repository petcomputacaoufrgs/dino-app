import SynchronizableDataLocalIdModel from "../SynchronizableDataLocalIdModel"

export default interface SynchronizableSyncResponseModel<
    ID,
    LOCAL_ID,
    DATA_MODEL extends SynchronizableDataLocalIdModel<ID, LOCAL_ID>
> {
    data: Array<DATA_MODEL>

    success: boolean

    error: string
}