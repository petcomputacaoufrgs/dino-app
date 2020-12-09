import React, { useState } from 'react'
import './styles.css'
import AuthService from '../../../../services/auth/AuthService'
import { Button, Dialog, DialogActions, MobileStepper } from '@material-ui/core'
import TransitionSlide from '../../../../components/slide_transition'
import { useAppSettings } from '../../../../context/provider/app_settings'
import AppSettingsService from '../../../../services/app_settings/AppSettingsService'
import FaqService from '../../../../services/faq/FaqService'
import SelectFaq from '../../settings/select_faq'
import DinoSwitch from '../../../../components/switch'
import SelectLanguage from '../../settings/select_language'
import SelectColorTheme from '../../settings/select_color_theme'
import { useGoogleOAuth2 } from '../../../../context/provider/google_oauth2'
import { useAlert } from '../../../../context/provider/alert'
import DinoDialogHeader, { DinoDialogContent } from '../../../../components/dino_dialog'
import { KeyboardArrowLeft, KeyboardArrowRight, Save } from '@material-ui/icons'
import DinoLogoHeader from '../../../../components/dino_logo_header'

const FirstLoginDialog = () => {

  const FIRST_DIALOG = 0
  const LAST_DIALOG = 3

  const alert = useAlert()

  const appSettings = useAppSettings()

  const googleOAuth2 = useGoogleOAuth2()

  const language = appSettings.language.current

  const colorTheme = appSettings.colorTheme.currentCode

  const [dialogOpen, setDialogOpen] = useState(AuthService.isFirstLogin() ? FIRST_DIALOG : -1)

  const [selectedFaq, setSelectedFaq] = useState(appSettings.selectedFaq.current)
  
  const [selectedLanguage, setSelectedLanguage] = useState(language.NAVIGATOR_LANGUAGE_CODE)

  const [selectedColorTheme, setSelectedColorTheme] = useState(colorTheme)

  const [selectedEssentialContactGrant, setSelectedEssentialContactGrant] = useState(AppSettingsService.getEssentialContactGrant())

  
  const handleSwitchUserFaq = () => {
    if (selectedFaq !== undefined) {
      if(selectedEssentialContactGrant) {
        AppSettingsService.setEssentialContactGrant(true)
      }
      FaqService.switchUserFaq(selectedFaq)
    }
  }

  const handleNext = () => {
    setDialogOpen(dialogOpen + 1);
  }

  const handleBack = () => {
    setDialogOpen(dialogOpen - 1);
  }

  const handleCloseDialogs = () => {
    setDialogOpen(-1);
  }

  const handleSave = () => {
    // const model: AppSettingsRequestAndResponseModel = {
    //   language: selectedLanguage,
    //   colorTheme: selectedColorTheme,
    //   essentialContactGrant: selectedEssentialContactGrant
    // }

    // AppSettingsService.set(model)

    // const currentLanguage = appSettings.language.updateLanguage()

    // if (selectedFaq !== undefined) {
    //   FaqService.switchUserFaq(selectedFaq)
    // }

    // alert.showSuccessAlert(currentLanguage.SETTINGS_SAVE_SUCCESS)

    handleCloseDialogs()
  }

  const handleCancel = () => {
    handleCloseDialogs()
  }

  const renderButtons = () => {

    return (
      <MobileStepper
        variant="dots"
        steps={LAST_DIALOG + 1}
        position="static"
        activeStep={dialogOpen}
        nextButton={
          dialogOpen === LAST_DIALOG ?
          <Button 
            className="next__button"
            aria-label={language.DIALOG_SAVE_BUTTON_LABEL} 
            onClick={handleSave}
            >
              {language.DIALOG_SAVE_BUTTON_TEXT}
              <KeyboardArrowRight />
          </Button> 
          :
          <Button 
            className="next__button"
            aria-label={language.NEXT_BUTTON_TEXT_LABEL}  
            onClick={handleNext}
            >
              {language.NEXT_BUTTON_TEXT}
              <KeyboardArrowRight />
          </Button>
        }
        backButton={
          dialogOpen === FIRST_DIALOG ?
          <Button 
            className="back__button" 
            aria-label={language.DIALOG_CANCEL_BUTTON_LABEL} 
            onClick={handleCancel}
            >
              <KeyboardArrowLeft />
              {language.DIALOG_CANCEL_BUTTON_TEXT}
          </Button> 
          :
          <Button 
            className="back__button" 
            aria-label={language.PREVIOUS_BUTTON_TEXT_LABEL} 
            onClick={handleBack}
            >
              <KeyboardArrowLeft />
              {language.PREVIOUS_BUTTON_TEXT}
          </Button>
        }
      />
    )
  }

  const renderSelectFaqDialogContent = () => {
    return (
      <SelectFaq
        faq={selectedFaq}
        setFaq={setSelectedFaq}
      >
        <DinoSwitch
          selected={selectedEssentialContactGrant}
          setSelected={setSelectedEssentialContactGrant}
          label={language.SELECT_TREATMENT_LOAD_CONTACT_GRANT}
        />
      </SelectFaq>
    )
  }

  const renderSelectColorThemeDialogContent = () => {
    return (
      <SelectColorTheme 
        colorTheme={selectedColorTheme} 
        setColorTheme={setSelectedColorTheme}
      />
    )
  }

  const renderSelectLanguageDialogContent = () => {
    return (
      <SelectLanguage 
        language={selectedLanguage}
        setLanguage={setSelectedLanguage}
      />
    )
  }

  const renderMessageDialog = () => {
    return (
    <div className="message_dialog">
      <DinoLogoHeader title={"Bem-vindo(a)!"} size='small' />
      <p>
        Mensagem do Dino Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Nisi illum officiis vero debitis quia nam iusto. 
        Necessitatibus repudiandae ut labore!
      </p>
      <h6 className="citation">— Equipe DinoApp</h6>
    </div>
    )
  }

  const firstLoginDialogs = [
    { title: "", component: renderMessageDialog },
    { title: "Escolha seu Idioma", component: renderSelectLanguageDialogContent },
    { title: "Escolha seu Tratamento", component: renderSelectFaqDialogContent },
    { title: "Escolha seu Tema de Cores", component: renderSelectColorThemeDialogContent },
  ]

    return (
      <>
        {firstLoginDialogs.map((e, index) => 
            <Dialog
              key={index}
              className="first-login__dialog"
              disableBackdropClick
              disableEscapeKeyDown
              open={dialogOpen === index}
              fullWidth
              onClose={handleNext}
              TransitionComponent={TransitionSlide}
              aria-labelledby="form-dialog"
            >
              {index === FIRST_DIALOG ? 
              <></> :
              <DinoDialogHeader>
                <h5>{e.title}</h5>
              </DinoDialogHeader>}
              <DinoDialogContent>
                {e.component()}
              </DinoDialogContent>
              <DialogActions>
                {renderButtons()}
              </DialogActions>
            </Dialog>
          )
        }
      </>
    )
}

export default FirstLoginDialog