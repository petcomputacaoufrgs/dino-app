import PermissionEnum from "../../types/enum/PermissionEnum"

export const toggle = {
	firstLogin: false,
	showFirstLoginDialog: false,
	loadTestInstancesAtFirstLogin: false,
	showTreatmentQuestionButtonToStaff: true,
	overridePermission: {
		override: false,
		permission: PermissionEnum.USER
	},
	testAll2048Pieces: false
}