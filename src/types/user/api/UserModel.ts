import SynchronizableDataLocalIdModel from "../../synchronizable/api/SynchronizableDataLocalIdModel"

export default interface UserDataModel extends SynchronizableDataLocalIdModel<number, number> {
  name: string
  email: string
  pictureURL: string
}