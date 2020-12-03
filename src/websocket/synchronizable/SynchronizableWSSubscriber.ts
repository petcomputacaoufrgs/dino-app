import { IndexableType } from 'dexie'
import BaseWebSocketSubscriber from '../BaseWebSocketSubscriber'
import SubscriberItem from '../../types/web_socket/SubscriberItem'
import SynchronizableDataModel from '../../types/synchronizable/api/SynchronizableDataModel'
import SynchronizableEntity from '../../types/synchronizable/database/SynchronizableEntity'
import SynchronizableRepository from '../../storage/database/synchronizable/SynchronizableRepository'
import SynchronizableService from '../../services/synchronizable/SynchronizableService'
import SynchronizableWSUpdateModel from '../../types/synchronizable/api/web_socket/SynchronizableWSUpdateModel'
import SynchronizableWSDeleteModel from '../../types/synchronizable/api/web_socket/SynchronizableWSDeleteModel'

export default abstract class SynchronizableWSSubscriber<
  ID extends IndexableType,
  LOCAL_ID extends IndexableType,
  DATA_MODEL extends SynchronizableDataModel<ID>,
  ENTITY extends SynchronizableEntity<ID, LOCAL_ID>,
  REPOSITORY extends SynchronizableRepository<ID, LOCAL_ID, ENTITY>
> extends BaseWebSocketSubscriber {
  constructor(
    service: SynchronizableService<ID, LOCAL_ID, DATA_MODEL, ENTITY, REPOSITORY>
  ) {
    const items: SubscriberItem[] = [
      {
        path: service.getUpdateWebSocketPath(),
        callback: (model: SynchronizableWSUpdateModel<ID, DATA_MODEL>) => {
          service.webSocketUpdate(model)
        },
      },
      {
        path: service.getDeleteWebSocketPath(),
        callback: (model: SynchronizableWSDeleteModel<ID>) => {
          service.webSockeDelete(model)
        },
      },
    ]

    super(items)
  }
}
