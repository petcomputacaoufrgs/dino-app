import SynchronizableDataLocalIdModel from '../SynchronizableDataLocalIdModel'

export default interface SynchronizableSyncResponseModel<
	ID,
	DATA_MODEL extends SynchronizableDataLocalIdModel<ID>
> {
	data: Array<DATA_MODEL>

	success: boolean

	error: string
}
