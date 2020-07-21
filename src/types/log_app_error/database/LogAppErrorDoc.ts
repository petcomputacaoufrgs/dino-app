import LogAppErrorModel from '../LogAppErrorModel'

export default interface LogAppErrorDoc
  extends PouchDB.Core.GetMeta,
    LogAppErrorModel {
  _id?: string
}
