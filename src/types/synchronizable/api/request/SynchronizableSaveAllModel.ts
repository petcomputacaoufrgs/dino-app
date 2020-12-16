import SynchronizableDataLocalIdModel from '../SynchronizableDataLocalIdModel'
import SynchronizableGenericModel from './SynchronizableGenericListModel'

export default interface SynchronizableSaveAllModel<
  ID,
  LOCAL_ID,
  DATA_MODEL extends SynchronizableDataLocalIdModel<ID, LOCAL_ID>
> extends SynchronizableGenericModel<ID, DATA_MODEL> {}
