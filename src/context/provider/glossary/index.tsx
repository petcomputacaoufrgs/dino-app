import React, { createContext, useContext } from 'react'
import GlossaryItemDataModel from '../../../types/glossary/api/GlossaryItemModel'
import GlossaryItemEntity from '../../../types/glossary/database/GlossaryItemEntity'
import SynchronizableContextType from '../synchronizable/context'
import SynchronizableProvider from '../synchronizable'
import GlossaryService from '../../../services/glossary/GlossaryService'
import { GlossaryRepositoryImpl } from '../../../storage/database/glossary/GlossaryRepository'

export interface GlossaryContextType
  extends SynchronizableContextType<
    number,
    number,
    GlossaryItemDataModel,
    GlossaryItemEntity,
    GlossaryRepositoryImpl
  > {}

const GlossaryContext = createContext<GlossaryContextType>({
  service: GlossaryService,
  loading: true,
  data: [],
})

const GlossaryProvider: React.FC = ({ children }): JSX.Element =>
  SynchronizableProvider<
    number,
    number,
    GlossaryItemDataModel,
    GlossaryItemEntity,
    GlossaryRepositoryImpl
  >({
    children: children,
    context: GlossaryContext,
    service: GlossaryService,
  })

export const useGlossary = () => useContext(GlossaryContext)

export default GlossaryProvider
