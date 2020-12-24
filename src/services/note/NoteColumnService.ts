import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import NoteColumnRepository, {
  NoteColumnRepositoryImpl,
} from '../../storage/database/note/NoteColumnRepository'
import NoteColumnDataModel from '../../types/note/api/NoteColumnDataModel'
import NoteColumnEntity from '../../types/note/database/NoteColumnEntity'
import NoteEntity from '../../types/note/database/NoteEntity'
import NoteView from '../../types/note/view/NoteView'
import SynchronizableService from '../synchronizable/SynchronizableService'
import NoteService from './NoteService'

export class NoteColumnServiceImpl extends SynchronizableService<
  number,
  number,
  NoteColumnDataModel,
  NoteColumnEntity,
  NoteColumnRepositoryImpl
> {
  async convertModelToEntity(
    model: NoteColumnDataModel
  ): Promise<NoteColumnEntity> {
    const entity: NoteColumnEntity = {
      order: model.order,
      title: model.title,
    }

    return entity
  }

  async convertEntityToModel(
    entity: NoteColumnEntity
  ): Promise<NoteColumnDataModel> {
    const model: NoteColumnDataModel = {
      order: entity.order,
      title: entity.title,
    }

    return model
  }

  hasNotesInColumn(notes: NoteEntity[], column: NoteColumnEntity) {
    return notes.some((note) => note.columnLocalId === column.localId)
  }

  getNotesInColumn(notes: NoteEntity[], column: NoteColumnEntity) {
    return notes.filter((note) => note.columnLocalId === column.localId)
  }

  getColumnsByFilter(
    notes: NoteEntity[],
    columns: NoteColumnEntity[],
    tagsSearch: string[],
    textSearch: string
  ): NoteView[] {
    const filteredColumns: NoteView[] = []
    const activeTagsSearch = tagsSearch.length > 0
    const activeTextSearch = textSearch !== undefined && textSearch.length !== 0
    const showAllColumns = !activeTagsSearch && !activeTextSearch

    columns
      .sort((c1, c2) => c1.order - c2.order)
      .forEach((column) => {
        const filteredNotes = NoteService.getNotesInColumnByFilter(
          notes,
          column,
          tagsSearch,
          textSearch,
          activeTagsSearch,
          activeTextSearch
        )

        if (filteredNotes.length > 0 || showAllColumns) {
          filteredColumns.push({
            column: column,
            notes: filteredNotes.sort((n1, n2) => n1.order - n2.order),
          })
        }
      })

    return filteredColumns
  }
}

export default new NoteColumnServiceImpl(
  NoteColumnRepository,
  APIRequestMappingConstants.NOTE_COLUMN,
  APIWebSocketDestConstants.NOTE_COLUMN_UPDATE,
  APIWebSocketDestConstants.NOTE_COLUMN_DELETE
)
