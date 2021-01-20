import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface FaqItemEntity extends SynchronizableEntity<number> {
	question: string
	answer: string
	localFaqId?: number
}
