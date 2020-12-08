import APIRequestMappingConstants from "../../constants/api/APIRequestMappingConstants"
import APIWebSocketDestConstants from "../../constants/api/APIWebSocketDestConstants"
import NoteColumnRepository, { NoteColumnRepositoryImpl } from "../../storage/database/note/NoteColumnRepository"
import NoteColumnDataModel from "../../types/note/api/NoteColumnDataModel"
import NoteColumnEntity from "../../types/note/database/NoteColumnEntity"
import NoteEntity from "../../types/note/database/NoteEntity"
import NoteView from "../../types/note/view/NoteView"
import SynchronizableService from "../synchronizable/SynchronizableService"
import NoteService from "./NoteService"

export class NoteColumnServiceImpl extends SynchronizableService<
  number,
  number,
  NoteColumnDataModel,
  NoteColumnEntity,
  NoteColumnRepositoryImpl
> {
  async convertModelToEntity(model: NoteColumnDataModel): Promise<NoteColumnEntity> {
    const entity: NoteColumnEntity = {
      order: model.order,
      title: model.title
    }

    return entity
  }

  async convertEntityToModel(entity: NoteColumnEntity): Promise<NoteColumnDataModel> {
    const model: NoteColumnDataModel = {
      order: entity.order,
      title: entity.title
    }

    return model
  }

  async getLocalColumnIdByColumnId(columnId: number): Promise<NoteColumnEntity | undefined> {
    return this.repository.getLocalColumnIdByColumnId(columnId)
  }

  hasNotesInColumn(notes: NoteEntity[], column: NoteColumnEntity) {
    return notes.some(note => note.localColumnId === column.localId)
  } 

  getNotesInColumn(notes: NoteEntity[], column: NoteColumnEntity) {
    return notes.filter(note => note.localColumnId === column.localId)
  } 

  private getNotesInColumnByFilter(notes: NoteEntity[], column: NoteColumnEntity, tagsSearch: string[], textSearch: string) {
    const activeTagsSearch = tagsSearch.length > 0
    const activeTextSearch = textSearch && textSearch.length !== 0

    return notes.filter(note => {
      let valid = true

      if (activeTagsSearch) {
        const tags = NoteService.getTags(note)
        const inSearch = tags.some(tag => tagsSearch.some(tagSearch => tagSearch === tag))
        valid = inSearch
      }

      if (!valid && activeTextSearch) {
        const inSearch = note.question.includes(textSearch)
        valid = inSearch
      }

      return valid
    })
  } 

  getColumnsByFilter(notes: NoteEntity[], columns: NoteColumnEntity[], tagsSearch: string[], textSearch: string): NoteView[] {
    const filteredColumns: NoteView[] = [] 
    columns.forEach(column => {
      const filteredNotes = this.getNotesInColumnByFilter(notes, column, tagsSearch, textSearch)

      if (filteredNotes.length > 0) {
        filteredColumns.push({
          column: column,
          notes: filteredNotes
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