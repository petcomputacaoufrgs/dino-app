import React, { createContext, useContext } from 'react'
import NoteColumnService, {
  NoteColumnServiceImpl,
} from '../../../services/note/NoteColumnService'
import { NoteColumnRepositoryImpl } from '../../../storage/database/note/NoteColumnRepository'
import NoteColumnDataModel from '../../../types/note/api/NoteColumnDataModel'
import NoteColumnEntity from '../../../types/note/database/NoteColumnEntity'
import SynchronizableProvider from '../synchronizable'
import SynchronizableContextType from '../synchronizable/context'

export interface NoteColumnContextType
  extends SynchronizableContextType<
    number,
    number,
    NoteColumnDataModel,
    NoteColumnEntity,
    NoteColumnRepositoryImpl,
    NoteColumnServiceImpl
  > {}

const NoteColumnContext = createContext<NoteColumnContextType>({
  service: NoteColumnService,
  loading: true,
  data: [],
})

const NoteColumnProvider: React.FC = ({ children }) =>
  SynchronizableProvider<
    number,
    number,
    NoteColumnDataModel,
    NoteColumnEntity,
    NoteColumnRepositoryImpl,
    NoteColumnServiceImpl
  >({
    children: children,
    context: NoteColumnContext,
    service: NoteColumnService,
  })

export const useNoteColumn = () => useContext(NoteColumnContext)

export default NoteColumnProvider
