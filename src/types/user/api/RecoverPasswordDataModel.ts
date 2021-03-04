import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface RecoverPasswordDataModel {
	code: string
	newPassword?: string
}
