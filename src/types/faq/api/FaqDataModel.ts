import SynchronizableDataLocalIdModel from "../../synchronizable/api/SynchronizableDataLocalIdModel";

export default interface FaqDataModel extends SynchronizableDataLocalIdModel<number, number> {
    title: string
    treatmentId: number
}