import React, { useState, useEffect } from 'react'
import StringUtils from '../../../utils/StringUtils'
import BootstrapSearchBar from '../../../components/bootstrap_search_bar'
import 'bootstrap/dist/css/bootstrap.min.css'
import FaqItemModel from '../../../types/faq/FaqItemModel'
import FaqItems from './faq_items'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button} from '@material-ui/core'
import TransitionSlide from '../../../components/slide_transition'
import { useLanguage } from '../../../context_provider/app_settings'
import SelectFaq from './select_faq'
import { useFaq } from '../../../context_provider/faq'
import FaqService from '../../../services/faq/FaqService'
import FaqContextUpdater from '../../../context_updater/FaqContextUpdater'


const Faq = (): JSX.Element => {
    
  //const items = useFaq().items
  const [items, setItems] = useState(FaqService.getItems())
  const language = useLanguage().current

  const [selectedFaq, setSelectedFaq] = React.useState(FaqService.getCurrentFaqInfo())

  const [isOptionsVisible, setIsOptionsVisible] = useState(items.length === 0)
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([] as FaqItemModel[])

  useEffect(() => {
    const results = items.filter(item =>
      StringUtils.contains(item.question, searchTerm))
    setSearchResults(results)
  }, [items, searchTerm])

  const handleChangeOpenDialog = () => setOpen(!open)

  const handleChangeValueSearchTerm = (event: React.ChangeEvent<{ value: string }>) => setSearchTerm(event.target.value as string)

  const handleSwitchUserFaq = async () => {
    if(selectedFaq !== undefined) {
      await FaqService.switchUserFaq(selectedFaq)
      setIsOptionsVisible(false)
      //FaqContextUpdater.update()
      setItems([...FaqService.getItems()])
    }
    handleChangeOpenDialog()
  }

  const getFaqOptions = () => {
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
          <Button onClick={handleChangeOpenDialog} color="primary" aria-labelledby={language.DIALOG_CANCEL_BUTTON_LABEL}>
            {language.DIALOG_CANCEL_BUTTON_TEXT}
          </Button>
          <Button onClick={handleSwitchUserFaq} color="primary" aria-labelledby={language.DIALOG_SAVE_BUTTON_LABEL}>
            {language.DIALOG_SAVE_BUTTON_TEXT}
          </Button>
        </DialogActions>
      </Dialog>  
      <Button style={{margin: "auto",  display: "flex", marginTop: "50%"}} variant="outlined" color="primary" onClick={handleChangeOpenDialog}>
        {language.SELECT_FAQ_BUTTON}
      </Button>
    </div>)
  }

    return (
      <div className="faqPage">
        <BootstrapSearchBar
          value={searchTerm}
          onChange={handleChangeValueSearchTerm}
          placeholder={language.SEARCH_HOLDER}
        />
        {isOptionsVisible ? getFaqOptions() 
        : <FaqItems items={searchResults} />}
      </div>
    )
  }

export default Faq
