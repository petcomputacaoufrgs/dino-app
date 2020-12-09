import SynchronizableIdModel from './SynchronizableIdModel'

export default interface SynchronizableModel<ID>
  extends SynchronizableIdModel<ID> {
  lastUpdate?: string
}
