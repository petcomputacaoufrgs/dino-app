import SynchronizableDataLocalIdModel from '../../synchronizable/api/SynchronizableDataLocalIdModel'

export default interface FaqDataModel
  extends SynchronizableDataLocalIdModel<number> {
  title: string
  treatmentId: number
}
