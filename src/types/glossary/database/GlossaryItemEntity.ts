import SynchronizableEntity from '../../synchronizable/database/SynchronizableEntity'

export default interface GlossaryItemEntity
  extends SynchronizableEntity<number, number> {
  title: string
  text: string
  subtitle: string
  fullText: string
}
