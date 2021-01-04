import SynchronizableEntity from '../../synchronizable/database/SynchronizableEntity'

export default interface UserEntity
  extends SynchronizableEntity<number> {
  name: string
  email: string
  pictureURL: string
  pictureBase64?: string
}
