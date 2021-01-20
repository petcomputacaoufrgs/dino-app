import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface TreatmentDataModel
	extends SynchronizableDataLocalIdModel<number> {
	name: string
}
