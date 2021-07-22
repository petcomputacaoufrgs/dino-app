import PermissionEnum from '../../types/enum/PermissionEnum'

export const toggle = {
	firstLogin: false,
	showFirstLoginDialog: true,
	loadTestInstancesAtFirstLogin: true,
	showTreatmentQuestionButtonToStaff: true,
	overridePermission: {
		override: true,
		permission: PermissionEnum.STAFF,
	},
	testAll2048Pieces: false,
}
