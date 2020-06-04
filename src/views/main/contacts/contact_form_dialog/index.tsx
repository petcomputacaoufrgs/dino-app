import React, { useState } from 'react'
import { useLanguage } from '../../../../provider/app_provider'
import Button from '@material-ui/core/Button'
import { Dialog, DialogActions, DialogContent, Divider } from '@material-ui/core'
import ContactFormDialogHeader from './header/'
import ContactFormDialogContent from './content/'
import ContactFormDialogProps from './props'
import ContactsConstants from '../../../../constants/ContactsConstants'
import TransitionSlide from '../../../../components/slide_transition'
import ContactsService from '../../../../services/contact/ContactsService'
import ContactModel from '../../../../services/contact/api_model/ContactModel'
import PhoneModel from '../../../../services/contact/api_model/PhoneModel'



const ContactFormDialog = React.forwardRef((props: ContactFormDialogProps, ref: React.Ref<unknown>): JSX.Element => {

    const language = useLanguage().current

    const onlyNumber = (phone: PhoneModel): string => {
        return phone.number.substr(phone.number.indexOf(' ') + 1)
    }

    const onlyDialCode = (phone: PhoneModel): string => {
        return phone.number.substr(0, phone.number.indexOf(' '))
    }

    const [name, setName] = useState(props.name || '')
    const [number, setNumber] = useState(props.phones ? onlyNumber(props.phones[0]) : '')
    const [type, setType] = useState(props.phones ? props.phones[0].type : ContactsConstants.MOBILE)
    const [color, setColor] = useState(props.color || '')
    const [dialCode, setDialCode] = useState(props.phones ? onlyDialCode(props.phones[0]) : '+55')
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
            let aux = number.replace(/[^0-9]/g, "")
            console.log(aux)

            const item: ContactModel = {
                id: Number(aux),
                name: name,
                phones: [{ number: dialCode + " " + number, type: type }],
                color: color

            }
            ContactsService.addContact(item)
            console.log(item)
            handleClose()
            cleanInfo()
        }
    }

    const handleEdit = () => {
        if (props.id) {
            console.log(props.id)
            ContactsService.editContact(props.id, name, dialCode, { number: number, type: type }, color)
        }
        handleClose()
        cleanInfo()
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