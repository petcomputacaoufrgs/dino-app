import React, { useEffect, useState } from 'react'
import { Dialog, DialogActions } from '@material-ui/core'
import SelectTreatment from '../settings/select_treatment'
import DinoSwitch from '../../../components/switch'
import SelectLanguage from '../settings/select_language'
import SelectColorTheme from '../settings/select_color_theme'
import DinoDialogHeader, { DinoDialogContent } from '../../../components/dino_dialog'
import DinoLogoHeader from '../../../components/dino_logo_header'
import DinoStepper from '../../../components/dino_stepper'
import SelectFontSize from '../settings/select_font_size'
import { useUserSettings } from '../../../context/provider/user_settings'
import { useTreatment } from '../../../context/provider/treatment/index'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import AuthService from '../../../services/auth/AuthService'
import './styles.css'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'

const FirstSettingsDialog: React.FC = () => {
  const userSettings = useUserSettings()
  const treatment = useTreatment()
  const language = userSettings.service.getLanguage(userSettings)
  const currentSettings = userSettings.service.getUserSettingsEntity(userSettings)

  const [dialogOpen, setDialogOpen] = useState(true)

  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentEntity | undefined>(undefined)
  
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(undefined)

  const [selectedFontSize, setSelectedFontSize] = useState<number | undefined>(undefined)

  const [selectedColorTheme, setSelectedColorTheme] = useState<number | undefined>(undefined)

  const [selectedEssentialContactGrant, setSelectedEssentialContactGrant] = useState(false)

  useEffect(() => {
    const userTreatment = userSettings.service.getTreatment(userSettings, treatment.data)

    setSelectedTreatment(userTreatment)
  }, [treatment, userSettings])

  useEffect(() => {
    const language = userSettings.service.getLanguage(userSettings)

    setSelectedLanguage(language.NAVIGATOR_LANGUAGE_CODE)
  }, [userSettings])

  useEffect(() => {
    const fontSizeCode = userSettings.service.getFontSizeCode(userSettings)

    setSelectedFontSize(fontSizeCode)
  }, [userSettings])

  useEffect(() => {
    const colorThemeCode = userSettings.service.getColorThemeCode(userSettings)

    setSelectedColorTheme(colorThemeCode)
  }, [userSettings])

  useEffect(() => {
    const essentialContactGrant = userSettings.service.getEssentialContactGrant(userSettings)

    setSelectedEssentialContactGrant(essentialContactGrant)
  }, [userSettings])

  const handleCloseDialogs = () => {
    setDialogOpen(false)
  }

  const saveSettings = () => {
    if (currentSettings && selectedLanguage && selectedColorTheme && selectedFontSize) {
      currentSettings.language = selectedLanguage
      currentSettings.colorTheme = selectedColorTheme
      currentSettings.fontSize = selectedFontSize
      currentSettings.includeEssentialContact = selectedEssentialContactGrant
      currentSettings.syncGoogleContacts = false
      currentSettings.declineGoogleContacts = false
      currentSettings.firstSettingsDone = true
      currentSettings.treatmentLocalId  = selectedTreatment?.localId
    
      userSettings.service.save(currentSettings)
    } else if (currentSettings) {
      currentSettings.settingsStep = 0
  
      userSettings.service.saveLocally(currentSettings)
    }
  }

  const handleSave = () => {
    handleCloseDialogs()
    
    saveSettings()
  }

  const handleCancel = () => {
    handleCloseDialogs()
    AuthService.logout()
  }

  const handleBackStep = () => {
    if (currentSettings) {
      currentSettings.settingsStep = currentSettings.settingsStep - 1
  
      userSettings.service.save(currentSettings)
    }
  }

  const handleNextStep = () => {
    if (currentSettings) {
      currentSettings.settingsStep = currentSettings.settingsStep + 1
  
      userSettings.service.save(currentSettings)
    } else if (selectedLanguage && selectedFontSize && selectedColorTheme) {
      const newEntity: UserSettingsEntity = {
        language: selectedLanguage,
        fontSize: selectedFontSize,
        colorTheme: selectedColorTheme,
        includeEssentialContact: false,
        declineGoogleContacts: false,
        firstSettingsDone: false,
        syncGoogleContacts: false,
        settingsStep: 1
      } 
      userSettings.service.save(newEntity)
    }
  }

  const handleEssentialContactGrantChange = (includeEssentialContact: boolean) => {
    setSelectedEssentialContactGrant(includeEssentialContact)
  }

  const handleSelectedTreatmentChange = (newSelectedTreatment: TreatmentEntity) => {
    setSelectedTreatment(newSelectedTreatment)
  }

  const handleSelectedColorThemeChange = (newColorTheme: number) => {
    setSelectedColorTheme(newColorTheme)

    if (currentSettings && currentSettings.colorTheme !== newColorTheme) {
      currentSettings.colorTheme = newColorTheme
      userSettings.service.saveLocally(currentSettings)
    }
  }

  const handleSelectedLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage)

    if (currentSettings && currentSettings.language !== newLanguage) {
      currentSettings.language = newLanguage
      userSettings.service.saveLocally(currentSettings)
    }    
  }

  const handleSelectedFontSizeChange = (newFontSize: number) => {
    setSelectedFontSize(newFontSize)

    if (currentSettings && currentSettings.fontSize !== newFontSize) {
      currentSettings.fontSize = newFontSize
      userSettings.service.saveLocally(currentSettings)
    }
  }

  const renderSelectTreatmentDialogContent = () => {
    return (
      <SelectTreatment
        treatment={selectedTreatment}
        setTreatment={handleSelectedTreatmentChange}
        availableTreatments={treatment.data}
      >
        <DinoSwitch
          selected={selectedEssentialContactGrant}
          setSelected={handleEssentialContactGrantChange}
          label={language.SELECT_TREATMENT_LOAD_CONTACT_GRANT}
        />
      </SelectTreatment>
    )
  }

  const renderSelectColorThemeDialogContent = () => {
    return (
      <SelectColorTheme 
        colorTheme={selectedColorTheme} 
        setColorTheme={handleSelectedColorThemeChange}
      />
    )
  }

  const renderSelectLanguageDialogContent = () => {
    return (
      <>
      <SelectLanguage 
        languageName={selectedLanguage}
        setLanguage={handleSelectedLanguageChange}
      />
      <SelectFontSize 
        fontSize={selectedFontSize}
        setFontSize={handleSelectedFontSizeChange}
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
    { title: language.FIRST_LOGIN_CHOOSE_TREATMENT, component: renderSelectTreatmentDialogContent },
    { title: "", component: renderFinalMessageDialog },
  ]

  const NUMBER_DIALOGS = firstLoginDialogs.length

  const isFirstOrLastDialog = (index: number) => index === 0 || index === NUMBER_DIALOGS - 1

  const getDialog = (step: number) => {
    if (step < firstLoginDialogs.length) {
      return firstLoginDialogs[step]
    }
    return firstLoginDialogs[firstLoginDialogs.length - 1]
  }

  const renderDialogContent = () => {
    const step = currentSettings ? currentSettings.settingsStep : 0
    const dialog = getDialog(step)

    return (
      <>
            { isFirstOrLastDialog(step) ? 
              <></> :
              <DinoDialogHeader>
                <h5>{dialog.title}</h5>
              </DinoDialogHeader>
            }
            <DinoDialogContent>
              {dialog.component()}
            </DinoDialogContent>
    </>
    )
  }

  return (
    <>
          <Dialog
            className="first-login__dialog"
            aria-labelledby={language.FIRST_LOGIN_DIALOG_LABEL}
            open={dialogOpen}
            disableEscapeKeyDown
            disableBackdropClick
            fullWidth
          >
            {renderDialogContent()}
            <DialogActions>
              <DinoStepper 
                steps={NUMBER_DIALOGS}
                activeStep={currentSettings ? currentSettings.settingsStep : 0}
                onNext={handleNextStep}
                onBack={handleBackStep}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </DialogActions>
          </Dialog>
    </>
  )
}

export default FirstSettingsDialog