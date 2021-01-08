import SynchronizableDataLocalIdModel from '../SynchronizableDataLocalIdModel'
import SynchronizableGenericModel from './SynchronizableGenericListModel'

export default interface SynchronizableSaveAllModel<
  ID,
  DATA_MODEL extends SynchronizableDataLocalIdModel<ID>
> extends SynchronizableGenericModel<ID, DATA_MODEL> {}
