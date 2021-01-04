import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import FaqDataModel from '../../types/faq/api/FaqDataModel'
import FaqEntity from '../../types/faq/database/FaqEntity'
import FaqRepository, {
  FaqRepositoryImpl,
} from '../../storage/database/faq/FaqRepository'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import FaqItemEntity from '../../types/faq/database/FaqItemEntity'
import FaqView from '../../types/faq/view/FaqView'
import FaqItemService from './FaqItemService'
import TreatmentEntity from '../../types/treatment/database/TreatmentEntity'
import TreatmentService from '../treatment/TreatmentService'
import BaseSynchronizableService from '../sync/BaseSynchronizableService'

export class FaqServiceImpl extends AutoSynchronizableService<
  number,
  FaqDataModel,
  FaqEntity,
  FaqRepositoryImpl
> {
  constructor() {
    super(
      FaqRepository,
      APIRequestMappingConstants.FAQ,
      APIWebSocketDestConstants.FAQ_UPDATE,
      APIWebSocketDestConstants.FAQ_DELETE
    )
  }

  getDependencies(): BaseSynchronizableService[] {
    return [TreatmentService]
  }
  async convertModelToEntity(
    model: FaqDataModel
  ): Promise<FaqEntity | undefined> {
    const treatment = await TreatmentService.getById(model.treatmentId)
    if (treatment) {
      const entity: FaqEntity = {
        title: model.title,
        localTreatmentId: treatment.localId,
      }

      return entity
    }
  }

  async convertEntityToModel(
    entity: FaqEntity
  ): Promise<FaqDataModel | undefined> {
    if (entity.localTreatmentId) {
      const treatment = await TreatmentService.getByLocalId(
        entity.localTreatmentId
      )

      if (treatment && treatment.id) {
        const model: FaqDataModel = {
          title: entity.title,
          treatmentId: treatment.id,
        }

        return model
      }
    }
  }

  getFaqViewByFilter(
    treatment: TreatmentEntity | undefined,
    faqs: FaqEntity[],
    faqItem: FaqItemEntity[],
    searchTerm: string
  ): FaqView | undefined {
    const currentFaq = this.getCurrentFaq(treatment, faqs)

    if (currentFaq) {
      const view: FaqView = {
        faq: currentFaq,
        items: FaqItemService.getFaqItemByFilter(
          currentFaq,
          faqItem,
          searchTerm
        ),
      }

      return view
    }

    return undefined
  }

  getCurrentFaq(
    treatment: TreatmentEntity | undefined,
    faqs: FaqEntity[]
  ): FaqEntity | undefined {
    if (treatment) {
      const currentFaq = faqs.find(
        (faq) => faq.localTreatmentId === treatment.localId
      )
      return currentFaq
    }

    return undefined
  }
}

export default new FaqServiceImpl()
