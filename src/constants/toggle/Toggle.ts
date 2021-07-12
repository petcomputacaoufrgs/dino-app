import PermissionEnum from "../../types/enum/PermissionEnum"

export const toggle = {
	firstLogin: true,
	showFirstLoginDialog: true,
	loadTestInstancesAtFirstLogin: false,
	showTreatmentQuestionButtonToStaff: true,
	overridePermission: {
		override: false,
		permission: PermissionEnum.USER
	},
	testAll2048Pieces: false
}