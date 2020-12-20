import React, { createContext, useContext } from "react"
import SynchronizableContextType from "../synchronizable/context"
import FaqDataModel from '../../../types/faq/api/FaqDataModel'
import FaqEntity from '../../../types/faq/database/FaqEntity'
import { FaqRepositoryImpl } from '../../../storage/database/faq/FaqRepository'
import FaqService, { FaqServiceImpl } from '../../../services/faq/FaqService'
import SynchronizableProvider from "../synchronizable"

export interface FaqContextType
  extends SynchronizableContextType<
    number,
    number,
    FaqDataModel,
    FaqEntity,
    FaqRepositoryImpl,
    FaqServiceImpl
  > {}

const FaqContext = createContext<FaqContextType>({
  service: FaqService,
  loading: true,
  data: [],
})

const FaqProvider: React.FC = ({ children }): JSX.Element =>
  SynchronizableProvider<
    number,
    number,
    FaqDataModel,
    FaqEntity,
    FaqRepositoryImpl,
    FaqServiceImpl
  >({
    children: children,
    context: FaqContext,
    service: FaqService,
  })

export const useFaq = () => useContext(FaqContext)

export default FaqProvider
