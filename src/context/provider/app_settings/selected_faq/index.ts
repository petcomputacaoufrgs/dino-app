import { useState } from 'react'
import SelectedFaqContextType from '../../../../types/context_provider/SelectedFaqContextType'
import FaqService from '../../../../services/faq/FaqService'

const SelectedFaqContextProvider = (): SelectedFaqContextType => {
  const [currentFaq, setCurrentFaq] = useState(FaqService.getUserFaqInfo())

  const updateFaq = (): void => {
    const faq = FaqService.getUserFaqInfo()

    setCurrentFaq(faq)
  }

  const value: SelectedFaqContextType = {
    current: currentFaq,
    updateFaq: updateFaq,
  }

  return value
}

export default SelectedFaqContextProvider
