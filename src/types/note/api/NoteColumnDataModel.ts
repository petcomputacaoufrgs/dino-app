import SynchronizableDataModel from '../../synchronizable/api/SynchronizableDataModel'

export default interface NoteColumnDataModel extends SynchronizableDataModel<number> {
    order: number
    title: string
}
