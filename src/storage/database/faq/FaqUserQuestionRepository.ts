import SynchronizableRepository from '../synchronizable/SynchronizableRepository'
import FaqUserQuestionEntity from '../../../types/faq/database/FaqUserQuestionEntity'
import Database from '../Database'

export class FaqUserQuestionRepositoryImpl extends SynchronizableRepository<
  number,
  FaqUserQuestionEntity
> {
  constructor() {
    super(Database.faqUserQuestion)
  }
}

export default new FaqUserQuestionRepositoryImpl()
