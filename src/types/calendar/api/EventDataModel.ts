import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface EventDataModel
	extends SynchronizableDataLocalIdModel<number> {
	title: string
	description?: string
	date: string
	endTime?: string
	typeId?: number
	repeat?: string
	alert?: string
}
