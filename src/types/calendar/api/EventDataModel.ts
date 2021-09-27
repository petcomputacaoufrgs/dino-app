import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface EventDataModel
	extends SynchronizableDataLocalIdModel<number> {
	title: string
	description?: string
	start: string
	end: string
	typeId?: number
	repeat?: string
	alert?: string
}
