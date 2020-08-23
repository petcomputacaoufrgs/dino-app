import FaqOptionsModel from '../../../../types/faq/FaqOptionsModel'

export default interface SelectFaqProps {
    selectedFaq: FaqOptionsModel | undefined
    setSelectedFaq: React.Dispatch<React.SetStateAction<FaqOptionsModel | undefined>>
}