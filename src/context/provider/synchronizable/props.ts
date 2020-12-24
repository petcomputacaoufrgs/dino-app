import SynchronizableService from '../../../services/synchronizable/SynchronizableService'
import { IndexableType, IndexableTypePart } from 'dexie'
import SynchronizableDataLocalIdModel from '../../../types/synchronizable/api/SynchronizableDataLocalIdModel'
import SynchronizableEntity from '../../../types/synchronizable/database/SynchronizableEntity'
import SynchronizableRepository from '../../../storage/database/synchronizable/SynchronizableRepository'
import SynchronizableContextType from './context'

export default interface SynchronizableProviderProps<
  ID extends IndexableType,
  LOCAL_ID extends IndexableTypePart,
  DATA_MODEL extends SynchronizableDataLocalIdModel<ID, LOCAL_ID>,
  ENTITY extends SynchronizableEntity<ID, LOCAL_ID>,
  REPOSITORY extends SynchronizableRepository<ID, LOCAL_ID, ENTITY>,
  SERVICE extends SynchronizableService<
    ID,
    LOCAL_ID,
    DATA_MODEL,
    ENTITY,
    REPOSITORY
  >
> extends React.PropsWithChildren<{}> {
  context: React.Context<
    SynchronizableContextType<
      ID,
      LOCAL_ID,
      DATA_MODEL,
      ENTITY,
      REPOSITORY,
      SERVICE
    >
  >
  service: SERVICE
}
