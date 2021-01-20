import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface EssentialContactDataModel
	extends SynchronizableDataLocalIdModel<number> {
	name: string
	description?: string
	color?: number
	treatmentIds?: number[]
}
