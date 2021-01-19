import SynchronizableDataModel from '../SynchronizableDataModel'
import SynchronizableGenericDataResponseModel from './SynchronizableGenericDataResponseModel'

export default interface SynchronizableListDataResponseModel<
	ID,
	DATA_MODEL extends SynchronizableDataModel<ID>
> extends SynchronizableGenericDataResponseModel<DATA_MODEL[]> {}
