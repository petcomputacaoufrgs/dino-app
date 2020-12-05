import SynchronizableDataModel from "../../synchronizable/api/SynchronizableDataModel"

export default interface GlossaryItemDataModel extends SynchronizableDataModel<number> {
    title: string
    text: string
    subtitle: string
    fullText: string
}
