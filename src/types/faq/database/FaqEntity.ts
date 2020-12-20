import SynchronizableEntity from "../../synchronizable/database/SynchronizableEntity"

export default interface FaqEntity extends SynchronizableEntity<number, number> {
    title: string
    localTreatmentId?: number
}