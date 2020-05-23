import PhoneModel from "./PhoneModel";

export default interface ContactModel {
  id: number
  name: string
  phone: PhoneModel
  description: string
  color: string
}
