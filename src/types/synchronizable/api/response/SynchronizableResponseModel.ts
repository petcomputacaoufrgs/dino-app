import SynchronizableDataModel from '../SynchronizableDataModel'
import SynchronizableGenericDataResponseModel from './SynchronizableGenericDataResponseModel'

export default interface SynchronizableDataResponseModel<
  ID,
  DATA_MODEL extends SynchronizableDataModel<ID>
> extends SynchronizableGenericDataResponseModel<DATA_MODEL> {}
