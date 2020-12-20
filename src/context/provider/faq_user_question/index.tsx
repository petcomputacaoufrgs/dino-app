import React, { createContext, useContext } from "react"
import SynchronizableContextType from "../synchronizable/context"
import SynchronizableProvider from "../synchronizable"
import FaqUserQuestionDataModel from '../../../types/faq/api/FaqUserQuestionDataModel'
import FaqUserQuestionEntity from '../../../types/faq/database/FaqUserQuestionEntity'
import { FaqUserQuestionRepositoryImpl } from '../../../storage/database/faq/FaqUserQuestionRepository'
import FaqUserQuestionService, { FaqUserQuestionServiceImpl } from '../../../services/faq/FaqUserQuestionService'

export interface FaqUserQuestionContextType
  extends SynchronizableContextType<
    number,
    number,
    FaqUserQuestionDataModel,
    FaqUserQuestionEntity,
    FaqUserQuestionRepositoryImpl,
    FaqUserQuestionServiceImpl
  > {}

const FaqUserQuestionContext = createContext<FaqUserQuestionContextType>({
  service: FaqUserQuestionService,
  loading: true,
  data: [],
})

const FaqUserQuestionProvider: React.FC = ({ children }): JSX.Element =>
  SynchronizableProvider<
    number,
    number,
    FaqUserQuestionDataModel,
    FaqUserQuestionEntity,
    FaqUserQuestionRepositoryImpl,
    FaqUserQuestionServiceImpl
  >({
    children: children,
    context: FaqUserQuestionContext,
    service: FaqUserQuestionService,
  })

export const useFaqUserQuestion = () => useContext(FaqUserQuestionContext)

export default FaqUserQuestionProvider
