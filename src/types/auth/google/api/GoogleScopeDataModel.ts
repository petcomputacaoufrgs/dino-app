import SynchronizableDataLocalIdModel from '../../../sync/api/SynchronizableDataLocalIdModel'

export default interface GoogleScopeDataModel
	extends SynchronizableDataLocalIdModel<number> {
	name: string
}
