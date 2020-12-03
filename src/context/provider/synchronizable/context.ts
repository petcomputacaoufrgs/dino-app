import { IndexableType } from 'dexie'
import SynchronizableDataModel from '../../../types/synchronizable/api/SynchronizableDataModel'
import SynchronizableEntity from '../../../types/synchronizable/database/SynchronizableEntity'
import SynchronizableService from '../../../services/synchronizable/SynchronizableService'
import SynchronizableRepository from '../../../storage/database/synchronizable/SynchronizableRepository'

export default interface SynchronizableContextType<
  ID extends IndexableType,
  LOCAL_ID extends IndexableType,
  DATA_MODEL extends SynchronizableDataModel<ID>,
  ENTITY extends SynchronizableEntity<ID, LOCAL_ID>,
  REPOSITORY extends SynchronizableRepository<ID, LOCAL_ID, ENTITY>
> {
  data: ENTITY[]
  loading: boolean
  service?: SynchronizableService<ID, LOCAL_ID, DATA_MODEL, ENTITY, REPOSITORY>
}
