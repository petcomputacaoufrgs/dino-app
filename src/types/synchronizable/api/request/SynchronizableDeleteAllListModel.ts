import SynchronizableGenericListModel from './SynchronizableGenericListModel'
import SynchronizableDeleteModel from './SynchronizableDeleteModel'

export default interface SynchronizableDeleteAllListModel<ID>
  extends SynchronizableGenericListModel<ID, SynchronizableDeleteModel<ID>> {}
