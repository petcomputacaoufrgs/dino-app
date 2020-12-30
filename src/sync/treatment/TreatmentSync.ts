import SynchronizableSync from '../synchronizable/SynchronizableSync'
import TreatmentDataModel from '../../types/treatment/api/TreatmentDataModel'
import TreatmentEntity from '../../types/treatment/database/TreatmentEntity'
import { TreatmentRepositoryImpl } from '../../storage/database/treatment/TreatmentRepository'
import TreatmentService from '../../services/treatment/TreatmentService'

class TreatmentSync extends SynchronizableSync<
  number,
  number,
  TreatmentDataModel,
  TreatmentEntity,
  TreatmentRepositoryImpl
> {
  constructor() {
    super(TreatmentService)
  }
}

export default new TreatmentSync()
