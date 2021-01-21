import SynchronizableDataModel from '../SynchronizableDataModel'
import SynchronizableWSGenericModel from './SynchronizableWSGenericModel'

export default interface SynchronizableWSUpdateModel<
	ID,
	DATA_MODEL extends SynchronizableDataModel<ID>
> extends SynchronizableWSGenericModel<DATA_MODEL> {}
