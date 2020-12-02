import React, { useState, useEffect } from 'react'
import TextButton from '../../../components/button/text_button'
import StringUtils from '../../../utils/StringUtils'
import MuiSearchBar from '../../../components/mui_search_bar'
import './styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import FaqItemModel from '../../../types/faq/FaqItemModel'
import FaqItems from './faq_items'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core'
import TransitionSlide from '../../../components/slide_transition'
import {
  useCurrentLanguage,
  useCurrentFaq,
} from '../../../context/provider/app_settings'
import SelectFaq from './select_faq'
import FaqService from '../../../services/faq/FaqService'
import { useFaq } from '../../../context/provider/faq'
import QuestionDialogForm from './question_dialog_form'

const Faq = (): JSX.Element => {
  const language = useCurrentLanguage()

  const currentFaq = useCurrentFaq()

  const items = useFaq().items

  const [selectedFaq, setSelectedFaq] = useState(currentFaq)
  const [open, setOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([] as FaqItemModel[])
  const isFaqEmpty = items.length === 0

  useEffect(() => {
    const results = items.filter(item =>
      StringUtils.contains(item.question, searchTerm)
    )
    setSearchResults(results)
  }, [items, searchTerm])

  useEffect(() => {
    setSelectedFaq(currentFaq)
  }, [currentFaq])

  const handleChangeOpenDialog = () => {
    setOpen(!open)
  }

  const handleChangeValueSearchTerm = (
    event: React.ChangeEvent<{ value: string }>
  ) => {
    setSearchTerm(event.target.value as string)
  }

  const handleSwitchUserFaq = async () => {
    if (selectedFaq !== undefined) {
      FaqService.switchUserFaq(selectedFaq)
    }
    handleChangeOpenDialog()
  }

  const handleSendQuestion = () => {
    setDialogOpen(true)
  }

  const renderFaqOptions = () => {
    return (
      <div className="select-faq">
        <Dialog
          disableBackdropClick
          disableEscapeKeyDown
          open={open}
          fullWidth
          onClose={handleChangeOpenDialog}
          TransitionComponent={TransitionSlide}
          aria-labelledby="form-dialog"
        >
          <DialogTitle>{language.SELECT_TREATMENT}</DialogTitle>
          <DialogContent>
            <SelectFaq
              selectedFaq={selectedFaq}
              setSelectedFaq={setSelectedFaq}
            />
          </DialogContent>
          <DialogActions>
            <TextButton
              onClick={handleChangeOpenDialog}
              aria-labelledby={language.DIALOG_CANCEL_BUTTON_LABEL}
            >
              {language.DIALOG_CANCEL_BUTTON_TEXT}
            </TextButton>
            <TextButton
              onClick={handleSwitchUserFaq}
              aria-labelledby={language.DIALOG_SAVE_BUTTON_LABEL}
            >
              {language.DIALOG_SAVE_BUTTON_TEXT}
            </TextButton>
          </DialogActions>
        </Dialog>
        <div className="select-faq__button">
          <TextButton
            className="select_faq_button"
            outline
            onClick={handleChangeOpenDialog}
          >
            {language.SELECT_FAQ_BUTTON}
          </TextButton>
        </div>
      </div>
    )
  }

  return (
    <div>
      <MuiSearchBar
        value={searchTerm}
        onChange={handleChangeValueSearchTerm}
        placeholder={language.SEARCH_HOLDER}
      />
      {isFaqEmpty ? (
        renderFaqOptions()
      ) : (
        <div className="faq__content">
          <div>
            <FaqItems
              title={selectedFaq ? selectedFaq.title : ''}
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
        </div>
      )}
    </div>
  )
}

export default Faq
