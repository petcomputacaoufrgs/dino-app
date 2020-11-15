import React, { useState, useEffect } from 'react'
import StringUtils from '../../../utils/StringUtils'
import MuiSearchBar from '../../../components/mui_search_bar'
import './styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import FaqItemModel from '../../../types/faq/FaqItemModel'
import FaqItems from './faq_items'
import {
  useCurrentLanguage,
  useCurrentFaq,
} from '../../../context_provider/app_settings'
import { useFaq } from '../../../context_provider/faq'
import QuestionDialogForm from './question_dialog_form'
import FaqOptions from './faq_options_dialog'

const Faq = (): JSX.Element => {
  const language = useCurrentLanguage()

  const currentFaq = useCurrentFaq()

  const items = useFaq().items

  const [open, setOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([] as FaqItemModel[])
  const isFaqEmpty = items.length === 0

  useEffect(() => {
    const results = items.filter((item) =>
      StringUtils.contains(item.question, searchTerm)
    )
    setSearchResults(results)
  }, [items, searchTerm])


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
      <MuiSearchBar
        value={searchTerm}
        onChange={handleChangeValueSearchTerm}
        placeholder={language.SEARCH_HOLDER}
      />
      {isFaqEmpty ? 
        <FaqOptions 
          open={open} 
          handleChangeOpenDialog={() => setOpen(!open)} 
        /> 
        : 
        <div>
          <FaqItems
            title={currentFaq ? currentFaq.title : ''}
            items={searchResults}
          />
          <button
            className="send-question__button"
            onClick={handleSendQuestion}
          >
            {language.NOT_FOUND_QUESTION_FAQ}
          </button>
          <QuestionDialogForm
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
          />
        </div>
      }
    </div>
  )
}

export default Faq
