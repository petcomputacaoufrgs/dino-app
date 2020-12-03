import SynchronizableModel from "../SynchronizableModel"

export default interface SynchronizableGenericListModel<ID, DATA_TYPE extends SynchronizableModel<ID>> {
    data: DATA_TYPE[]
}