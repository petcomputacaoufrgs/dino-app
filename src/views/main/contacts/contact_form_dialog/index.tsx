import React, { useState, forwardRef } from 'react';
import { useLanguage } from '../../../../provider/app_provider'
import Button from '@material-ui/core/Button';
import { Dialog, DialogActions, DialogContent, Divider } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Slide } from '@material-ui/core'
import ContactFormDialogHeader from './header/'
import ContactFormDialogContent from './content/'
import ContactFormDialogProps from './props'
import ContactsConstants from '../../../../constants/ContactsConstants'

const TransitionSlide = forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} mountOnEnter unmountOnExit {...props} />;
})

const ContactFormDialog = React.forwardRef((props: ContactFormDialogProps, ref: React.Ref<unknown>): JSX.Element => {

    const language = useLanguage().current

    const [name, setName] = useState(props.name || '')
    const [number, setNumber] = useState(props.phones ? props.phones[0].number : '')
    const [type, setType] = useState(props.phones ? props.phones[0].type : ContactsConstants.MOBILE)
    const [color, setColor] = useState(props.color || '')
    const [dialCode, setDialCode] = useState("+55")
    const [validName, setValidName] = useState(true)
    const [validNumber, setValidNumber] = useState(true)

    const validInfo = (): boolean => {
        setValidName(name !== '')
        setValidNumber(number !== '')
        return name !== '' && number !== ''
    }
    const cleanInfo = () => {
        setNumber('')
        setName('')
        setType(ContactsConstants.MOBILE)
        setColor('')
        setValidName(true)
        setValidNumber(true)
    }
    const handleClose = () => {
        props.setDialogOpen(false)
    }
    const handleCancel = () => {
        handleClose()
        cleanInfo()
    }
    const handleAdd = () => {
        if (validInfo()) {
            console.log(name, type, dialCode, number, color)
            handleClose()
            cleanInfo()
        }
    }
    const handleEdit = () => {
        console.log('aqui edita')
        handleAdd()
    }

    return (

        <Dialog
            ref={ref}
            open={props.dialogOpen}
            fullWidth
            maxWidth='xs'
            onClose={handleClose}
            TransitionComponent={TransitionSlide}
            aria-labelledby="form-dialog">
            <ContactFormDialogHeader
                action={props.action}
                name={name}
                type={type}
                color={color}
                setColor={setColor}
            />
            <Divider />
            <DialogContent>
                <ContactFormDialogContent
                    name={name}
                    setName={setName}
                    number={number}
                    setNumber={setNumber}
                    dialCode={dialCode}
                    setDialCode={setDialCode}
                    type={type}
                    setType={setType}
                    validName={validName}
                    validNumber={validNumber}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    aria-labelledby={language.DIALOG_CANCEL_BUTTON_LABEL}
                    onClick={handleCancel}
                    color="primary">
                    {language.DIALOG_CANCEL_BUTTON_TEXT}
                </Button>
                <Button
                    aria-labelledby={language.DIALOG_SAVE_BUTTON_LABEL}
                    onClick={props.action === "add" ? handleAdd : handleEdit}
                    color="primary">
                    {language.DIALOG_SAVE_BUTTON_TEXT}
                </Button>
            </DialogActions>
        </Dialog>
    )
})


export default ContactFormDialog