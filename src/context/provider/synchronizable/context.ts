import { IndexableType, IndexableTypePart } from 'dexie'
import SynchronizableEntity from '../../../types/synchronizable/database/SynchronizableEntity'
import AutoSynchronizableService from '../../../services/sync/AutoSynchronizableService'
import SynchronizableRepository from '../../../storage/database/synchronizable/SynchronizableRepository'
import SynchronizableDataLocalIdModel from '../../../types/synchronizable/api/SynchronizableDataLocalIdModel'

export default interface SynchronizableContextType<
  ID extends IndexableType,
  DATA_MODEL extends SynchronizableDataLocalIdModel<ID>,
  ENTITY extends SynchronizableEntity<ID>,
  REPOSITORY extends SynchronizableRepository<ID, ENTITY>,
  SERVICE extends AutoSynchronizableService<
    ID,
    DATA_MODEL,
    ENTITY,
    REPOSITORY
  >
> {
  data: ENTITY[]
  first?: ENTITY
  loading: boolean
  service: SERVICE
}
