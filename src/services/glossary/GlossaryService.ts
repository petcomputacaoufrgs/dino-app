import GlossaryItemModel from '../../types/glossary/api/GlossaryItemDataModel'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import GlossaryItemDataModel from '../../types/glossary/api/GlossaryItemDataModel'
import GlossaryItemEntity from '../../types/glossary/database/GlossaryItemEntity'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketTopicURLService from '../websocket/path/WebSocketTopicPathService'
import Database from '../../storage/database/Database'

export class GlossaryServiceImpl extends AutoSynchronizableService<
  number,
  GlossaryItemDataModel,
  GlossaryItemEntity
> {
  constructor() {
    super(
      Database.glossary,
      APIRequestMappingConstants.GLOSSARY,
      WebSocketTopicURLService,
      APIWebSocketDestConstants.GLOSSARY
    )
  }

  getSyncDependencies(): SynchronizableService[] {
    return []
  }
  
  async convertModelToEntity(
    model: GlossaryItemModel
  ): Promise<GlossaryItemEntity> {
    const entity: GlossaryItemEntity = {
      title: model.title,
      fullText: model.fullText,
      subtitle: model.subtitle,
      text: model.text,
    }

    return entity
  }

  async convertEntityToModel(
    entity: GlossaryItemEntity
  ): Promise<GlossaryItemModel> {
    const model: GlossaryItemModel = {
      title: entity.title,
      fullText: entity.fullText,
      subtitle: entity.subtitle,
      text: entity.text,
    }

    return model
  }
}

export default new GlossaryServiceImpl()