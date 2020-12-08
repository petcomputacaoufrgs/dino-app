import React, { useState, useEffect } from 'react'
import { useAppSettings } from '../../../context/provider/app_settings'
import { useAlert } from '../../../context/provider/alert'
import { ReactComponent as SaveSVG } from '../../../assets/icons/save.svg'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import Button from '../../../components/button'
import AppSettingsRequestAndResponseModel from '../../../types/app_settings/AppSettingsRequestAndResponseModel'
import AppSettingsService from '../../../services/app_settings/AppSettingsService'
import FaqService from '../../../services/faq/FaqService'
import SelectFaq from '../faq/select_faq'
import './styles.css'
import GoogleGrantDialog from '../../../components/google_grant_dialog'
import GoogleScope from '../../../types/auth/google/GoogleScope'
import { Switch } from '@material-ui/core'
import { useGoogleOAuth2 } from '../../../context/provider/google_oauth2'
import SelectColorTheme from './select_color_theme'
import SelectLanguage from './select_language'

const Settings = (): JSX.Element => {
  const appSettings = useAppSettings()

  const googleOAuth2 = useGoogleOAuth2()

  const language = appSettings.language.current

  const colorTheme = appSettings.colorTheme.currentCode

  const alert = useAlert()

  const [openContactsGrantDialog, setOpenContactsGrantDialog] = useState(false)

  const [selectedLanguage, setSelectedLanguage] = useState(language.NAVIGATOR_LANGUAGE_CODE)

  const [selectedColorTheme, setSelectedColorTheme] = useState(colorTheme)

  const currentFaq = appSettings.selectedFaq.current

  const [selectedFaq, setSelectedFaq] = useState(currentFaq)

  const [selectedEContactsGrant, setSelectedEContactsGrant] = useState(AppSettingsService.getLoadEContactsGrant())

  useEffect(() => {
    setSelectedLanguage(language.NAVIGATOR_LANGUAGE_CODE)
  }, [language])

  useEffect(() => {
    setSelectedColorTheme(colorTheme)
  }, [colorTheme])

  useEffect(() => {
    setSelectedFaq(currentFaq)
  }, [currentFaq])

  const handleAcceptOrDeclineGoogleGrant = () => {
    setOpenContactsGrantDialog(false)
  }

  const handleActiveOrDeclineGoogleGrant = () => {
    if (!googleOAuth2.hasContactGrant) {
      setOpenContactsGrantDialog(true)
    }
  }

  const handleChangeEssentialContactsGrant = () => {
    setSelectedEContactsGrant(!selectedEContactsGrant)
  }

  const onSave = () => {
    const model: AppSettingsRequestAndResponseModel = {
      language: selectedLanguage,
      colorTheme: selectedColorTheme,
      loadEssentialContactsGrant: selectedEContactsGrant
    }

    AppSettingsService.set(model)

    const currentLanguage = appSettings.language.updateLanguage()

    if (selectedFaq !== undefined) {
      FaqService.switchUserFaq(selectedFaq)
    }

    alert.showSuccessAlert(currentLanguage.SETTINGS_SAVE_SUCCESS)
  }

  const renderContactGrant = (): JSX.Element => (
    <div className="settings__grant">
      <p>Permissão de contatos</p>
      <Switch
        size="medium"
        className="settings__grant__switch"
        checked={googleOAuth2.hasContactGrant}
        onClick={handleActiveOrDeclineGoogleGrant}
      />
    </div>
  )

  const renderEssentialContactsGrant = (): JSX.Element => (
    <div className="settings__grant">
      <p>Carregar contatos referentes a meu tratamento</p>
      <Switch
        size="medium"
        className="settings__grant__switch"
        checked={selectedEContactsGrant}
        onClick={handleChangeEssentialContactsGrant}
      />
    </div>
  )

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
        onAccept={handleAcceptOrDeclineGoogleGrant}
        onDecline={handleAcceptOrDeclineGoogleGrant}
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
      <FormControl className="settings__form">
        {renderContactGrant()}
      </FormControl>
      <FormControl className="settings__form">
        {renderEssentialContactsGrant()}
      </FormControl>
      {renderSaveButton()}
      {renderDialogs()}
    </div>
  )
}

export default Settings
