import SynchronizableGenericModel from "./SynchronizableGenericListModel"
import SynchronizableDeleteModel from "./SynchronizableDeleteModel"

export default interface SynchronizableDeleteAllListModel<ID>
    extends SynchronizableGenericModel<ID, SynchronizableDeleteModel<ID>> {}