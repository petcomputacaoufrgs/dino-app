import React, { useState } from 'react';
import { useLanguage } from '../../../../provider/app_provider'
import Button from '@material-ui/core/Button';
import { Dialog, DialogActions, DialogContent, Divider } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Slide } from '@material-ui/core'
import ContactFormDialogHeader from './header/'
import ContactFormDialogContent from './content/'
import ContactFormDialogProps from './props'
import ContactsConstants from '../../../../constants/ContactsConstants'



const TransitionSlide = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} mountOnEnter unmountOnExit {...props} />;
})


const ContactFormDialog = (props: ContactFormDialogProps): JSX.Element => {

    const language = useLanguage().current

    const [dialCode, setDialCode] = useState("+55")
    const [validName, setValidName] = useState(true)
    const [validNumber, setValidNumber] = useState(true)

    const validInfo = (): boolean => {
        setValidName(props.name !== '')
        setValidNumber(props.number !== '')
        return props.name !== '' && props.number !== ''
    }

    const cleanInfo = () => {
        props.setName('')
        props.setNumber('')
        props.setType(ContactsConstants.MOBILE)
        props.setColor('')
        setValidName(true)
        setValidNumber(true)
    }


    const handleClose = () => {
        props.setDialogOpen(false)
    }
    const handleCancel = () => {
        props.setDialogOpen(false)
        cleanInfo()
    }
    const handleAdd = () => {
        if (validInfo()) {
            console.log(props.name, props.type, dialCode, props.number, props.color)
            handleClose()
            cleanInfo()
        }
    }
    const handleEdit = () => { }

    return (

        <Dialog
            fullWidth
            maxWidth='xs'
            onClose={handleClose}
            TransitionComponent={TransitionSlide}
            open={props.dialogOpen}
            aria-labelledby="form-dialog">
            <ContactFormDialogHeader
                name={props.name}
                type={props.type}
                color={props.color}
                setColor={props.setColor}
            />
            <Divider />
            <DialogContent>
                <ContactFormDialogContent
                    name={props.name}
                    setName={props.setName}
                    number={props.number}
                    setNumber={props.setNumber}
                    dialCode={dialCode}
                    setDialCode={setDialCode}
                    type={props.type}
                    setType={props.setType}
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
}


export default ContactFormDialog