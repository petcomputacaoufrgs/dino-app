import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface PhoneModel extends SynchronizableEntity<number> {
	number: string
	type: number
	localContactId?: number
	localEssentialContactId?: number
	localOriginalEssentialPhoneId?: number
}
