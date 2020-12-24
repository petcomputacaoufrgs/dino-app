import SynchronizableRepository from '../synchronizable/SynchronizableRepository'
import FaqUserQuestionEntity from '../../../types/faq/database/FaqUserQuestionEntity'
import Database from '../Database'

export class FaqUserQuestionRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  FaqUserQuestionEntity
> {}

export default new FaqUserQuestionRepositoryImpl(Database.faqUserQuestion)
