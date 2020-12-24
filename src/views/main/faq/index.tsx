import React, { useState, useEffect } from 'react'
import MuiSearchBar from '../../../components/mui_search_bar'
import FaqItems from './faq_items'
import { useFaq } from '../../../context/provider/faq'
import QuestionDialogForm from './question_dialog_form'
import LinkButton from '../../../components/button/link_button'
import { useFaqItem } from '../../../context/provider/faq_item'
import FaqView from '../../../types/faq/view/FaqView'
import { useUserSettings } from '../../../context/provider/user_settings'
import { useTreatment } from '../../../context/provider/treatment'
import './styles.css'

const Faq: React.FC = () => {
  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)
  const treatment = useTreatment()
  const faq = useFaq()
  const faqItem = useFaqItem()
  const currentTreatment = userSettings.service.getTreatment(
    userSettings,
    treatment.data
  )
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<FaqView | undefined>()

  useEffect(() => {
    const results = faq.service.getFaqViewByFilter(
      currentTreatment,
      faq.data,
      faqItem.data,
      searchTerm
    )
    setSearchResults(results)
  }, [currentTreatment, faq, faqItem, searchTerm])

  const handleChangeValueSearchTerm = (
    event: React.ChangeEvent<{ value: string }>
  ) => {
    setSearchTerm(event.target.value as string)
  }

  const handleSendQuestion = () => {
    setDialogOpen(true)
  }

  return (
    <div>
      {searchResults !== undefined && (
        <>
          <MuiSearchBar
            value={searchTerm}
            onChange={handleChangeValueSearchTerm}
            placeholder={language.SEARCH_HOLDER}
          />
          <div>
            <FaqItems data={searchResults} />
            <LinkButton
              text={language.NOT_FOUND_QUESTION_FAQ}
              onClick={handleSendQuestion}
            />
            <QuestionDialogForm
              dialogOpen={dialogOpen}
              setDialogOpen={setDialogOpen}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default Faq
