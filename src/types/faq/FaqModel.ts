import FaqItemModel from './FaqItemModel'
export default interface FaqModel {
  id: number
  version: number
  title: string
  items: FaqItemModel[]
}
