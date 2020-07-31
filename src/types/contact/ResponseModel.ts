import PhoneModel from './PhoneModel'

export default interface ResponseModel {
  id: number
  name: string
  phones: Array<PhoneModel>
  description?: string
  color: string
}
