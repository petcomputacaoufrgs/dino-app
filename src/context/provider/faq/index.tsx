import React, { createContext, useContext } from 'react'
import SynchronizableContextType from '../synchronizable/context'
import FaqDataModel from '../../../types/faq/api/FaqDataModel'
import FaqEntity from '../../../types/faq/database/FaqEntity'
import FaqService, { FaqServiceImpl } from '../../../services/faq/FaqService'
import SynchronizableProvider from '../synchronizable'

interface FaqContextType
  extends SynchronizableContextType<
    number,
    FaqDataModel,
    FaqEntity,
    FaqServiceImpl
  > {}

const FaqContext = createContext<FaqContextType>({
  service: FaqService,
  loading: true,
  data: [],
})

const FaqProvider: React.FC = ({ children }) =>
  SynchronizableProvider<
    number,
    FaqDataModel,
    FaqEntity,
    FaqServiceImpl
  >({
    children: children,
    context: FaqContext,
    service: FaqService,
  })

export const useFaq = () => useContext(FaqContext)

export default FaqProvider
