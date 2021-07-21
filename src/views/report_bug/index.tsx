import { Button } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import language from 'material-ui/svg-icons/action/language'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../context/language'
import "./styles.css"

const ReportBug: React.FC = () => {
    const language = useLanguage()
    const [error, setError] = useState<string>()
    const [value, setValue] = useState("")
    
    useEffect(() => {setError(undefined)
                     setValue("")}, [])

    const handleSave = () => {
        setError(language.data.INVALID_VALUE)
    }

    const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    return(
        <div className='report_bug'>
            <h3>Reportar o Problema</h3>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Provident esse modi veniam aperiam dicta reprehenderit maiores deleniti, error odit id possimus, ratione quod tempora, quis suscipit aliquid quisquam. Laboriosam, veritatis?</p>
            <TextField className='dino__textfield' fullWidth rows={10} multiline required error={error !== undefined} helperText={error}
                label={'qualquer coisa'}
                value={value}
                onChange={handleEventNameChange}
            />
            <h3>Reportar o Problema</h3>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Provident esse modi veniam aperiam dicta reprehenderit maiores deleniti, error odit id possimus, ratione quod tempora, quis suscipit aliquid quisquam. Laboriosam, veritatis?</p>
            <TextField fullWidth rows={10} multiline
                label={'qualquer coisa'}
                value={value}
                onChange={handleEventNameChange}
            />
            <Button className='settings__save_button' onClick={handleSave}>
                {language.data.SAVE}
            </Button>
        </div>
    )
}

export default ReportBug