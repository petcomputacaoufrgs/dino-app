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

    const [name, setName] = useState(props.item?.name || '')
    const [description, setDescription] = useState(props.item?.description || '')
    const [number, setNumber] = useState(props.item?.phones ? props.item.phones[0].number : '')
    const [type, setType] = useState(props.item?.phones ? props.item.phones[0].type : ContactsConstants.MOBILE)
    const [color, setColor] = useState(props.item?.color || '')
    const [validName, setValidName] = useState(true)
    const [validNumber, setValidNumber] = useState(true)
    const [addPhoneAction, setAddPhoneAction] = useState(false)
    const [helperText, setHelperText] = useState('')

    let secNumberValue = ''
    let secTypeValue = ContactsConstants.MOBILE
    if (props.action === 'edit' && props.item) {
        if (props.item.phones.length > 1) {
            secNumberValue = props.item.phones[1].number
            secTypeValue = props.item.phones[1].type
        }
    }
    const [secNumber, setSecNumber] = useState(secNumberValue)
    const [secType, setSecType] = useState(secTypeValue)


    const validInfo = (): boolean => {
        setValidName(name !== '')
        setValidNumber(number !== '')
        return name !== '' && number !== ''
    }
    const cleanInfo = () => { //@TO-DO resolver essa bodega
        setNumber('')
        setName('')
        setType(ContactsConstants.MOBILE)
        setColor('')
        setAddPhoneAction(false)
        setValidName(true)
        setValidNumber(true)
        setHelperText('')
    }
    const handleClose = () => {
        props.setDialogOpen(0)
    }
    const handleCancel = () => {
        handleClose()
        if (props.action === 'add')
            cleanInfo()
    }

    const getPhones = (): Array<PhoneModel> => {
        const phones = new Array<PhoneModel>({ number: number, type: type })
        if (secNumber) {
            phones.push({ number: secNumber, type: secType })
            console.log(secNumber) //!!!!!!!!!
        }
        return phones
    }

    const getItem = (id: number): ContactModel => {
        const item: ContactModel = {
            id: id,
            name: name,
            description: description,
            phones: getPhones(),
            color: color
        }
        return item
    }

    const handleAdd = () => {
        if (validInfo()) {
            const item = getItem(Number(strUtils.replaceNonDigits(number, '')))
            console.log(item)
            const exists = ContactsService.checkUniquePhone(item.phones[0])
            if(!exists){
                ContactsService.addContact(item)
                handleClose()
                cleanInfo()
            }
            else{
                console.log("repetido")
                setValidNumber(false)
                setHelperText(`O número já está registrado no contato ${exists.name}`)
                
            } 
        }
    }

    const handleEdit = () => {
        if (props.item?.id) {
            const item = getItem(props.item.id)
            ContactsService.editContact(item)
        }
        handleClose()
        //cleanInfo()
    }

    return (

        <Dialog
            ref={ref}
            open={Boolean(props.dialogOpen)}
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
                    helperText={helperText}
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