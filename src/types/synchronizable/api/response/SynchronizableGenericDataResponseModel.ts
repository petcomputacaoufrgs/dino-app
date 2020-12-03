import SynchronizableGenericResponseModel from "./SynchronizableGenericResponseModel"

export default interface SynchronizableGenericDataResponseModel<DATA_TYPE> extends SynchronizableGenericResponseModel {
    data: DATA_TYPE
}