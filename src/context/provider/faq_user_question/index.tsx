import React, { createContext, useContext } from 'react'
import SynchronizableContextType from '../synchronizable/context'
import SynchronizableProvider from '../synchronizable'
import FaqUserQuestionDataModel from '../../../types/faq/api/FaqUserQuestionDataModel'
import FaqUserQuestionEntity from '../../../types/faq/database/FaqUserQuestionEntity'
import FaqUserQuestionService, {
  FaqUserQuestionServiceImpl,
} from '../../../services/faq/FaqUserQuestionService'

interface FaqUserQuestionContextType
  extends SynchronizableContextType<
    number,
    FaqUserQuestionDataModel,
    FaqUserQuestionEntity,
    FaqUserQuestionServiceImpl
  > {}

const FaqUserQuestionContext = createContext<FaqUserQuestionContextType>({
  service: FaqUserQuestionService,
  loading: true,
  data: [],
})

const FaqUserQuestionProvider: React.FC = ({ children }) =>
  SynchronizableProvider<
    number,
    FaqUserQuestionDataModel,
    FaqUserQuestionEntity,
    FaqUserQuestionServiceImpl
  >({
    children: children,
    context: FaqUserQuestionContext,
    service: FaqUserQuestionService,
  })

export const useFaqUserQuestion = () => useContext(FaqUserQuestionContext)

export default FaqUserQuestionProvider
