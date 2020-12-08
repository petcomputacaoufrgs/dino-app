import React, {useState} from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@material-ui/core'
import TransitionSlide from '../../../../components/slide_transition'
import SelectFaq from '../../settings/select_faq'
import { useCurrentLanguage, useCurrentFaq } from '../../../../context/provider/app_settings'
import FaqOptionsProps from './props'
import FaqService from '../../../../services/faq/FaqService'
import AppSettingsService from '../../../../services/app_settings/AppSettingsService'
import './styles.css'
import DinoSwitch from '../../../../components/switch'

const FaqOptions = ({ open, handleChangeOpenDialog }: FaqOptionsProps ) => {

  const language = useCurrentLanguage()

  const [selectedFaq, setSelectedFaq] = useState(useCurrentFaq())
  const [essentialContactGrantChecked, setEssentialContactGrantChecked] = useState(AppSettingsService.getEssentialContactGrant())
  
  const handleSwitchUserFaq = () => {
    // resolução de BUG para posterioridade: isso como função await renderizava 2 vezes o negócio
    if (selectedFaq !== undefined) {
      if(essentialContactGrantChecked) {
        AppSettingsService.setEssentialContactGrant(true)
      }
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
        <DialogContent dividers>
          <SelectFaq
            faq={selectedFaq}
            setFaq={setSelectedFaq}
          >
            <DinoSwitch
              selected={essentialContactGrantChecked}
              setSelected={setEssentialContactGrantChecked}
              label={language.SELECT_TREATMENT_LOAD_CONTACT_GRANT}
            />
          </SelectFaq>
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