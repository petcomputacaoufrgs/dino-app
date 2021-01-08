import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface GlossaryItemEntity
  extends SynchronizableEntity<number> {
  title: string
  text: string
  subtitle: string
  fullText: string
}
