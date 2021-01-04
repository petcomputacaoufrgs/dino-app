import React, { createContext, useContext } from 'react'
import GlossaryItemDataModel from '../../../types/glossary/api/GlossaryItemDataModel'
import GlossaryItemEntity from '../../../types/glossary/database/GlossaryItemEntity'
import SynchronizableContextType from '../synchronizable/context'
import SynchronizableProvider from '../synchronizable'
import GlossaryService, {
  GlossaryServiceImpl,
} from '../../../services/glossary/GlossaryService'
import { GlossaryRepositoryImpl } from '../../../storage/database/glossary/GlossaryRepository'

interface GlossaryContextType
  extends SynchronizableContextType<
    number,
    GlossaryItemDataModel,
    GlossaryItemEntity,
    GlossaryRepositoryImpl,
    GlossaryServiceImpl
  > {}

const GlossaryContext = createContext<GlossaryContextType>({
  service: GlossaryService,
  loading: true,
  data: [],
})

const GlossaryProvider: React.FC = ({ children }) =>
  SynchronizableProvider<
    number,
    GlossaryItemDataModel,
    GlossaryItemEntity,
    GlossaryRepositoryImpl,
    GlossaryServiceImpl
  >({
    children: children,
    context: GlossaryContext,
    service: GlossaryService,
  })

export const useGlossary = () => useContext(GlossaryContext)

export default GlossaryProvider
