import EssentialContactEntity from '../database/EssentialContactEntity'
import PhoneEntity from '../database/PhoneEntity'

export default interface EssentialContactView {
	contact: EssentialContactEntity
	phones: PhoneEntity[]
}
