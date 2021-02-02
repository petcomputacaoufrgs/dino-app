import StaffEntity from "../database/StaffEntity"

export default interface StaffView {
	staff: StaffEntity,
	acceptedInvitation: boolean
}
