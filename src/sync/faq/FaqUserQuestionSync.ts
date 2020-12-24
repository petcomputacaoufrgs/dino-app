import SynchronizableSync from '../synchronizable/SynchronizableSync'
import FaqUserQuestionEntity from '../../types/faq/database/FaqUserQuestionEntity'
import FaqUserQuestionDataModel from '../../types/faq/api/FaqUserQuestionDataModel'
import { FaqUserQuestionRepositoryImpl } from '../../storage/database/faq/FaqUserQuestionRepository'
import FaqUserQuestionService from '../../services/faq/FaqUserQuestionService'

class FaqUserQuestionSync extends SynchronizableSync<
  number,
  number,
  FaqUserQuestionDataModel,
  FaqUserQuestionEntity,
  FaqUserQuestionRepositoryImpl
> {}

export default new FaqUserQuestionSync(FaqUserQuestionService)
