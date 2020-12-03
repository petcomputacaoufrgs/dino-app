import { IndexableType } from 'dexie'
import SynchronizableDataModel from '../api/SynchronizableDataModel'
import SynchronizableLocalState from './SynchronizableLocalState'

/**
 * Base with attributes for local synchronizable entity
 */
export default interface SynchronizableEntity<
  ID extends IndexableType,
  LOCAL_ID extends IndexableType
> extends SynchronizableDataModel<ID> {
  localId?: LOCAL_ID
  localState: SynchronizableLocalState
}
