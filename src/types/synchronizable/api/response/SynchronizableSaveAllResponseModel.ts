import SynchronizableDataLocalIdModel from '../SynchronizableDataLocalIdModel'

export interface SynchronizableSaveAllResponseModel<
  ID,
  LOCAL_ID,
  DATA_MODEL extends SynchronizableDataLocalIdModel<ID, LOCAL_ID>
> {
  data: Array<DATA_MODEL>

  success: boolean

  error: string
}
