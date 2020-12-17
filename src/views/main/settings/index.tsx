import React, { useState, useEffect } from 'react'
import { useAppSettings } from '../../../context/provider/app_settings'
import { useAlert } from '../../../context/provider/alert'
import { ReactComponent as SaveSVG } from '../../../assets/icons/save.svg'
import FormControl from '@material-ui/core/FormControl'
import Typography from '@material-ui/core/Typography'
import Button from '../../../components/button'
import AppSettingsRequestAndResponseModel from '../../../types/app_settings/AppSettingsRequestAndResponseModel'
import AppSettingsService from '../../../services/app_settings/AppSettingsService'
import FaqService from '../../../services/faq/FaqService'
import SelectFaq from './select_faq'
import './styles.css'
import GoogleGrantDialog from '../../../components/google_grant_dialog'
import GoogleScope from '../../../types/auth/google/GoogleScope'
import { useGoogleOAuth2 } from '../../../context/provider/google_oauth2'
import SelectColorTheme from './select_color_theme'
import SelectLanguage from './select_language'
import DinoSwitch from '../../../components/switch'
import DinoHr from '../../../components/dino_hr'
import SelectFontSize from './select_font_size'

const Settings = (): JSX.Element => {
  const appSettings = useAppSettings()

  const googleOAuth2 = useGoogleOAuth2()

  const language = appSettings.language.current

  const colorTheme = appSettings.colorTheme.currentCode

  const alert = useAlert()

  const [selectedContactGrant, setSelectedContactGrant] = useState(googleOAuth2.hasContactGrant)
  
  const [openContactsGrantDialog, setOpenContactsGrantDialog] = useState(false)

  const [selectedLanguage, setSelectedLanguage] = useState(language.NAVIGATOR_LANGUAGE_CODE)

  const [selectedFontSize, setSelectedFontSize] = useState(appSettings.fontSize.currentCode)

  const [selectedColorTheme, setSelectedColorTheme] = useState(colorTheme)

  const currentFaq = appSettings.selectedFaq.current

  const [selectedFaq, setSelectedFaq] = useState(currentFaq)

  const [selectedEssentialContactGrant, setSelectedEssentialContactGrant] = useState(AppSettingsService.getEssentialContactGrant())

  useEffect(() => {
    if(selectedContactGrant)
      handleChangeContactsGrantDialog()
  }, [selectedContactGrant])

  const handleAgreeContactsGrantDialog = () => {
    handleChangeContactsGrantDialog()
  }

  const handleDisagreeContactsGrantDialog = () => {
    handleChangeContactsGrantDialog()
    setSelectedContactGrant(false)
  }

  const handleChangeContactsGrantDialog = () => {
    setOpenContactsGrantDialog(!openContactsGrantDialog)
  }

  const onSave = () => {
    const model: AppSettingsRequestAndResponseModel = {
      language: selectedLanguage,
      fontSize: selectedFontSize,
      colorTheme: selectedColorTheme,
      essentialContactGrant: selectedEssentialContactGrant
    }

    AppSettingsService.set(model)

    const currentLanguage = appSettings.language.updateLanguage()

    if (selectedFaq !== undefined) {
      FaqService.switchUserFaq(selectedFaq)
    }

    alert.showSuccessAlert(currentLanguage.SETTINGS_SAVE_SUCCESS)
  }

  const renderSaveButton = (): JSX.Element => (
    <div className="settings__save_button_container">
      <Button className="settings__save_button" onClick={onSave}>
        <SaveSVG className="settings__save_button__icon" />
        {language.SETTINGS_SAVE}
      </Button>
    </div>
  )

  const renderDialogs = (): JSX.Element => (
    <>
      <GoogleGrantDialog
        onAccept={handleAgreeContactsGrantDialog}
        onDecline={handleDisagreeContactsGrantDialog}
        open={openContactsGrantDialog}
        scopes={[GoogleScope.SCOPE_CONTACT]}
        text={language.GOOGLE_CONTACT_GRANT_TEXT}
        title={language.GOOGLE_CONTACT_GRANT_TITLE}
      />
    </>
  )

  return (
    <div className="settings">
      <Typography
        className="settings__title"
        color="textSecondary"
        gutterBottom
      >
        {language.SETTINGS_TITLE}
      </Typography>
      <FormControl className="settings__form">
        <SelectLanguage 
          language={selectedLanguage}
          setLanguage={setSelectedLanguage}
        />
      </FormControl>
      <FormControl className="settings__form">
        <SelectFontSize 
          fontSize={selectedFontSize}
          setFontSize={setSelectedFontSize}
        />
      </FormControl>
      <FormControl className="settings__form">
        <SelectColorTheme 
          colorTheme={selectedColorTheme} 
          setColorTheme={setSelectedColorTheme}
        />
      </FormControl>
      <FormControl className="settings__form">
        <SelectFaq 
          faq={selectedFaq} 
          setFaq={setSelectedFaq} 
        />
      </FormControl>
      <DinoHr invisible/>
      <FormControl className="settings__form">
        <DinoSwitch
          selected={selectedContactGrant}
          setSelected={setSelectedContactGrant}
          label={language.SAVE_CONTACT_ON_GOOGLE_GRANT}
        />
      </FormControl>
      <DinoHr />
      <FormControl className="settings__form">
        <DinoSwitch
          selected={selectedEssentialContactGrant}
          setSelected={setSelectedEssentialContactGrant}
          label={language.SELECT_TREATMENT_LOAD_CONTACT_GRANT}
        />
      </FormControl>
      <DinoHr invisible/>
      {renderSaveButton()}
      {renderDialogs()}
    </div>
  )
}

export default Settings
