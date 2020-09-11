import FaqOptionsModel from '../faq/FaqOptionsModel'

export default interface SelectedFaqContextType {
  current: FaqOptionsModel | undefined
  updateFaq: () => void
}
