import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface FaqEntity extends SynchronizableEntity<number> {
	title: string
	localTreatmentId?: number
}
