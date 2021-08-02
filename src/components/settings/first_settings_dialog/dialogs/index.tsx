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
import { HasStaffPowers } from '../../../../context/private_router'
import DataConstants from '../../../../constants/app_data/DataConstants'
import SyncStateEnum from '../../../../types/sync/SyncStateEnum'
import SyncInfo from '../../../sync_info'

const FirstSettingsDialog: React.FC<FirstSettingsDialogProps> = (props) => {
  
  const language = useLanguage()

  const isStaff = HasStaffPowers()

  const renderFirstSettingsDialogs = (): FirstSettingsDialogsProps[] => {

    const finalDialog: FirstSettingsDialogsProps = {
      id: "FINAL",
      title: language.data.FIRST_LOGIN_DONE_MESSAGE,
      component: renderFinalMessageDialog
    }

		const basicDialogs: FirstSettingsDialogsProps[] = [
      {
        id: "INTRO",
        title: language.data.PWA_INTRO_TITLE_0,
        component: renderIntro,
      },
      {
        id: "NO INTERNET",
        title: language.data.PWA_INTRO_TITLE_1,
        component: renderNoInternet,
      },
      {
        id: "DINO CLOUD",
        title: language.data.PWA_INTRO_TITLE_2,
        component: dinoCloud,
      },
      {
        id: "DINO CLOUD ICONS",
        title: language.data.PWA_INTRO_TITLE_3,
        component: dinoCloudIcons,
      },
      {
        id: "LANGUAGE",
        title: language.data.FIRST_LOGIN_CHOOSE_LANGUAGE,
        component: renderSelectLanguageDialogContent,
      },
      {
        id: "COLOR THEME",
        title: language.data.FIRST_LOGIN_CHOOSE_COLOR_THEME,
        component: renderSelectColorThemeDialogContent,
      }
    ]

    const userLockedDialogs: FirstSettingsDialogsProps[] = [
			{
				id: "TREATMENT",
				title: language.data.FIRST_LOGIN_CHOOSE_TREATMENT,
      	component: renderSelectTreatmentDialogContent,
			}
      // ,
			// {
			// 	id: "PASSWORD",
			// 	title: language.data.FIRST_LOGIN_CHOOSE_PASSWORD, 
      // 	component: renderSetPasswordDialog,
			// }
		]

    let dialogs = basicDialogs

    if(!isStaff) dialogs = dialogs.concat(userLockedDialogs)

    return dialogs.concat(finalDialog)
	}

  const renderIntro = () => (
		<div className='first_settings__message_dialog'>
			<p>{language.data.PWA_INTRO_0_TEXT_1}</p>
			<p>{language.data.PWA_INTRO_0_TEXT_2}</p>
		</div>
	)

  const renderNoInternet = () =>  (
		<div className='first_settings__message_dialog'>
			<p>{language.data.PWA_INTRO_1_TEXT_1}</p>
			<p>{language.data.PWA_INTRO_1_TEXT_2}</p>
		</div>
	)

  const dinoCloud = () => (
		<div className='first_settings__message_dialog'>
			<p>{language.data.PWA_INTRO_2_TEXT_1}</p>
			<p>{language.data.PWA_INTRO_2_TEXT_2}</p>
		</div>
	)

  const dinoCloudIcons = () => (
		<div className='first_settings__message_dialog'>
			<p>{language.data.PWA_INTRO_3_TEXT_1}</p>
			<div className='first_settings__message_dialog__sync_item'>
				<SyncInfo state={SyncStateEnum.NOT_SYNCED}/>
				<p>{language.data.PWA_INTRO_3_TEXT_2}</p>
			</div>
			<div className='first_settings__message_dialog__sync_item'>
				<SyncInfo state={SyncStateEnum.SYNCHRONIZING}/>
				<p>{language.data.PWA_INTRO_3_TEXT_3}</p>
			</div>
			<div className='first_settings__message_dialog__sync_item'>
				<SyncInfo state={SyncStateEnum.SYNCED}/>
				<p>{language.data.PWA_INTRO_2_TEXT_4}</p>
			</div>
		</div>
	)

  const renderSelectTreatmentDialogContent = () => {
    return (
      <div style={{paddingBottom: "16px"}} className='first_settings__message_dialog'>
        <SelectTreatment
          treatment={props.selectedTreatment}
          setTreatment={props.onSelectedTreatmentChange}
          availableTreatments={props.treatments}
        >
          {!isStaff &&
            <DinoSwitch
              selected={props.selectedEssentialContactGrant}
              onChangeSelected={() => props.onEssentialContactGrantChange(!props.selectedEssentialContactGrant)}
              label={language.data.SELECT_TREATMENT_LOAD_CONTACT_GRANT}
          />}
        </SelectTreatment>
      </div>
    )
  }

  const renderSelectColorThemeDialogContent = () => {
    return (
      <div style={{paddingBottom: "16px"}} className='first_settings__message_dialog' >
        <SelectColorTheme
          colorTheme={props.selectedColorTheme}
          setColorTheme={props.onSelectedColorThemeChange}
        />
      </div>
    )
  }

  const renderSelectLanguageDialogContent = () => {
    return (
      <div style={{paddingBottom: "16px"}} className='first_settings__message_dialog'>
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

  //TODO repetido
  const renderSetPasswordDialog = () => {
    return (
      <div style={{paddingBottom: "16px"}} className='first_settings__message_dialog set_password'>
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

  const renderFinalMessageDialog = () => {
    return (
      <div className='first_settings__message_dialog'>
        <p>{language.data.FIRST_LOGIN_THANK_YOU_FOR_JOINING_MESSAGE}</p>
        <p>{language.data.FIRST_LOGIN_CONFIGURATIONS_MESSAGE}</p>
      </div>
    )
  }

  const dialogs = renderFirstSettingsDialogs()

  const LAST_DIALOG = dialogs.length - 1

  const getDialog = () => {
    if (props.step > -1 && props.step <= LAST_DIALOG) {
      return dialogs[props.step]
    }
    return dialogs[LAST_DIALOG]
  }

  const renderDialogHeader = () => <DinoDialogHeader>{getDialog().title}</DinoDialogHeader>

  const isValidPassword = () => {

		if (props.parentsAreaPassword.length < DataConstants.USER_PASSWORD.MIN) {
			props.onPasswordErrorMessageChange(language.data.PASSWORD_MIN_LENGHT_ERROR_MESSAGE)
      return false
		}
	
		if (props.parentsAreaPassword !== props.confirmParentsAreaPassword) {
			props.onPasswordErrorMessageChange(language.data.PASSWORD_CONFIRM_LENGHT_ERROR_MESSAGE)
      return false
		}
	
		props.onPasswordErrorMessageChange(undefined)
    return true
	}

  const handleEnd = () => {
    if(props.step === LAST_DIALOG) {
      props.onDoneChange(true)
    }
    props.onSave()
  }

  const handleNextStep = () => {
    const passwordIndex = dialogs.findIndex(d => d.id === "PASSWORD")

    if(props.step !== passwordIndex || isValidPassword())
      props.onNextStep()
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
          steps={LAST_DIALOG + 1}
          activeStep={props.step}
          onNext={handleNextStep}
          onBack={props.onBackStep}
          onEnd={handleEnd}
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