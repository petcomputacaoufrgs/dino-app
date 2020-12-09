import { IndexableType } from 'dexie'
import SynchronizableIdModel from '../api/SynchronizableIdModel'
import SynchronizableLocalState from './SynchronizableLocalState'

/**
 * Base with attributes for local synchronizable entity
 * @param ID entity's api id
 * @param LOCAL_ID entity's local id
 */
export default interface SynchronizableEntity<
  ID extends IndexableType,
  LOCAL_ID extends IndexableType
> extends SynchronizableIdModel<ID> {
  localId?: LOCAL_ID
  localState?: SynchronizableLocalState
  lastUpdate?: Date
}
