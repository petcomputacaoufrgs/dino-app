import PhoneModel from './PhoneModel'

export default interface ContactModel {
  id?: number
  frontId: number
  name: string
  phones: Array<PhoneModel>
  description?: string
  color?: number
  resourceName?: string
}
