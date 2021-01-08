import SynchronizableDataLocalIdModel from '../SynchronizableDataLocalIdModel'

export interface SynchronizableSaveAllResponseModel<
  ID,
  DATA_MODEL extends SynchronizableDataLocalIdModel<ID>
> {
  data: Array<DATA_MODEL>

  success: boolean

  error: string
}