import React, { useState, useEffect } from 'react'
import { useAppSettings } from '../../../context/provider/app_settings'
import { useAlert } from '../../../context/provider/alert'
import { ReactComponent as SaveSVG } from '../../../assets/icons/save.svg'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import AppSettingsRequestAndResponseModel from '../../../types/app_settings/AppSettingsRequestAndResponseModel'
import AppSettingsService from '../../../services/app_settings/AppSettingsService'
import FaqService from '../../../services/faq/FaqService'
import SelectFaq from '../faq/select_faq'
import './styles.css'
import GoogleGrantDialog from '../../../components/google_grant_dialog'
import GoogleScope from '../../../types/auth/google/GoogleScope'
import { Switch } from '@material-ui/core'
import { useGoogleOAuth2 } from '../../../context/provider'

const Settings = (): JSX.Element => {
  const appSettings = useAppSettings()

  const googleOAuth2 = useGoogleOAuth2()

  const language = appSettings.language.current

  const colorTheme = appSettings.colorTheme.currentCode

  const alert = useAlert()

  const languageList = appSettings.language.getLanguages()

  const colorThemeList = appSettings.colorTheme.getColorThemeOptions()

  const [openContactsGrantDialog, setOpenContactsGrantDialog] = useState(false)

  const [selectedLanguage, setSelectedLanguage] = useState(
    language.NAVIGATOR_LANGUAGE_CODE
  )

  const [selectedColorTheme, setSelectedColorTheme] = useState(colorTheme)

  const currentFaq = appSettings.selectedFaq.current

  const [selectedFaq, setSelectedFaq] = useState(currentFaq)

  useEffect(() => {
    setSelectedLanguage(language.NAVIGATOR_LANGUAGE_CODE)
  }, [language])

  useEffect(() => {
    setSelectedColorTheme(colorTheme)
  }, [colorTheme])

  useEffect(() => {
    setSelectedFaq(currentFaq)
  }, [currentFaq])

  const handleSelectedLanguageChanged = (event: any) => {
    if (event && event.target && event.target.value) {
      setSelectedLanguage(event.target.value as string)
    }
  }

  const handleSelectedColorThemeChanged = (event: any) => {
    if (event && event.target && event.target.value) {
      setSelectedColorTheme(event.target.value as number)
    }
  }

  const handleAcceptOrDeclineGoogleGrant = () => {
    setOpenContactsGrantDialog(false)
  }

  const handleActiveOrDeclineGoogleGrant = () => {
    if (!googleOAuth2.hasContactGrant) {
      setOpenContactsGrantDialog(true)
    }
  }

  const onSave = () => {
    const model: AppSettingsRequestAndResponseModel = {
      language: selectedLanguage,
      colorTheme: selectedColorTheme,
    }

    AppSettingsService.set(model)

    const currentLanguage = appSettings.language.updateLanguage()

    if (selectedFaq !== undefined) {
      FaqService.switchUserFaq(selectedFaq)
    }

    alert.showSuccessAlert(currentLanguage.SETTINGS_SAVE_SUCCESS)
  }

  const renderSelectLanguage = (): JSX.Element => (
    <>
      <InputLabel id="language-select-label">
        {language.SETTINGS_LANGUAGE}
      </InputLabel>
      <Select
        labelId="language-select-label"
        id="language-select"
        value={selectedLanguage}
        onChange={handleSelectedLanguageChanged}
      >
        {languageList.map((language, index) => (
          <MenuItem key={index} value={language.code}>
            {language.name}
          </MenuItem>
        ))}
      </Select>
    </>
  )

  const renderSelectColorTheme = (): JSX.Element => (
    <>
      <InputLabel id="color-theme--select-label">
        {language.COLOR_THEME_SELECTION_TITLE}
      </InputLabel>
      <Select
        labelId="color-theme--select-label"
        id="color-theme--select"
        value={selectedColorTheme}
        onChange={handleSelectedColorThemeChanged}
      >
        {colorThemeList.map((option, index) => (
          <MenuItem key={index} value={option.code}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </>
  )

  const renderSelectFaq = (): JSX.Element => (
    <SelectFaq selectedFaq={selectedFaq} setSelectedFaq={setSelectedFaq} />
  )
  
  const renderContactGrant = (): JSX.Element => (
    <div className="settings__grant">
      <p>
        Permissão de contatos
      </p>
      <Switch 
        size="medium" 
        className="settings__grant__switch"
        checked={googleOAuth2.hasContactGrant} 
        onClick={handleActiveOrDeclineGoogleGrant} 
      />
    </div>
  )

  const renderSaveButton = (): JSX.Element => (
    <div className="settings__save_button_container">
      <Button
        variant="contained"
        color="primary"
        size="large"
        className="settings__save_button"
        startIcon={<SaveSVG className="settings__save_button__icon" />}
        onClick={onSave}
      >
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
        {renderSelectLanguage()}
      </FormControl>
      <FormControl className="settings__form">
        {renderSelectColorTheme()}
      </FormControl>
      <FormControl className="settings__form">
        {renderSelectFaq()}
      </FormControl>
      <FormControl className="settings__form">
        {renderContactGrant()}
      </FormControl>
      {renderSaveButton()}
      {renderDialogs()}
    </div>
  )
}

export default Settings
