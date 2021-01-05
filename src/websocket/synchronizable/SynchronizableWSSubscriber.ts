import { IndexableType } from 'dexie'
import BaseWebSocketSubscriber from '../BaseWebSocketSubscriber'
import SubscriberItem from '../../types/web_socket/SubscriberItem'
import SynchronizableDataModel from '../../types/synchronizable/api/SynchronizableDataModel'
import SynchronizableEntity from '../../types/synchronizable/database/SynchronizableEntity'
import SynchronizableRepository from '../../storage/database/synchronizable/SynchronizableRepository'
import AutoSynchronizableService from '../../services/sync/AutoSynchronizableService'
import SynchronizableWSUpdateModel from '../../types/synchronizable/api/web_socket/SynchronizableWSUpdateModel'
import SynchronizableWSDeleteModel from '../../types/synchronizable/api/web_socket/SynchronizableWSDeleteModel'
import SynchronizableWSSubscriberQueue from './SynchronizableWSSubscriberQueue'

export default abstract class SynchronizableWSSubscriber<
  ID extends IndexableType,
  DATA_MODEL extends SynchronizableDataModel<ID>,
  ENTITY extends SynchronizableEntity<ID>,
  REPOSITORY extends SynchronizableRepository<ID, ENTITY>
> extends BaseWebSocketSubscriber {
  constructor(
    service: AutoSynchronizableService<ID, DATA_MODEL, ENTITY, REPOSITORY>
  ) {
    const items: SubscriberItem[] = [
      {
        path: service.getUpdateWebSocketPath(),
        callback: (model: SynchronizableWSUpdateModel<ID, DATA_MODEL>) => {
          SynchronizableWSSubscriberQueue.addItem(
            service.webSocketUpdate,
            model
          )
        },
      },
      {
        path: service.getDeleteWebSocketPath(),
        callback: (model: SynchronizableWSDeleteModel<ID>) => {
          SynchronizableWSSubscriberQueue.addItem(service.webSockeDelete, model)
        },
      },
    ]

    super(items)
  }
}