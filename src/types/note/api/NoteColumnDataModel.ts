import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface NoteColumnDataModel
	extends SynchronizableDataLocalIdModel<number> {
	order: number
	title: string
}
