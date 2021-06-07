import React from 'react'
import DinoDialog, { DinoDialogHeader } from '../../../dialogs/dino_dialog'
import DinoLogoHeader from '../../../dino_logo_header'
import DinoStepper from '../../../dino_stepper'
import DinoSwitch from '../../../switch'
import SelectColorTheme from '../../select_color_theme'
import SelectFontSize from '../../select_font_size'
import SelectLanguage from '../../select_language'
import SelectTreatment from '../../select_treatment'
import { useLanguage } from '../../../../context/language'
import FirstSettingsDialogProps from './props'
import { FirstSettingsDialogsProps } from './props'

const Empty = () => <></>

export const firstSettingsDialogs: FirstSettingsDialogsProps[] = [
	{ 
		id: "WELCOME",
		component: Empty
	},
	{
		id: "LANGUAGE",
		component: Empty
	},
	{
		id: "COLOR THEME",
		component: Empty
	},
	{
		id: "TREATMENT",
		component: Empty
	},
	{
		id: "PASSWORD",
		component: Empty
	},
	{ 
		id: "FINAL",
		component: Empty
	},
]

const FirstSettingsDialog: React.FC<FirstSettingsDialogProps> = (props) => {
  
  const language = useLanguage()

  const renderSelectTreatmentDialogContent = () => {
    return (
      <div className='first_settings__message_dialog'>
        <SelectTreatment
          treatment={props.selectedTreatment}
          setTreatment={props.onSelectedTreatmentChange}
          availableTreatments={props.treatments}
        >
          <DinoSwitch
            selected={props.selectedEssentialContactGrant}
            setSelected={props.onEssentialContactGrantChange}
            label={language.data.SELECT_TREATMENT_LOAD_CONTACT_GRANT}
          />
        </SelectTreatment>
      </div>
    )
  }

  const renderSelectColorThemeDialogContent = () => {
    return (
      <div className='first_settings__message_dialog'>
        <SelectColorTheme
          colorTheme={props.selectedColorTheme}
          setColorTheme={props.onSelectedColorThemeChange}
        />
      </div>
    )
  }

  const renderSelectLanguageDialogContent = () => {
    return (
      <div className='first_settings__message_dialog'>
        <SelectLanguage
          languageName={props.selectedLanguage}
          setLanguage={props.onSelectedLanguageChange}
        />
        <SelectFontSize
          fontSize={props.selectedFontSize}
          setFontSize={props.onSelectedFontSizeChange}
        />
      </div>
    )
  }

  const renderWelcomeMessageDialog = () => {
    return (
      <div className='first_settings__message_dialog'>
        <DinoLogoHeader
          title={language.data.FIRST_LOGIN_WELCOME_MESSAGE}
          size='small'
        />
        <p>
          Mensagem do Dino Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Nisi illum officiis vero debitis quia nam iusto. Necessitatibus
          repudiandae ut labore!
        </p>
        <h6 className='citation'>— {language.data.DINOAPP_TEAM}</h6>
      </div>
    )
  }

  const renderSetPasswordDialog = () => {
    return (
      <div className='first_settings__message_dialog set_password'>
        <p>
          {language.data.SETTING_PASSWORD_EXPLANATION}
        </p>
        <form>
          <label htmlFor="pass">{language.data.INSERT_PASSWORD} </label>
          <input 
            autoComplete="off"
            value={props.parentsAreaPassword} 
            onChange={props.onChangePassword}
            type="password" 
            name="password" 
            required />
          <label htmlFor="pass"> {language.data.INSERT_PASSWORD_AGAIN} </label>
          <input 
            autoComplete="off"
            value={props.confirmParentsAreaPassword}
            onChange={props.onChangeConfirmPassword}
            type="password" 
            name="password" 
            required />
          {props.passwordErrorMessage && <p className="set_password__error_message">{props.passwordErrorMessage}</p>}
        </form>
      </div>
    )
  }

  //TODO: traduzir
  const renderFinalMessageDialog = () => {
    return (
      <div className='first_settings__message_dialog'>
        <DinoLogoHeader
          title={language.data.FIRST_LOGIN_DONE_MESSAGE}
          size='small'
        />
        <p>Obrigado por se juntar ao DinoApp!</p>
        <p>
          Suas configurações podem ser atualizadas a qualquer momento na aba de{' '}
          <em>Configurações</em>
        </p>
      </div>
    )
  }
  
  const firstSettingsDialogComponents = [
    { component: renderWelcomeMessageDialog },
    {
      title: language.data.FIRST_LOGIN_CHOOSE_LANGUAGE,
      component: renderSelectLanguageDialogContent,
    },
    {
      title: language.data.FIRST_LOGIN_CHOOSE_COLOR_THEME,
      component: renderSelectColorThemeDialogContent,
    },
    {
      title: language.data.FIRST_LOGIN_CHOOSE_TREATMENT,
      component: renderSelectTreatmentDialogContent,
    },
    {
      title: 'Crie uma senha para a área dos responsáveis', 
      component: renderSetPasswordDialog,
    },
    { component: renderFinalMessageDialog },
  ]

  firstSettingsDialogs.forEach((d, index) => {
    d.component = firstSettingsDialogComponents[index].component
    d.title = firstSettingsDialogComponents[index].title
  })

  const LAST_DIALOG = firstSettingsDialogs.length - 1

  const getDialog = () => {
    if (props.step > -1 && props.step <= LAST_DIALOG) {
      return firstSettingsDialogs[props.step]
    }
    return firstSettingsDialogs[LAST_DIALOG]
  }

  const renderDialogHeader = () => {

    const isFirstOrLastDialog = props.step === 0 || props.step === LAST_DIALOG

    return !isFirstOrLastDialog && <DinoDialogHeader>{getDialog().title || ''}</DinoDialogHeader>
  }

  return (
    <DinoDialog
      aria-labelledby={language.data.FIRST_LOGIN_DIALOG_LABEL}
      open={props.step > -1}
      onSave={props.onSave}
      onClose={props.onCloseDialogs}
      header={renderDialogHeader()}
      actions={
        <DinoStepper
          steps={LAST_DIALOG}
          activeStep={props.step}
          onNext={props.onNextStep}
          onBack={props.onBackStep}
          onEnd={props.onSave}
          onCancel={props.onCancel}
          endMessage={language.data.SAVE}
        />
      }
    >
      {getDialog().component()}
    </DinoDialog>
  )

}

export default FirstSettingsDialog