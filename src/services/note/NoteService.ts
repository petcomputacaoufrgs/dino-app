import APIRequestMappingConstants from "../../constants/api/APIRequestMappingConstants"
import APIWebSocketDestConstants from "../../constants/api/APIWebSocketDestConstants"
import NoteConstants from "../../constants/note/NoteConstants"
import NoteRepository, { NoteRepositoryImpl } from "../../storage/database/note/NoteRepository"
import NoteDataModel from "../../types/note/api/NoteDataModel"
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
    const noteColumn = await NoteColumnService.getLocalColumnIdByColumnId(model.columnId)

    if (noteColumn) {
      const entity: NoteEntity = {
        answer: model.answer,
        columnId: model.columnId,
        order: model.order,
        question: model.question,
        tags: model.tags,
        localColumnId: noteColumn.localId
      }
  
      return entity
    }

    return undefined
  }

  async convertEntityToModel(entity: NoteEntity): Promise<NoteDataModel | undefined> {
    const model: NoteDataModel = {
      answer: entity.answer,
      columnId: entity.columnId,
      order: entity.order,
      question: entity.question,
      tags: entity.tags
    }

    return model
  }

  getTags(note: NoteEntity): string[] {
    return note.tags.split(NoteConstants.TAG_SEPARATOR)
  }

  getAllTags(notes: NoteEntity[]): string[] {
    const tags: string[] = []
    notes.forEach(item => tags.push(...this.getTags(item)))
    return ArrayUtils.removeRepeatedValues(tags)
  }
}

export default new NoteServiceImpl(
  NoteRepository,
  APIRequestMappingConstants.NOTE,
  APIWebSocketDestConstants.NOTE_UPDATE,
  APIWebSocketDestConstants.NOTE_DELETE
)
