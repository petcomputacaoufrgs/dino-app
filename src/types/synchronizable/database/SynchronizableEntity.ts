import { IndexableType } from 'dexie'
import SynchronizableIdModel from '../api/SynchronizableIdModel'
import SynchronizableLocalState from './SynchronizableLocalState'

/**
 * Base with attributes for local synchronizable entity
 * @param ID entity's api id
 */
export default interface SynchronizableEntity<
  ID extends IndexableType,
> extends SynchronizableIdModel<ID> {
  localId?: number
  localState?: SynchronizableLocalState
  lastUpdate?: Date
}
