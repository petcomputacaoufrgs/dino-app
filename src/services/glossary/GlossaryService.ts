import GlossaryItemModel from '../../types/glossary/api/GlossaryItemModel'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import SynchronizableService from '../synchronizable/SynchronizableService'
import GlossaryItemDataModel from '../../types/glossary/api/GlossaryItemModel'
import GlossaryItemEntity from '../../types/glossary/database/GlossaryItemEntity'
import GlossaryRepository, { GlossaryRepositoryImpl } from '../../storage/database/glossary/GlossaryRepository'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'

class GlossaryService extends SynchronizableService<number, number, GlossaryItemDataModel, GlossaryItemEntity, GlossaryRepositoryImpl> {
    convertModelToEntity(model: GlossaryItemModel): GlossaryItemEntity {
        const entity: GlossaryItemEntity = {
            title: model.title,
            fullText: model.fullText,
            subtitle: model.subtitle,
            text: model.text,
        }

        return entity
    }

    convertEntityToModel(entity: GlossaryItemEntity): GlossaryItemModel {
        const model: GlossaryItemModel = {
            title: entity.title,
            fullText: entity.fullText,
            subtitle: entity.subtitle,
            text: entity.text,
        }
        
        return model
    }
}

export default new GlossaryService(
    GlossaryRepository, 
    APIRequestMappingConstants.GLOSSARY,
    APIWebSocketDestConstants.GLOSSARY_UPDATE,
    APIWebSocketDestConstants.GLOSSARY_DELETE)
