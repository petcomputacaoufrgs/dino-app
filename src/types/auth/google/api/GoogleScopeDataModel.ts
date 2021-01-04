import SynchronizableDataLocalIdModel from '../../../synchronizable/api/SynchronizableDataLocalIdModel'

export default interface GoogleScopeDataModel
  extends SynchronizableDataLocalIdModel<number> {
  name: string
}
