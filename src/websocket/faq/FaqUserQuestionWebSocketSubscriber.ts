import SynchronizableWSSubscriber from "../synchronizable/SynchronizableWSSubscriber"
import FaqUserQuestionDataModel from '../../types/faq/api/FaqUserQuestionDataModel'
import FaqUserQuestionEntity from '../../types/faq/database/FaqUserQuestionEntity'
import { FaqUserQuestionRepositoryImpl } from '../../storage/database/faq/FaqUserQuestionRepository'
import FaqUserQuestionService from "../../services/faq/FaqUserQuestionService"

class FaqUserQuestionWebSocketSubscriber extends SynchronizableWSSubscriber<
number,
number,
FaqUserQuestionDataModel,
FaqUserQuestionEntity,
FaqUserQuestionRepositoryImpl
> {
    constructor() {
    super(FaqUserQuestionService)
    }
}

export default new FaqUserQuestionWebSocketSubscriber()