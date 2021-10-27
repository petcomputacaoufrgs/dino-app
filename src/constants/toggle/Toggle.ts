import PermissionEnum from '../../types/enum/PermissionEnum'

export const toggle = {
	forceFirstLogin: false,
	showFirstLoginDialog: true,
	loadDataInstances: false,
	showTreatmentQuestionButtonToStaff: false,
	testAll2048Pieces: false,
	overridePermission: {
		override: false,
		permission: PermissionEnum.USER,
	},
}
