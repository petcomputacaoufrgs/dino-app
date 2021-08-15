import PermissionEnum from '../../types/enum/PermissionEnum'

export const toggle = {
	forceFirstLogin: true,
	showFirstLoginDialog: true,
	loadTestInstancesAtFirstLogin: true,
	showTreatmentQuestionButtonToStaff: false,
	overridePermission: {
		override: false,
		permission: PermissionEnum.STAFF,
	},
	testAll2048Pieces: false,
}
