import NoteColumnResponseModel from '../../types/note/server/NoteColumnResponseModel'
import NoteColumnDoc from '../../types/note/database/NoteColumnDoc'
import DinoAgentService from '../../agent/DinoAgentService'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import NoteColumnSaveRequestModel from '../../types/note/server/NoteColumnSaveRequestModel'
import NoteColumnSaveResponseModel from '../../types/note/server/NoteColumnSaveResponseModel'
import NoteColumnDatabase from '../../database/note/NoteColumnDatabase'
import NoteColumnDeleteRequestModel from '../../types/note/server/NoteColumnDeleteRequestModel'
import NoteColumnOrderAllRequestModel from '../../types/note/server/NoteColumnOrderAllRequestModel'

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

  save = async (doc: NoteColumnDoc): Promise<number | null> => {
    const noteColumnModel: NoteColumnSaveRequestModel = {
      title: doc.title,
      lastUpdate: doc.lastUpdate,
      id: doc.external_id,
      order: doc.order,
      oldTitle: doc.oldTitle,
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
        const body: NoteColumnSaveResponseModel = response.body
        const noteColumnDoc = await NoteColumnDatabase.getByTitle(doc.title)
        if (noteColumnDoc) {
          noteColumnDoc.savedOnServer = true
          noteColumnDoc.external_id = body.id
          await NoteColumnDatabase.put(noteColumnDoc)
          return body.version
        }
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    return null
  }

  saveAll = async (docs: NoteColumnDoc[]): Promise<number | null> => {
    const models: NoteColumnSaveRequestModel[] = docs.map((doc) => ({
      id: doc.external_id,
      title: doc.title,
      lastUpdate: doc.lastUpdate,
      order: doc.order,
      oldTitle: doc.oldTitle,
    }))

    const request = await DinoAgentService.put(
      DinoAPIURLConstants.NOTE_COLUMN_UPDATE_ALL
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(models).go()
        const newVersion = response.body
        const promises = models.map(async (model) => {
          const noteDoc = await NoteColumnDatabase.getByTitle(model.title)
          if (noteDoc) {
            noteDoc.savedOnServer = true
            NoteColumnDatabase.put(noteDoc)
          }
        })
        await Promise.all(promises)

        return newVersion
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    return null
  }

  saveOrder = async (docs: NoteColumnDoc[]): Promise<number | null> => {
    const model: NoteColumnOrderAllRequestModel = {
      items: [],
    }

    docs.forEach((doc) => {
      model.items.push({
        id: doc.external_id,
        columnTitle: doc.title,
        order: doc.order,
      })
    })

    const request = await DinoAgentService.put(
      DinoAPIURLConstants.NOTE_COLUMN_ORDER
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

  //#endregion

  //#region DELETE

  deleteAll = async (docs: NoteColumnDoc[]): Promise<number | null> => {
    const models: NoteColumnDeleteRequestModel[] = docs.map((doc) => ({
      id: doc.external_id!,
    }))

    const request = await DinoAgentService.delete(
      DinoAPIURLConstants.NOTE_COLUMN_DELETE_ALL
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(models).go()
        const newVersion = response.body

        return newVersion
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    return null
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
}

export default new NoteColumnServerService()
