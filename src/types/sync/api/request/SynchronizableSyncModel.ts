import SynchronizableDataLocalIdModel from '../SynchronizableDataLocalIdModel'

export default interface SynchronizableSyncModel<
  ID,
  DATA_MODEL extends SynchronizableDataLocalIdModel<ID>
> {
  save: Array<DATA_MODEL>
}
