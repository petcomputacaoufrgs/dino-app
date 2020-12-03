import SynchronizableService from '../../../services/synchronizable/SynchronizableService'
import { IndexableType } from 'dexie'
import SynchronizableDataModel from '../../../types/synchronizable/api/SynchronizableDataModel'
import SynchronizableEntity from '../../../types/synchronizable/database/SynchronizableEntity'
import SynchronizableRepository from '../../../storage/database/synchronizable/SynchronizableRepository'
import SynchronizableContextType from './context'

export default interface SynchronizableProviderProps<
  ID extends IndexableType,
  LOCAL_ID extends IndexableType,
  DATA_MODEL extends SynchronizableDataModel<ID>,
  ENTITY extends SynchronizableEntity<ID, LOCAL_ID>,
  REPOSITORY extends SynchronizableRepository<ID, LOCAL_ID, ENTITY>
> extends React.PropsWithChildren<{}> {
  context: React.Context<
    SynchronizableContextType<ID, LOCAL_ID, DATA_MODEL, ENTITY, REPOSITORY>
  >
  service: SynchronizableService<ID, LOCAL_ID, DATA_MODEL, ENTITY, REPOSITORY>
}
