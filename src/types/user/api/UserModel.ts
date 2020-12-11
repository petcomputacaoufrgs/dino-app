import SynchronizableDataModel from "../../synchronizable/api/SynchronizableDataModel"

export default interface UserModel extends SynchronizableDataModel<number> {
  name: string
  email: string
  pictureURL: string
}