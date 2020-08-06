import PhoneModel from './PhoneModel'

export default interface ContactResponseModel {
  id: number
  name: string
  phones: Array<PhoneModel>
  description?: string
  color: string
}
