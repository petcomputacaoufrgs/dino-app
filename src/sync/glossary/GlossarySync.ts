import GlossaryService from '../../services/glossary/GlossaryService'
import GlossaryItemDataModel from '../../types/glossary/api/GlossaryItemModel'
import GlossaryItemEntity from '../../types/glossary/database/GlossaryItemEntity'
import { GlossaryRepositoryImpl } from '../../storage/database/glossary/GlossaryRepository'
import SynchronizableSync from '../synchronizable/SynchronizableSync'

class GlossarySync extends SynchronizableSync<
  number, number, GlossaryItemDataModel, GlossaryItemEntity, GlossaryRepositoryImpl
> {}

export default new GlossarySync(GlossaryService)
