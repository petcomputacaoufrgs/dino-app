import SynchronizableEntity from "../../sync/database/SynchronizableEntity"

export default interface EssentialContactEntity extends SynchronizableEntity<number> {
  name: string
  description?: string
  color?: number
  treatmentLocalIds?: number[]
  isUniversal: 0|1
}
