import PermissionEnum from '../../types/enum/PermissionEnum'

export const toggle = {
	firstLogin: false,
	showFirstLoginDialog: true,
	loadTestInstancesAtFirstLogin: false,
	showTreatmentQuestionButtonToStaff: true,
	overridePermission: {
		override: true,
		permission: PermissionEnum.USER,
	},
	testAll2048Pieces: false,
}
