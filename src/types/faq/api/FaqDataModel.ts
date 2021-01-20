import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface FaqDataModel
	extends SynchronizableDataLocalIdModel<number> {
	title: string
	treatmentId: number
}
