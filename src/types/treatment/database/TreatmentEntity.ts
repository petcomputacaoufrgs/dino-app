import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface TreatmentEntity extends SynchronizableEntity<number> {
	name: string
}
