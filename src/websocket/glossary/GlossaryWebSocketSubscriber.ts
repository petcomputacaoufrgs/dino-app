import GlossaryService from '../../services/glossary/GlossaryService'
import SynchronizableWSSubscriber from '../synchronizable/SynchronizableWSSubscriber'
import GlossaryItemDataModel from '../../types/glossary/api/GlossaryItemDataModel'
import GlossaryItemEntity from '../../types/glossary/database/GlossaryItemEntity'
import { GlossaryRepositoryImpl } from '../../storage/database/glossary/GlossaryRepository'

class GlossaryWebSocketSubscriber extends SynchronizableWSSubscriber<
  number,
  number,
  GlossaryItemDataModel,
  GlossaryItemEntity,
  GlossaryRepositoryImpl
> {
  constructor() {
    super(GlossaryService)
  }
}

export default new GlossaryWebSocketSubscriber()
