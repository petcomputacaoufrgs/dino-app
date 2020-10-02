import NoteColumnResponseModel from '../../types/note/server/get/NoteColumnResponseModel'
import DinoAgentService from '../../agent/DinoAgentService'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import NoteColumnSaveRequestModel from '../../types/note/server/save/NoteColumnSaveRequestModel'
import NoteColumnSaveResponseModel from '../../types/note/server/save/NoteColumnSaveResponseModel'
import NoteColumnOrderAllRequestModel from '../../types/note/server/order/NoteColumnOrderAllRequestModel'
import NoteColumnDeleteAllRequestModel from '../../types/note/server/delete/NoteColumnDeleteAllRequestModel'
import NoteColumnDeleteRequestModel from '../../types/note/server/delete/NoteColumnDeleteRequestModel'
import NoteColumnEntity from '../../types/note/database/NoteColumnEntity'
import DeletedNoteColumnEntity from '../../types/note/database/DeletedNoteColumnEntity'
import NoteColumnSyncRequestModel from '../../types/note/server/sync/note_column/NoteColumnSyncRequestModel'
import NoteColumnSyncResponse from '../../types/note/server/sync/note_column/NoteColumnSyncResponse'

class NoteColumnServerService {
  //#region GET

  get = async (): Promise<NoteColumnResponseModel[] | null> => {
    const request = await DinoAgentService.get(
      DinoAPIURLConstants.NOTE_COLUMN_GET
    )
    if (request.canGo) {
      try {
        const response = await request.authenticate().go()
        return response.body
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }
    return null
  }

  getVersion = async (): Promise<number | undefined> => {
    const request = await DinoAgentService.get(
      DinoAPIURLConstants.NOTE_COLUMN_VERSION
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().go()

        const serverVersion: number = response.body

        return serverVersion
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    return undefined
  }

  //#endregion

  //#region SAVE

  save = async (column: NoteColumnEntity): Promise<NoteColumnSaveResponseModel | null> => {
    const noteColumnModel: NoteColumnSaveRequestModel = {
      title: column.title,
      lastUpdate: column.lastUpdate,
      lastOrderUpdate: column.lastOrderUpdate,
      id: column.external_id,
      order: column.order,
    }

    const request = await DinoAgentService.post(
      DinoAPIURLConstants.NOTE_COLUMN_SAVE
    )

    if (request.canGo) {
      try {
        const response = await request
          .authenticate()
          .setBody(noteColumnModel)
          .go()
        return response.body
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    return null
  }

  saveAll = async (columns: NoteColumnEntity[]): Promise<NoteColumnUpdateAllResponseModel | null> => {
    const model: NoteColumnUpdateAllRequestModel = {
      items: columns.map((column) => ({
        id: column.external_id,
        title: column.title,
        lastUpdate: column.lastUpdate,
        lastOrderUpdate: column.lastOrderUpdate,
        order: column.order,
      }))
    }

    const request = await DinoAgentService.put(
      DinoAPIURLConstants.NOTE_COLUMN_SYNC
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(model).go()
        

        return response.body
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    return null
  }

  saveOrder = async (columns: NoteColumnEntity[]): Promise<boolean> => {
    const model: NoteColumnOrderAllRequestModel = {
      items: [],
    }

    columns.forEach((column) => {
      model.items.push({
        id: column.external_id,
        columnTitle: column.title,
        order: column.order,
        lastOrderUpdate: column.lastOrderUpdate
      })
    })

    const request = await DinoAgentService.put(
      DinoAPIURLConstants.NOTE_COLUMN_ORDER
    )

    if (request.canGo) {
      try {
        await request.authenticate().setBody(model).go()

        return true
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    return false
  }

  //#endregion

  //#region DELETE

  deleteAll = async (deletedNotes: DeletedNoteColumnEntity[]): Promise<number | undefined> => {
    const model: NoteColumnDeleteAllRequestModel = {
      items: deletedNotes.map((deletedNote) => ({
        id: deletedNote.external_id!,
      }))
    }

    const request = await DinoAgentService.delete(
      DinoAPIURLConstants.NOTE_COLUMN_DELETE_ALL
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(model).go()
        const newVersion = response.body

        return newVersion
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    return undefined
  }

  delete = async (externalId: number): Promise<number | null> => {
    const model: NoteColumnDeleteRequestModel = { id: externalId }

    const request = await DinoAgentService.delete(
      DinoAPIURLConstants.NOTE_COLUMN_DELETE
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(model).go()
        const newVersion = response.body
        return newVersion
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }
    return null
  }

  //#endregion

  //#region SYNC

  sync = async (model: NoteColumnSyncRequestModel): Promise<NoteColumnSyncResponse | undefined> => {
    const request = await DinoAgentService.put(
      DinoAPIURLConstants.NOTE_COLUMN_SYNC
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(model).go()
        return response.body
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    return undefined
  }

  //#endregion
}

export default new NoteColumnServerService()
