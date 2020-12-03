import SynchronizableDataModel from '../SynchronizableDataModel'
import SynchronizableGenericModel from './SynchronizableGenericListModel'

export default interface SynchronizableSaveAllModel<
  ID,
  DATA_MODEL extends SynchronizableDataModel<ID>
> extends SynchronizableGenericModel<ID, DATA_MODEL> {}
