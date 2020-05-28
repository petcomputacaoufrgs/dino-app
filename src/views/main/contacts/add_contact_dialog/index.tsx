import React, { useState } from 'react';
import { useLanguage } from '../../../../provider/app_provider'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Dialog, DialogActions, DialogContent, MenuItem, DialogTitle, Divider } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Slide } from '@material-ui/core'


const TransitionSlide = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} mountOnEnter unmountOnExit {...props} />;
})


const FormDialog = (props: {
    dialogOpen: boolean,
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element => {

    const language = useLanguage().current

    const types = [
        { label: language.CONTACTS_MOBILE_PHONE },
        { label: language.CONTACTS_RESIDENTIAL_PHONE },
        { label: language.CONTACTS_PUBLIC_SERVICE_PHONE }
    ]

    const [name, setName] = useState('')
    const [number, setNumber] = useState('')
    const [type, setType] = useState(language.CONTACTS_MOBILE_PHONE)

    const handleChangeName = (event: React.ChangeEvent<{ value: string }>) => {
        setName(event.target.value as string)
    }
    const handleChangeNumber = (event: React.ChangeEvent<{ value: string }>) => {
        setNumber(event.target.value as string)
    }
    const handleChangeType = (event: React.ChangeEvent<{ value: string }>) => {
        setType(event.target.value as string)
    }

    const handleClose = () => props.setDialogOpen(false)
    const handleAdd = () => {
        console.log(name, type, number)
        handleClose()
    }

    return (

        <Dialog
            TransitionComponent={TransitionSlide}
            open={props.dialogOpen}
            aria-labelledby="form-dialog-title">
            <DialogTitle className="mb-2 text-muted" >{language.CONTACTS_ADD_CONTACT}</DialogTitle>
            <Divider />
            <DialogContent>
                <TextField
                    required
                    value={name}
                    onChange={handleChangeName}
                    autoFocus
                    margin="dense"
                    id="name"
                    label={language.FORM_NAME}
                    type="name"
                />
                <br />
                <TextField
                    id="select-type"
                    select
                    label={language.FORM_TYPE}
                    value={type}
                    onChange={handleChangeType}
                    helperText="Please select the phone type"
                >
                    {types.map((option) => (
                        <MenuItem key={option.label} value={option.label}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <br />
                <TextField
                    required
                    autoFocus
                    value={number}
                    onChange={handleChangeNumber}
                    margin="dense"
                    id="tel"
                    label={language.FORM_PHONE}
                    type="tel"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">{language.CANCEL_OPTION_TEXT}</Button>
                <Button onClick={handleAdd} color="primary">{language.ADD_OPTION_TEXT}</Button>
            </DialogActions>
        </Dialog>
    )
}


export default FormDialog