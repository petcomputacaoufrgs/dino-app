import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface GoogleContactEntity
	extends SynchronizableEntity<number> {
	resourceName?: string
	localContactId?: number
	savedOnGoogleAPI: number
}
