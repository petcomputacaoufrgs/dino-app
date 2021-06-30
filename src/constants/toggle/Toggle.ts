import PermissionEnum from "../../types/enum/PermissionEnum"

export const toggle = {
	firstLogin: false,
	showFirstLoginDialog: false,
	loadTestInstancesAtFirstLogin: true,
	showTreatmentQuestionButtonToStaff: true,
	overridePermission: {
		override: false,
		permission: PermissionEnum.STAFF
	},
	testAll2048Pieces: true
}