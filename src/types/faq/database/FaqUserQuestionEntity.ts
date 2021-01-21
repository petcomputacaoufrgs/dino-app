import SynchronizableEntity from '../../sync/database/SynchronizableEntity'

export default interface FaqUserQuestionEntity
	extends SynchronizableEntity<number> {
	question: string
	localFaqId?: number
}
