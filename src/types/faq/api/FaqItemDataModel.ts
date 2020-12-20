import SynchronizableDataLocalIdModel from "../../synchronizable/api/SynchronizableDataLocalIdModel";

export default interface FaqItemDataModel extends SynchronizableDataLocalIdModel<number, number> {
    question: string
    answer: string
    faqId: number
}