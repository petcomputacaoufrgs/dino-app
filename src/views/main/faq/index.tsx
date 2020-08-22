import React, { useState, useEffect } from 'react'
import StringUtils from '../../../utils/StringUtils'
import BootstrapSearchBar from '../../../components/bootstrap_search_bar'
import 'bootstrap/dist/css/bootstrap.min.css'
import FaqItemModel from '../../../types/faq/FaqItemModel'
import FaqItems from './faq_items'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button} from '@material-ui/core'
import TransitionSlide from '../../../components/slide_transition'
import { useLanguage } from '../../../context_provider/app_settings'
import FaqOptions from './faq_options/index'
import { useFaq } from '../../../context_provider/faq'

const Faq = (): JSX.Element => {
    
  const items = useFaq().items
  const language = useLanguage().current

  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([] as FaqItemModel[])

  useEffect(() => {
    const results = items.filter((item) =>
    StringUtils.contains(item.question, searchTerm)
    )
    setSearchResults(results)
  }, [items, searchTerm])

  const handleChangeOpen = () => setOpen(!open)

  const handleChange = (event: React.ChangeEvent<{ value: string }>) => setSearchTerm(event.target.value as string)

  const getFaqOptions = () => {

    return (
    <>
      <Dialog disableBackdropClick disableEscapeKeyDown
      open={open}
      fullWidth
      onClose={handleChangeOpen}
      TransitionComponent={TransitionSlide}
      aria-labelledby="form-dialog"
    >
      <DialogTitle>
        {language.SELECT_TREATMENT}
      </DialogTitle>
      <DialogContent>
        <FaqOptions />
      </DialogContent>
        <DialogActions>
        <Button onClick={handleChangeOpen} color="primary">Cancel</Button>
        </DialogActions>
      </Dialog>  
      <Button style={{margin: "auto",  display: "flex", marginTop: "50%"}}
      variant="outlined" color="primary" onClick={handleChangeOpen}>
      {language.SELECT_FAQ_BUTTON}
      </Button>
    </>)
  }

    return (
      <div className="faq">
        <BootstrapSearchBar
          value={searchTerm}
          onChange={handleChange}
          placeholder={language.SEARCH_HOLDER}
        />
        {items.length === 0 ? getFaqOptions() : <></>}
        <FaqItems items={searchResults} />
      </div>
    )
  }

export default Faq
