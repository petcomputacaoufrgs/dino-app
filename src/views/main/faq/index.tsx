import React, { useState, useEffect } from 'react'
import StringUtils from '../../../utils/StringUtils'
import BootstrapSearchBar from '../../../components/bootstrap_search_bar'
import './styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import FaqItemModel from '../../../types/faq/FaqItemModel'
import FaqItems from './faq_items'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button} from '@material-ui/core'
import TransitionSlide from '../../../components/slide_transition'
import { useLanguage } from '../../../context_provider/app_settings'
import SelectFaq from './select_faq'
import FaqService from '../../../services/faq/FaqService'
//import { useFaq } from '../../../context_provider/faq'
//import FaqContextUpdater from '../../../context_updater/FaqContextUpdater'

const Faq = (): JSX.Element => {
    
  //const items = useFaq().items
  const [items, setItems] = useState(FaqService.getItems())
  const language = useLanguage().current

  const [selectedFaq, setSelectedFaq] = React.useState(FaqService.getCurrentFaqInfo())

  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([] as FaqItemModel[])
  const isFaqEmpty = items.length === 0

  useEffect(() => {
    const results = items.filter(item =>
      StringUtils.contains(item.question, searchTerm))
    setSearchResults(results)
  }, [items, searchTerm])

  const handleChangeOpenDialog = () => {
    setOpen(!open)
  }

  const handleChangeValueSearchTerm = (event: React.ChangeEvent<{ value: string }>) => {
    setSearchTerm(event.target.value as string)
  }

  const handleSwitchUserFaq = async () => {
    if(selectedFaq !== undefined) {
      await FaqService.switchUserFaq(selectedFaq)
      //FaqContextUpdater.update()
      setItems([...FaqService.getItems()])
    }
    handleChangeOpenDialog()
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
            <Button onClick={handleChangeOpenDialog} color="primary" aria-labelledby={language.DIALOG_CANCEL_BUTTON_LABEL}>
              {language.DIALOG_CANCEL_BUTTON_TEXT}
            </Button>
            <Button onClick={handleSwitchUserFaq} color="primary" aria-labelledby={language.DIALOG_SAVE_BUTTON_LABEL}>
              {language.DIALOG_SAVE_BUTTON_TEXT}
            </Button>
          </DialogActions>
        </Dialog>  
        <Button 
          className='select-faq__button' 
          style={{margin: "auto",  display: "flex", marginTop: "50%"}} 
          variant="outlined" color="primary" 
          onClick={handleChangeOpenDialog}>
            {language.SELECT_FAQ_BUTTON}
        </Button>
      </div>)
    }

    return (
      <div>
        <BootstrapSearchBar
          value={searchTerm}
          onChange={handleChangeValueSearchTerm}
          placeholder={language.SEARCH_HOLDER}
        />
        {isFaqEmpty ? renderFaqOptions() 
        :
        <FaqItems 
          title={selectedFaq ? selectedFaq.title : ''} 
          items={searchResults} />}
      </div>
    )
  }

export default Faq
