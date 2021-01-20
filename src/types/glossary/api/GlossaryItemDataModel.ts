import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface GlossaryItemDataModel
	extends SynchronizableDataLocalIdModel<number> {
	title: string
	text: string
	subtitle: string
	fullText: string
}
