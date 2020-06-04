import PhoneModel from './PhoneModel'

export default interface ContactModel {
  id: number
  name: string
  phones: Array<PhoneModel>
  description?: string
  color: string
}
