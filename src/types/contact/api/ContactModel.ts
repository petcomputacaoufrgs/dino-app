import SynchronizableDataModel from '../../synchronizable/api/SynchronizableDataModel'

export default interface ContactModel extends SynchronizableDataModel<number> {
  name: string
  description?: string
  color?: number
}
