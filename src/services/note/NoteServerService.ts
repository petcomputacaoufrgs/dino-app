import DinoAgentService from '../../agent/DinoAgentService'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import NoteSaveModel from '../../types/note/server/save/NoteSaveRequestModel'
import NoteSaveResponseModel from '../../types/note/server/save/NoteSaveResponseModel'
import NoteDeleteRequestModel from '../../types/note/server/delete/NoteDeleteRequestModel'
import NoteResponseModel from '../../types/note/server/get/NoteResponseModel'
import NoteOrderAllRequestModel from '../../types/note/server/order/NoteOrderAllRequestModel'
import NoteOrderRequestModel from '../../types/note/server/order/NoteOrderRequestModel'
import NoteDeleteAllRequestModel from '../../types/note/server/delete/NoteDeleteAllRequestModel'
import NoteEntity from '../../types/note/database/NoteEntity'
import DeletedNoteEntity from '../../types/note/database/DeletedNoteEntity'
import NoteSyncRequestModel from '../../types/note/server/sync/note/NoteSyncRequestModel'
import NoteSyncResponseModel from '../../types/note/server/sync/note/NoteSyncResponseModel'

class NoteServerService {
  //#region GET

  get = async (): Promise<NoteResponseModel[] | null> => {
    const request = await DinoAgentService.get(
      APIRequestMappingConstants.NOTE_GET
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().go()
        return response.body
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return null
  }

  getVersion = async (): Promise<number | undefined> => {
    const request = await DinoAgentService.get(
      APIRequestMappingConstants.NOTE_GET_VERSION
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().go()

        const serverVersion: number = response.body

        return serverVersion
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return undefined
  }

  //#endregion

  //#region SAVE

  save = async (note: NoteEntity): Promise<NoteSaveResponseModel | null> => {
    const noteSaveModel: NoteSaveModel = {
      answer: note.answer,
      question: note.question,
      lastUpdate: note.lastUpdate,
      lastOrderUpdate: note.lastOrderUpdate,
      tagNames: note.tagNames,
      id: note.external_id,
      order: note.order,
      columnTitle: note.columnTitle,
    }

    const request = await DinoAgentService.post(
      APIRequestMappingConstants.NOTE_SAVE
    )

    if (request.canGo) {
      try {
        const response = await request
          .authenticate()
          .setBody(noteSaveModel)
          .go()
        const body: NoteSaveResponseModel = response.body

        return body
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return null
  }

  saveOrder = async (notes: NoteEntity[]): Promise<boolean> => {
    const model: NoteOrderAllRequestModel = {
      items: notes
        .filter((note) => note.external_id !== undefined)
        .map(
          (note) =>
            ({
              id: note.external_id,
              order: note.order,
              columnTitle: note.columnTitle,
              lastOrderUpdate: note.lastOrderUpdate,
            } as NoteOrderRequestModel)
        ),
    }

    const request = await DinoAgentService.put(
      APIRequestMappingConstants.NOTE_ORDER
    )

    if (request.canGo) {
      try {
        await request.authenticate().setBody(model).go()
        return true
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return false
  }

  //#endregion

  //#region SYNC

  sync = async (
    model: NoteSyncRequestModel
  ): Promise<NoteSyncResponseModel | undefined> => {
    const request = await DinoAgentService.put(
      APIRequestMappingConstants.NOTE_SYNC
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(model).go()
        return response.body
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return undefined
  }

  //#endregion
  //#region DELETE

  deleteAll = async (
    notes: DeletedNoteEntity[]
  ): Promise<number | undefined> => {
    const model: NoteDeleteAllRequestModel = {
      items: notes.map(
        (note) =>
          ({
            id: note.external_id,
          } as NoteDeleteRequestModel)
      ),
    }

    const request = await DinoAgentService.delete(
      APIRequestMappingConstants.NOTE_DELETE_ALL
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(model).go()
        const newVersion = response.body

        return newVersion
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return undefined
  }

  delete = async (externalId: number): Promise<number | null> => {
    const model: NoteDeleteRequestModel = { id: externalId }

    const request = await DinoAgentService.delete(
      APIRequestMappingConstants.NOTE_DELETE
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(model).go()
        const newVersion = response.body
        return newVersion
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }
    return null
  }

  //#endregion
}

export default new NoteServerService()
