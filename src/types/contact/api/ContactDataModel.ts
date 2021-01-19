import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface ContactDataModel
	extends SynchronizableDataLocalIdModel<number> {
	name: string
	description?: string
	color?: number
	essentialContactId?: number
}
