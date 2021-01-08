import SynchronizableDataLocalIdModel from '../SynchronizableDataLocalIdModel'
import SynchronizableDeleteModel from './SynchronizableDeleteModel'

export default interface SynchronizableSyncModel<
  ID,
  DATA_MODEL extends SynchronizableDataLocalIdModel<ID>
> {
  save: Array<DATA_MODEL>
  delete: Array<SynchronizableDeleteModel<ID>>
}
