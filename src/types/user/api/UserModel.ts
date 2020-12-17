import SynchronizableDataLocalIdModel from "../../synchronizable/api/SynchronizableDataLocalIdModel"

export default interface UserModel extends SynchronizableDataLocalIdModel<number, number> {
  name: string
  email: string
  pictureURL: string
}