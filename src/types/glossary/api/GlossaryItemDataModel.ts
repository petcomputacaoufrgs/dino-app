import SynchronizableDataModel from '../../synchronizable/api/SynchronizableDataModel'
import SynchronizableDataLocalIdModel from '../../synchronizable/api/SynchronizableDataLocalIdModel'

export default interface GlossaryItemDataModel
  extends SynchronizableDataLocalIdModel<number, number> {
  title: string
  text: string
  subtitle: string
  fullText: string
}
