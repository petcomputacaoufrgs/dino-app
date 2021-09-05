import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface EventTypeDataModel
	extends SynchronizableDataLocalIdModel<number> {
	title: string
	color?: string
	icon?: string
	userId?: number
}
