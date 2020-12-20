import SynchronizableDataLocalIdModel from "../../synchronizable/api/SynchronizableDataLocalIdModel"

export default interface TreatmentDataModel extends SynchronizableDataLocalIdModel<number, number> {
  name: string
}