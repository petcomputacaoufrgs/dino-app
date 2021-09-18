import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface EventTypeDataModel
	extends SynchronizableDataLocalIdModel<number> {
	title: string
	color?: number
	icon?: string
	userId?: number
}
