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
    const noteColumn = await NoteColumnService.getById(model.columnId)
    if (noteColumn) {
      const entity: NoteEntity = {
        answer: model.answer,
        order: model.order,
        question: model.question,
        tags: model.tags === "" ? [] : model.tags.split(NoteConstants.TAG_SEPARATOR),
        columnLocalId: noteColumn.localId
      }
  
      return entity
    }
  }

  async convertEntityToModel(entity: NoteEntity): Promise<NoteDataModel | undefined> {
    if (entity.columnLocalId) {
      const noteColumn = await NoteColumnService.getByLocalId(entity.columnLocalId)

      if (noteColumn && noteColumn.id) {
        const model: NoteDataModel = {
          answer: entity.answer,
          columnId: noteColumn.id,
          order: entity.order,
          question: entity.question,
          tags: entity.tags.join(NoteConstants.TAG_SEPARATOR)
        }
    
        return model
      }
    }
  }

  getAllTags(notes: NoteEntity[]): string[] {
    const tags: string[] = []
    notes.forEach(item => tags.push(...item.tags))
    return ArrayUtils.removeRepeatedValues(tags)
  }

  getNotesInColumnByFilter(notes: NoteEntity[], column: NoteColumnEntity, tagsSearch: string[], textSearch: string, activeTagsSearch: boolean, activeTextSearch: boolean) {
    return notes.filter(note => {
      if (note.columnLocalId !== column.localId) {
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
