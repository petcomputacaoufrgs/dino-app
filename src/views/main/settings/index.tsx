import React, { useState } from 'react'
import { useApp } from '../../../provider/app_provider'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import AppSettingsModel from '../../../model/dino_api/settings/AppSettingsModel'
import SettingsLocalStorage from '../../../local_storage/SettingsLocalStorage'
import HistoryService from '../../../services/HistoryService'
import './styles.css'
import AppSettingsService from '../../../services/AppSettingsService'

const Settings = (): JSX.Element => {

    const appContext = useApp()

    const language = appContext.language.currentLanguage

    const alert = appContext.alert

    const languageList = appContext.language.getLanguageList()

    const [selectedLanguage, setSelectedLanguage] = useState(language.NAVIGATOR_LANGUAGE_CODE)

    const onChangeLanguage = (event: any) => {
        if (event && event.target && event.target.value) {
            setSelectedLanguage(event.target.value as string)
        }
    }

    const onSave = () => {
        const model: AppSettingsModel = {
            'language': selectedLanguage
        }

        SettingsLocalStorage.setAppSettings(model)
        AppSettingsService.update(model)

        appContext.language.updateLanguage()
        alert.showSuccessAlert(language.SETTINGS_SAVE_SUCCESS)
        
        HistoryService.goBack()
    }

    const renderSelectLanguage = (): JSX.Element => (
        <>
        <InputLabel id='language-select-label'>
            {language.SETTINGS_LANGUAGE}
        </InputLabel>
        <Select
            labelId='language-select-label'
            id='language-select'
            value={selectedLanguage}
            onChange={onChangeLanguage}
        >
            {languageList.map((language, index) => (
                <MenuItem 
                    key={index} 
                    value={language.code}
                >
                    {language.name}
                </MenuItem>
            ))}
        </Select>
        </>
    )

    const renderSaveButton = ():JSX.Element => (
        <div className='settings__save_button_container'>
            <Button
                variant='contained'
                color='primary'
                size='large'
                className='settings__save_button'
                startIcon={<SaveIcon />}
                onClick={onSave}
            >
                {language.SETTINGS_SAVE}
            </Button>
        </div>
    )

    return (
        <div className='settings'>
            <Typography className='settings__title' color='textSecondary' gutterBottom>
                {language.SETTINGS_TITLE}
            </Typography>
            <FormControl className='settings__form'>  
                {renderSelectLanguage()}
            </FormControl>
            {renderSaveButton()}
        </div>
    )
}

export default Settings