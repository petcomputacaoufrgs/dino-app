import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface EventDataModel
	extends SynchronizableDataLocalIdModel<number> {
	title: string
	description?: string
	date: Date
	endTime?: string
	typeId?: number
}
