import PermissionEnum from '../../types/enum/PermissionEnum'

export const toggle = {
	forceFirstLogin: false,
	showFirstLoginDialog: true,
	loadTestInstancesAtFirstLogin: true,
	showTreatmentQuestionButtonToStaff: false,
	testAll2048Pieces: false,
	overridePermission: {
		override: false,
		permission: PermissionEnum.USER,
	},
}
