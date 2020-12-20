import React, { createContext, useContext } from "react"
import SynchronizableContextType from "../synchronizable/context"
import SynchronizableProvider from "../synchronizable"
import FaqItemDataModel from '../../../types/faq/api/FaqItemDataModel'
import FaqItemEntity from '../../../types/faq/database/FaqItemEntity'
import { FaqItemRepositoryImpl } from '../../../storage/database/faq/FaqItemRepository'
import FaqItemService, { FaqItemServiceImpl } from '../../../services/faq/FaqItemService'

export interface FaqItemContextType
  extends SynchronizableContextType<
    number,
    number,
    FaqItemDataModel,
    FaqItemEntity,
    FaqItemRepositoryImpl,
    FaqItemServiceImpl
  > {}

const FaqItemContext = createContext<FaqItemContextType>({
  service: FaqItemService,
  loading: true,
  data: [],
})

const FaqItemProvider: React.FC = ({ children }): JSX.Element =>
  SynchronizableProvider<
    number,
    number,
    FaqItemDataModel,
    FaqItemEntity,
    FaqItemRepositoryImpl,
    FaqItemServiceImpl
  >({
    children: children,
    context: FaqItemContext,
    service: FaqItemService,
  })

export const useFaqItem = () => useContext(FaqItemContext)

export default FaqItemProvider
