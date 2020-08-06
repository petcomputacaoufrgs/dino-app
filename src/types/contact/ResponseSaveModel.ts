import ResponseModel from './ResponseModel'

export default interface ResponseSaveModel {
  version: number
  responseModels: Array<ResponseModel>
}
