import APIRequestMappingConstants from "../../constants/api/APIRequestMappingConstants"
import APIWebSocketDestConstants from "../../constants/api/APIWebSocketDestConstants"
import NoteConstants from "../../constants/note/NoteConstants"
import NoteRepository, { NoteRepositoryImpl } from "../../storage/database/note/NoteRepository"
import NoteDataModel from "../../types/note/api/NoteDataModel"
import NoteColumnEntity from "../../types/note/database/NoteColumnEntity"
import NoteEntity from "../../types/note/database/NoteEntity"
import ArrayUtils from "../../utils/ArrayUtils"
import SynchronizableService from "../synchronizable/SynchronizableService"
import NoteColumnService from "./NoteColumnService"

export class NoteServiceImpl extends SynchronizableService<
  number,
  number,
  NoteDataModel,
  NoteEntity,
  NoteRepositoryImpl
> {
  async convertModelToEntity(model: NoteDataModel): Promise<NoteEntity | undefined> {
    const noteColumn = await NoteColumnService.getLocalColumnByColumnId(model.columnId)
    if (noteColumn) {
      const entity: NoteEntity = {
        answer: model.answer,
        columnId: model.columnId,
        order: model.order,
        question: model.question,
        tags: model.tags === "" ? [] : model.tags.split(NoteConstants.TAG_SEPARATOR),
        localColumnId: noteColumn.localId
      }
  
      return entity
    }

    return undefined
  }

  async convertEntityToModel(entity: NoteEntity): Promise<NoteDataModel | undefined> {
    if (entity.columnId) {
      const model: NoteDataModel = {
        answer: entity.answer,
        columnId: entity.columnId,
        order: entity.order,
        question: entity.question,
        tags: entity.tags.join(NoteConstants.TAG_SEPARATOR)
      }
  
      return model
    }

    return undefined
  }

  getAllTags(notes: NoteEntity[]): string[] {
    const tags: string[] = []
    notes.forEach(item => tags.push(...item.tags))
    return ArrayUtils.removeRepeatedValues(tags)
  }

  getNotesInColumnByFilter(notes: NoteEntity[], column: NoteColumnEntity, tagsSearch: string[], textSearch: string, activeTagsSearch: boolean, activeTextSearch: boolean) {
    return notes.filter(note => {
      if (note.localColumnId !== column.localId) {
        return false
      }

      let valid = true

      if (activeTagsSearch) {
        const inSearch = note.tags.some(tag => tagsSearch.some(tagSearch => tagSearch === tag))
        valid = inSearch
      }

      if (!valid && activeTextSearch) {
        const inSearch = note.question.includes(textSearch)
        valid = inSearch
      }

      return valid
    })
  } 

  async deleteNotesByColumn(column: NoteColumnEntity) {
    const notes = await this.getAllByColumn(column)
    await this.deleteAll(notes)
  }

  private async getAllByColumn(column: NoteColumnEntity): Promise<NoteEntity[]> {
    return this.repository.getAllByColumn(column)
  }
}

export default new NoteServiceImpl(
  NoteRepository,
  APIRequestMappingConstants.NOTE,
  APIWebSocketDestConstants.NOTE_UPDATE,
  APIWebSocketDestConstants.NOTE_DELETE
)
