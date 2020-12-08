import React, { createContext, useContext } from 'react'
import NoteService, { NoteServiceImpl } from '../../../services/note/NoteService'
import { NoteRepositoryImpl } from '../../../storage/database/note/NoteRepository'
import NoteDataModel from '../../../types/note/api/NoteDataModel'
import NoteEntity from '../../../types/note/database/NoteEntity'
import SynchronizableProvider from '../synchronizable'
import SynchronizableContextType from '../synchronizable/context'

export interface NoteContextType
  extends SynchronizableContextType<
    number,
    number,
    NoteDataModel,
    NoteEntity,
    NoteRepositoryImpl,
    NoteServiceImpl
  > {}

const NoteContext = createContext<NoteContextType>({
  service: NoteService,
  loading: true,
  data: [],
})

const NoteProvider: React.FC = ({ children }): JSX.Element =>
  SynchronizableProvider<
    number,
    number,
    NoteDataModel,
    NoteEntity,
    NoteRepositoryImpl,
    NoteServiceImpl
  >({
    children: children,
    context: NoteContext,
    service: NoteService,
  })

export const useNote = () => useContext(NoteContext)

export default NoteProvider
