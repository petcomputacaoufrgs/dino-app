import PhoneModel from './PhoneModel'

export default interface ContactModel {
  localID: number
  apiID?: number
  name: string
  phones: Array<PhoneModel>
  description?: string
  color: string
}
