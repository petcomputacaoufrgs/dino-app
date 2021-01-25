import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface StaffEntity extends SynchronizableEntity<number> {
	email: string
	name?: string
	sentInvitationDate: Date
	userId?: number
}
