import React, { createContext, useContext } from 'react'
import SynchronizableContextType from '../synchronizable/context'
import SynchronizableProvider from '../synchronizable'
import FaqItemDataModel from '../../../types/faq/api/FaqItemDataModel'
import FaqItemEntity from '../../../types/faq/database/FaqItemEntity'
import FaqItemService, {
  FaqItemServiceImpl,
} from '../../../services/faq/FaqItemService'

interface FaqItemContextType
  extends SynchronizableContextType<
    number,
    FaqItemDataModel,
    FaqItemEntity,
    FaqItemServiceImpl
  > {}

const FaqItemContext = createContext<FaqItemContextType>({
  service: FaqItemService,
  loading: true,
  data: [],
})

const FaqItemProvider: React.FC = ({ children }) =>
  SynchronizableProvider<
    number,
    FaqItemDataModel,
    FaqItemEntity,
    FaqItemServiceImpl
  >({
    children: children,
    context: FaqItemContext,
    service: FaqItemService,
  })

export const useFaqItem = () => useContext(FaqItemContext)

export default FaqItemProvider
