import ContactModel from './ContactModel'

export default interface ResponseSaveModel {
    version: number
    responseModels: Array<ContactModel>
  }
  
