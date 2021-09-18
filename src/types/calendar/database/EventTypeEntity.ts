import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface EventTypeEntity extends SynchronizableEntity<number> {
	title: string
	color?: number
	icon?: string
	userId?: number
}
