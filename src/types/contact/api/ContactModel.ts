import SynchronizableDataLocalIdModel from '../../synchronizable/api/SynchronizableDataLocalIdModel'

export default interface ContactModel extends SynchronizableDataLocalIdModel<number, number> {
  name: string
  description?: string
  color?: number
}
