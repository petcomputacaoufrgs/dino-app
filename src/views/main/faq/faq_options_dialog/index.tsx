import React, {useState} from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core'
import TransitionSlide from '../../../../components/slide_transition'
import SelectFaq from '../select_faq'
import {
  useCurrentLanguage,
  useCurrentFaq,
} from '../../../../context_provider/app_settings'
import FaqOptionsProps from './props'
import FaqService from '../../../../services/faq/FaqService'
import './styles.css'
import DontAskCheckboxForm from '../../../../components/dont_ask_checkbox'

const FaqOptions = ({ open, handleChangeOpenDialog, dontAskAgainOption }: FaqOptionsProps ) => {

  const language = useCurrentLanguage()

  const [selectedFaq, setSelectedFaq] = useState(useCurrentFaq())
  const [dontAskAgainChecked, setDontAskAgainChecked] = useState(false)
  const [loadContactsChecked, setLoadContactsChecked] = useState(true)
  
  const handleSwitchUserFaq = async () => {
    if (selectedFaq !== undefined) {
      FaqService.switchUserFaq(selectedFaq)
    }
    console.log("salvando dont ask again", dontAskAgainChecked, "e loadcontacts", loadContactsChecked)
    handleChangeOpenDialog()
  }

  const renderLoadContactsCheckbox = (): JSX.Element => { 
    return(
      <FormControlLabel
        className='form-control__checkbox'
        control={
          <Checkbox
            checked={loadContactsChecked}
            onChange={() => setLoadContactsChecked(!loadContactsChecked)}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />}
        label={"Carregar contatos referentes ao meu tratamento"}
      />
  )}

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
            selectedFaq={selectedFaq}
            setSelectedFaq={setSelectedFaq}
          />
          <DontAskCheckboxForm 
            dontAskOption={dontAskAgainOption}
            dontAskChecked={dontAskAgainChecked}
            handleDontAskChecked={() => setDontAskAgainChecked(!dontAskAgainChecked)}
          >
            {renderLoadContactsCheckbox()}
          </DontAskCheckboxForm>
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