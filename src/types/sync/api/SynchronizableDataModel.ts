import SynchronizableModel from './SynchronizableModel'

/**
 * Data model of synchronizable entity
 * @param ID Type of api entity ID
 */
export default interface SynchronizableDataModel<ID>
	extends SynchronizableModel<ID> {}
