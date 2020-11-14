import React, {useEffect, useState} from 'react'
//import './styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@material-ui/core'
import TransitionSlide from '../../../../components/slide_transition'
import SelectFaq from '../select_faq'
import {
  useCurrentLanguage,
  useCurrentFaq,
} from '../../../../context_provider/app_settings'
import FaqOptionsProps from './props'
import FaqService from '../../../../services/faq/FaqService'
import DontAskCheckbox from '../../../../components/dont_ask_checkbox'

const FaqOptions = ({open, handleChangeOpenDialog, checkboxAskAgain}: FaqOptionsProps ) => {

  const language = useCurrentLanguage()

  const [selectedFaq, setSelectedFaq] = useState(useCurrentFaq())
  
  const [checked, setChecked] = useState(false)

  //useEffect(() => setSelectedFaq(currentFaq), [currentFaq])

  const handleSwitchUserFaq = async () => {
    if (selectedFaq !== undefined) {
      FaqService.switchUserFaq(selectedFaq)
    }
    handleChangeOpenDialog()
  }

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
          { checkboxAskAgain ? 
              <DontAskCheckbox 
                checked={checked} 
                handleChecked={() => setChecked(!checked)}
              /> 
            : <></> }
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleChangeOpenDialog}
            color="primary"
            aria-labelledby={language.DIALOG_CANCEL_BUTTON_LABEL}
          >
            {language.DIALOG_CANCEL_BUTTON_TEXT}
          </Button>
          <Button
            onClick={handleSwitchUserFaq}
            color="primary"
            aria-labelledby={language.DIALOG_SAVE_BUTTON_LABEL}
          >
            {language.DIALOG_SAVE_BUTTON_TEXT}
          </Button>
        </DialogActions>
      </Dialog>
      <div className="select-faq__button">
        <Button
          style={{ margin: 'auto', display: 'flex', marginTop: '50%' }}
          variant="outlined"
          color="primary"
          onClick={handleChangeOpenDialog}
        >
          {language.SELECT_FAQ_BUTTON}
        </Button>
      </div>
    </div>
  )
}

export default FaqOptions