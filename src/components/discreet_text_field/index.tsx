import React, { useState } from 'react'
import './styles.css'
import DiscreetTextFieldProps from './props'
import { TextField } from '@material-ui/core'

const DiscreetTextField: React.FC<DiscreetTextFieldProps> = ({
    className,
    onChange,
    text,
    error,
    helperText
}) => {
    const [writing, setWriting] = useState(false)

    const handleFocus = () => {
        setWriting(true)
    }

    const handleBlur = () => {
        setWriting(false)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value

        onChange(value)
    }

    return (
        <TextField
            error={error}
            helperText={helperText}
            type="text"
            multiline
            variant="standard"
            value={text}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`discreet_text_field${writing ? '' : ' remove_underline'}${className ? ' ' + className : ''}`}
        />
    )
}

export default DiscreetTextField