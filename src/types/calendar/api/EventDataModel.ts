import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface EventDataModel
	extends SynchronizableDataLocalIdModel<number> {
	title: string
	description?: string
	beginTime: string
	endTime?: string
	typeId?: number
}
