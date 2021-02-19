import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface GoogleContactDataModel
	extends SynchronizableDataLocalIdModel<number> {
	resourceName?: string
	contactId: number
	savedOnGoogleAPI: boolean
}
