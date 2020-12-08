import GlossaryServiceImpl from '../../services/glossary/GlossaryService'
import GlossaryItemDataModel from '../../types/glossary/api/GlossaryItemDataModel'
import GlossaryItemEntity from '../../types/glossary/database/GlossaryItemEntity'
import { GlossaryRepositoryImpl } from '../../storage/database/glossary/GlossaryRepository'
import SynchronizableSync from '../synchronizable/SynchronizableSync'

class GlossarySync extends SynchronizableSync<
  number,
  number,
  GlossaryItemDataModel,
  GlossaryItemEntity,
  GlossaryRepositoryImpl
> {}

export default new GlossarySync(GlossaryServiceImpl)
