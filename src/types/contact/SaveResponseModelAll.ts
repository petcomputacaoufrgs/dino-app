import ContactResponseModel from './ContactResponseModel'

export default interface SaveResponseModelAll {
    version: number
    contactResponseModels: Array<ContactResponseModel>
  }
  
