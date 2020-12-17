import React, { useEffect, useState } from 'react'
import AuthService from '../../../../services/auth/AuthService'
import { Dialog, DialogActions } from '@material-ui/core'
import TransitionSlide from '../../../../components/slide_transition'
import { useAppSettings } from '../../../../context/provider/app_settings'
import AppSettingsService from '../../../../services/app_settings/AppSettingsService'
import FaqService from '../../../../services/faq/FaqService'
import SelectFaq from '../../settings/select_faq'
import DinoSwitch from '../../../../components/switch'
import SelectLanguage from '../../settings/select_language'
import SelectColorTheme from '../../settings/select_color_theme'
import DinoDialogHeader, { DinoDialogContent } from '../../../../components/dino_dialog'
import DinoLogoHeader from '../../../../components/dino_logo_header'
import DinoStepper from '../../../../components/dino_stepper'
import AppSettingsRequestAndResponseModel from '../../../../types/app_settings/AppSettingsRequestAndResponseModel'
import SelectFontSize from '../../settings/select_font_size'
import './styles.css'

const FirstLoginDialog = () => {

  const appSettings = useAppSettings()

  const language = appSettings.language.current

  const [dialogOpen, setDialogOpen] = useState(AuthService.isFirstLogin() ? 0 : -1)

  const [selectedFaq, setSelectedFaq] = useState(appSettings.selectedFaq.current)
  
  const [selectedLanguage, setSelectedLanguage] = useState(language.NAVIGATOR_LANGUAGE_CODE)

  const [selectedFontSize, setSelectedFontSize] = useState(appSettings.fontSize.currentCode)

  const [selectedColorTheme, setSelectedColorTheme] = useState(appSettings.colorTheme.currentCode)

  const [selectedEssentialContactGrant, setSelectedEssentialContactGrant] = useState(AppSettingsService.getEssentialContactGrant())

  const handleCloseDialogs = () => {
    setDialogOpen(-1)
  }

  useEffect(() => {
    const handleSwitchInitialConfig = () => {
      const model: AppSettingsRequestAndResponseModel = {
        language: selectedLanguage,
        fontSize: selectedFontSize,
        colorTheme: selectedColorTheme,
        essentialContactGrant: selectedEssentialContactGrant
      }
  
      AppSettingsService.set(model)
    }

    if(dialogOpen > 0) {
      //handleSwitchInitialConfig()
    }
  }, [dialogOpen, selectedLanguage, selectedFontSize, selectedColorTheme, selectedEssentialContactGrant])

  useEffect(() => {
    console.log(dialogOpen)
  }, [dialogOpen])

  const handleSwitchInitialConfig = () => {
    const model: AppSettingsRequestAndResponseModel = {
      language: selectedLanguage,
      fontSize: selectedFontSize,
      colorTheme: selectedColorTheme,
      essentialContactGrant: selectedEssentialContactGrant
    }

    AppSettingsService.set(model)
  }

  const handleSave = () => {
    handleCloseDialogs()

    AuthService.removeIsFirstLogin()
    
    handleSwitchInitialConfig()

    if (selectedFaq !== undefined) {
      AppSettingsService.setEssentialContactGrant(selectedEssentialContactGrant)
      FaqService.switchUserFaq(selectedFaq)
    }    
  }

  const handleCancel = () => {
    handleCloseDialogs()
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
      <>
      <SelectLanguage 
        language={selectedLanguage}
        setLanguage={setSelectedLanguage}
      />
      <SelectFontSize 
        fontSize={selectedFontSize}
        setFontSize={setSelectedFontSize}
      />
      </>
    )
  }

  const renderWelcomeMessageDialog = () => {
    return (
    <div className="message_dialog">
      <DinoLogoHeader title={language.FIRST_LOGIN_WELCOME_MESSAGE} size='small' />
      <p>
        Mensagem do Dino Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Nisi illum officiis vero debitis quia nam iusto. 
        Necessitatibus repudiandae ut labore!
      </p>
    <h6 className="citation">— {language.DINOAPP_TEAM}</h6>
    </div>
    )
  }

  const renderFinalMessageDialog = () => {
    return (
    <div className="message_dialog">
      <DinoLogoHeader title={language.FIRST_LOGIN_DONE_MESSAGE} size='small' />
      <p>Obrigado por se juntar ao DinoApp!</p>
      <p>Suas configurações podem ser atualizadas a qualquer momento na aba de <em>Configurações</em>
      </p>
    </div>
    )
  }

  const firstLoginDialogs = [
    { title: "", component: renderWelcomeMessageDialog },
    { title: language.FIRST_LOGIN_CHOOSE_LANGUAGE, component: renderSelectLanguageDialogContent },
    { title: language.FIRST_LOGIN_CHOOSE_COLOR_THEME, component: renderSelectColorThemeDialogContent },
    { title: language.FIRST_LOGIN_CHOOSE_TREATMENT, component: renderSelectFaqDialogContent },
    { title: "", component: renderFinalMessageDialog },
  ]

  const NUMBER_DIALOGS = firstLoginDialogs.length

  const isFirstOrLastDialog = (index: number) => index === 0 || index === NUMBER_DIALOGS - 1

  return (
    <>
      {firstLoginDialogs.map((e, index) => 
        <Dialog
          key={index}
          className="first-login__dialog"
          aria-labelledby={language.FIRST_LOGIN_DIALOG_LABEL}
          open={dialogOpen === index}
          TransitionComponent={TransitionSlide}
          disableEscapeKeyDown
          disableBackdropClick
          fullWidth
        >
          { isFirstOrLastDialog(index) ? 
            <></> :
            <DinoDialogHeader>
              <h5>{e.title}</h5>
            </DinoDialogHeader>
          }
          <DinoDialogContent>
            {e.component()}
          </DinoDialogContent>
          <DialogActions>
            <DinoStepper 
              steps={NUMBER_DIALOGS}
              activeStep={dialogOpen}
              setActiveStep={setDialogOpen}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}

export default FirstLoginDialog