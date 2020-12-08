import FaqOptionsModel from '../../../../types/faq/FaqOptionsModel'

export default interface SelectFaqProps {
  faq: FaqOptionsModel | undefined
  setFaq: React.Dispatch<
    React.SetStateAction<FaqOptionsModel | undefined>
  >
}
