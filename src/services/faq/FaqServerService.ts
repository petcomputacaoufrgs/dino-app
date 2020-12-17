import DinoAgentService from '../../agent/DinoAgentService'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import FaqModel from '../../types/faq/FaqModel'
import FaqOptionsModel from '../../types/faq/FaqOptionsModel'
import HttpStatus from 'http-status-codes'
import FaqVersionModel from '../../types/faq/FaqSyncModel'
import Service from './FaqService'

class FaqServerService {
  getUserFaq = async (): Promise<undefined | FaqModel> => {
    const request = await DinoAgentService.get(
      APIRequestMappingConstants.FAQ_GET
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().go()

        if (response.status === HttpStatus.OK) {
          return response.body as FaqModel
        } else if (response.status === HttpStatus.NO_CONTENT) {
          Service.removeUserData()
        }
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }
    return undefined
  }

  saveUserFaqId = async (id: number): Promise<number | undefined> => {
    const request = await DinoAgentService.post(
      APIRequestMappingConstants.FAQ_SAVE
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody({ id }).go()

        if (response.status === HttpStatus.OK) {
          return response.body
        }
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }
    return undefined
  }

  getEssentialContacts = async (id: number): Promise<void | undefined> => {
    const request = await DinoAgentService.post(DinoAPIURLConstants.TREATMENT_ESSENTIAL_CONTACTS)

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody({ id }).go()

        if (response.status === HttpStatus.OK) {
          return
        }
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }
    return undefined
  }

  saveUserQuestion = async (
    id: number,
    question: string
  ): Promise<void | undefined> => {
    const request = await DinoAgentService.post(
      APIRequestMappingConstants.FAQ_SAVE_USER_QUESTION
    )

    if (request.canGo) {
      try {
        const response = await request
          .authenticate()
          .setBody({ id, question })
          .go()

        if (response.status === HttpStatus.OK) {
          return
        }
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }
    return undefined
  }

  getFaqOptions = async (): Promise<Array<FaqOptionsModel> | undefined> => {
    const request = await DinoAgentService.get(
      APIRequestMappingConstants.FAQ_OPTIONS
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().go()

        if (response.status === HttpStatus.OK) {
          return response.body
        }
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return undefined
  }

  getUserFaqVersion = async (): Promise<FaqVersionModel | undefined> => {
    const request = await DinoAgentService.get(
      APIRequestMappingConstants.FAQ_GET_VERSION
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().go()

        if (response.status === HttpStatus.OK) {
          return response.body
        }
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return undefined
  }
}

export default new FaqServerService()
