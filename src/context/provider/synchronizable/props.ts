import AutoSynchronizableService from '../../../services/sync/AutoSynchronizableService'
import { IndexableType } from 'dexie'
import SynchronizableDataLocalIdModel from '../../../types/synchronizable/api/SynchronizableDataLocalIdModel'
import SynchronizableEntity from '../../../types/synchronizable/database/SynchronizableEntity'
import SynchronizableRepository from '../../../storage/database/synchronizable/SynchronizableRepository'
import SynchronizableContextType from './context'

export default interface SynchronizableProviderProps<
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
> extends React.PropsWithChildren<{}> {
  context: React.Context<
    SynchronizableContextType<
      ID,
      DATA_MODEL,
      ENTITY,
      REPOSITORY,
      SERVICE
    >
  >
  service: SERVICE
}
