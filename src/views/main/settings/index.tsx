import React, { useContext, useState } from 'react'
import { LanguageProviderContext, LanguageListProviderContext, LanguageSetProviderContext }
    from '../../../components/language_provider'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import './styles.css'

const Settings = (): JSX.Element => {

    const languageProvider = useContext(LanguageProviderContext)

    const languageList = useContext(LanguageListProviderContext)

    const setLanguageByCode = useContext(LanguageSetProviderContext)

    const [selectedLanguage, setSelectedLanguage] = useState(languageProvider.LANGUAGE_CODE)

    const onChangeLanguage = (event: any) => {
        if (event && event.target && event.target.value) {
            setSelectedLanguage(event.target.value as string)
            setLanguageByCode(event.target.value as string)
        }
    }

    return (
        <div className='settings'>
            <Typography className='settings__title' color="textSecondary" gutterBottom>
                {languageProvider.SETTINGS_TITLE}
            </Typography>
            <FormControl className='settings__language'>
                <InputLabel id="language-select-label">
                    {languageProvider.SETTINGS_LANGUAGE}
                </InputLabel>
                <Select
                    labelId="language-select-label"
                    id="language-select"
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
            </FormControl>
        </div>
    )
}

export default Settings