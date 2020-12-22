import React, { useState } from 'react'
import { useAlert } from '../../../context/provider/alert'
import { ReactComponent as SaveSVG } from '../../../assets/icons/save.svg'
import FormControl from '@material-ui/core/FormControl'
import Typography from '@material-ui/core/Typography'
import Button from '../../../components/button'
import SelectTreatment from './select_treatment'
import GoogleGrantDialog from '../../../components/google_grant_dialog'
import GoogleScope from '../../../types/auth/google/GoogleScope'
import SelectColorTheme from './select_color_theme'
import SelectLanguage from './select_language'
import DinoSwitch from '../../../components/switch'
import DinoHr from '../../../components/dino_hr'
import SelectFontSize from './select_font_size'
import { useUserSettings } from '../../../context/provider/user_settings'
import { useTreatment } from '../../../context/provider/treatment/index'
import './styles.css'

//TODO Adicionar seleção de tratamento
const Settings = (): JSX.Element => {
  const userSettings = useUserSettings()

  const treatment = useTreatment()

  const alert = useAlert()

  const language = userSettings.service.getLanguage(userSettings)

  const colorThemeCode = userSettings.service.getColorThemeCode(userSettings)

  const fontSizeCode = userSettings.service.getFontSizeCode(userSettings)

  const essentialContactGrant = userSettings.service.getEssentialContactGrant(userSettings)

  const syncGoogleContact = userSettings.service.getSyncGoogleContact(userSettings)

  const currentTreatment = userSettings.service.getTreatment(userSettings, treatment.data)

  const [selectedLanguage, setSelectedLanguage] = useState(language.NAVIGATOR_LANGUAGE_CODE)

  const [selectedFontSize, setSelectedFontSize] = useState(fontSizeCode)

  const [selectedColorTheme, setSelectedColorTheme] = useState(colorThemeCode)

  const [selectedEssentialContactGrant, setSelectedEssentialContactGrant] = useState(
    essentialContactGrant !== undefined ? essentialContactGrant : false)

  const [openGoogleContactDialog, setOpenGoogleContactDialog] = useState(false)

  const [selectedGoogleContactGrant, setSelectedGoogleContactGrant] = useState(syncGoogleContact)

  const [selectedTreatment, setSelectedTreatment] = useState(currentTreatment)

  const handleOpenGoogleContactDialog = () => {
    if (!selectedGoogleContactGrant) {
      setOpenGoogleContactDialog(true)
    }
  }

  const handleAgreeContactsGrantDialog = () => {
    setSelectedGoogleContactGrant(true)
    setOpenGoogleContactDialog(false)
  }

  const handleDisagreeContactsGrantDialog = () => {
    setSelectedGoogleContactGrant(false)
    setOpenGoogleContactDialog(false)
  }

  const onSave = () => {
    const currentUserSettings = userSettings.service.getUserSettingsEntity(userSettings)

    if (currentUserSettings) {
      currentUserSettings.language = selectedLanguage
      currentUserSettings.fontSize = selectedFontSize
      currentUserSettings.colorTheme = selectedColorTheme
      currentUserSettings.includeEssentialContact = selectedEssentialContactGrant
      currentUserSettings.syncGoogleContacts = selectedGoogleContactGrant
  
      userSettings.service.save(currentUserSettings)
    
      alert.showSuccessAlert(language.SETTINGS_SAVE_SUCCESS)
    } else {
      alert.showErrorAlert(language.SETTINGS_SAVE_ERROR)
    }
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
        open={openGoogleContactDialog}
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
          languageName={selectedLanguage}
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
        <SelectTreatment
          availableTreatments={treatment.data}
          setTreatment={setSelectedTreatment}
          treatment={selectedTreatment}
        />
      </FormControl>
      <DinoHr invisible/>
      <FormControl className="settings__form">
        <DinoSwitch
          selected={selectedGoogleContactGrant}
          setSelected={handleOpenGoogleContactDialog}
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
