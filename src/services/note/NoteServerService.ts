import DinoAgentService from '../../agent/DinoAgentService'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import NoteDoc from '../../types/note/database/NoteDoc'
import NoteSaveModel from '../../types/note/server/NoteSaveRequestModel'
import NoteSaveResponseModel from '../../types/note/server/NoteSaveResponseModel'
import NoteDatabase from '../../database/note/NoteDatabase'
import NoteContextUpdater from '../../context_updater/NoteContextUpdater'
import NoteDeleteModel from '../../types/note/server/NoteDeleteModel'
import NoteResponseModel from '../../types/note/server/NoteResponseModel'
import NoteOrderAllRequestModel from '../../types/note/server/NoteOrderAllRequestModel'
import NoteOrderRequestModel from '../../types/note/server/NoteOrderRequestModel'

class NoteServerService {
  //#region GET

  get = async (): Promise<NoteResponseModel[] | null> => {
    const request = await DinoAgentService.get(DinoAPIURLConstants.NOTE_GET)

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
      DinoAPIURLConstants.NOTE_GET_VERSION
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

  save = async (noteModel: NoteDoc): Promise<number | null> => {
    const noteSaveModel: NoteSaveModel = {
      answer: noteModel.answer,
      question: noteModel.question,
      lastUpdate: noteModel.lastUpdate,
      tagNames: noteModel.tagNames,
      id: noteModel.external_id,
      order: noteModel.order,
      columnTitle: noteModel.columnTitle,
    }

    const request = await DinoAgentService.post(DinoAPIURLConstants.NOTE_SAVE)

    if (request.canGo) {
      try {
        const response = await request
          .authenticate()
          .setBody(noteSaveModel)
          .go()
        const body: NoteSaveResponseModel = response.body
        const noteDoc = await NoteDatabase.getByQuestion(noteModel.question)
        if (noteDoc) {
          noteDoc.savedOnServer = true
          noteDoc.external_id = body.id
          await NoteDatabase.put(noteDoc)
          NoteContextUpdater.update()
          return body.userNoteVersion
        }
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    return null
  }

  saveAll = async (models: NoteSaveModel[]): Promise<number | null> => {
    const request = await DinoAgentService.put(
      DinoAPIURLConstants.NOTE_UPDATE_ALL
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(models).go()
        const newVersion = response.body
        const promises = models.map(async (model) => {
          const noteDoc = await NoteDatabase.getByQuestion(model.question)
          if (noteDoc) {
            noteDoc.savedOnServer = true
            NoteDatabase.put(noteDoc)
          }
        })
        await Promise.all(promises)
        NoteContextUpdater.update()

        return newVersion
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    return null
  }

  saveOrder = async (noteDocs: NoteDoc[]): Promise<number | null> => {
    const model: NoteOrderAllRequestModel = {
      items: noteDocs
        .filter((doc) => doc.external_id !== undefined)
        .map(
          (doc) =>
            ({
              id: doc.external_id,
              order: doc.order,
              columnTitle: doc.columnTitle,
            } as NoteOrderRequestModel)
        ),
    }

    const request = await DinoAgentService.put(DinoAPIURLConstants.NOTE_ORDER)

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

  deleteAll = async (docs: NoteDoc[]): Promise<number | null> => {
    const models = docs.map(
      (doc) =>
        ({
          id: doc.external_id,
        } as NoteDeleteModel)
    )

    const request = await DinoAgentService.delete(
      DinoAPIURLConstants.NOTE_DELETE_ALL
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
    const model: NoteDeleteModel = { id: externalId }

    const request = await DinoAgentService.delete(
      DinoAPIURLConstants.NOTE_DELETE
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

export default new NoteServerService()
