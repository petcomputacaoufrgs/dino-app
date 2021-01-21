import SynchronizableIdModel from './SynchronizableIdModel'

/**
 * Synchronizable data model with id and lastUpdate
 * @param ID Type of api entity ID
 */
export default interface SynchronizableModel<ID>
	extends SynchronizableIdModel<ID> {
	lastUpdate?: string
}
