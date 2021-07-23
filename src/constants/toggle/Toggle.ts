import PermissionEnum from '../../types/enum/PermissionEnum'

export const toggle = {
	firstLogin: false,
	showFirstLoginDialog: true,
	loadTestInstancesAtFirstLogin: true,
	showTreatmentQuestionButtonToStaff: true,
	overridePermission: {
		override: false,
		permission: PermissionEnum.USER,
	},
	testAll2048Pieces: false,
}
