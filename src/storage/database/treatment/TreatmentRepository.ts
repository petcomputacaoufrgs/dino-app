import SynchronizableRepository from '../synchronizable/SynchronizableRepository'
import Database from '../Database'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'

export class TreatmentRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  TreatmentEntity
> {}

export default new TreatmentRepositoryImpl(Database.treatment)
