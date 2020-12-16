import SynchronizableModel from '../SynchronizableModel'
import SynchronizableGetModel from './SynchronizableGetModel'

export default interface SynchronizableDeleteModel<ID>
  extends SynchronizableGetModel<ID>, SynchronizableModel<ID> {}
