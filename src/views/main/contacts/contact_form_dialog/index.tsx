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
import strUtils from '../../../../utils/StringUtils'

const ContactFormDialog = React.forwardRef((props: ContactFormDialogProps, ref: React.Ref<unknown>): JSX.Element => {

    const language = useLanguage().current

    const [name, setName] = useState(props.name || '')
    const [description, setDescription] = useState(props.description || '')
    const [number, setNumber] = useState(props.phones ? props.phones[0].number : '')
    const [type, setType] = useState(props.phones ? props.phones[0].type : ContactsConstants.MOBILE)
    const [color, setColor] = useState(props.color || '')
    const [validName, setValidName] = useState(true)
    const [validNumber, setValidNumber] = useState(true)
    const [addPhoneAction, setAddPhoneAction] = useState(false)

    let secNumberValue = ''
    let secTypeValue = ContactsConstants.MOBILE
    if (props.action === 'edit') {
        if (props.phones && props.phones.length > 1) {
            secNumberValue = props.phones[1].number
            secTypeValue = props.phones[1].type
            console.log(secNumberValue)
        }
    }
    const [secNumber, setSecNumber] = useState(secNumberValue)
    const [secType, setSecType] = useState(secTypeValue)


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
        setAddPhoneAction(false)
        setValidName(true)
        setValidNumber(true)
    }
    const handleClose = () => {
        props.setDialogOpen(false)
    }
    const handleCancel = () => {
        handleClose()
        if (props.action === 'add')
            cleanInfo()
    }

    const getPhones = (): Array<PhoneModel> => {
        const phones = new Array<PhoneModel>({ number: number, type: type })
        if (addPhoneAction) {
            phones.push({ number: secNumber, type: secType })
            console.log(secNumber)
        }
        return phones
    }

    const handleAdd = () => {
        if (validInfo()) {
            let aux = strUtils.replaceNonDigits(number, '')
            console.log(aux)

            const item: ContactModel = {
                id: Number(aux),
                name: name,
                description: description,
                phones: getPhones(),
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
            const item: ContactModel = {
                id: props.id,
                name: name,
                description: description,
                phones: getPhones(),
                color: color
            }
            ContactsService.editContact(item)
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
                setAddPhoneAction={setAddPhoneAction}
            />
            <Divider />
            <DialogContent>
                <ContactFormDialogContent
                    open={props.dialogOpen}
                    name={name}
                    setName={setName}
                    description={description}
                    setDescription={setDescription}
                    number={number}
                    setNumber={setNumber}
                    type={type}
                    setType={setType}
                    addPhoneAction={addPhoneAction}
                    secNumber={secNumber}
                    setSecNumber={setSecNumber}
                    secType={secType}
                    setSecType={setSecType}
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