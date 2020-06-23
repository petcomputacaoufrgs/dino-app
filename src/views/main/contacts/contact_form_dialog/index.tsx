import React, { useState } from 'react'
import { useLanguage } from '../../../../provider/app_provider'
import Button from '@material-ui/core/Button'
import { Dialog, DialogActions, DialogContent, Divider } from '@material-ui/core'
import ContactFormDialogHeader from './header/'
import ContactFormDialogContent from './content/'
import ContactFormDialogProps from './props'
import ContactsConstants from '../../../../constants/ContactsConstants'
import TransitionSlide from '../../../../components/slide_transition'
import Service from '../../../../services/contact/ContactsService'
import ContactModel from '../../../../services/contact/api_model/ContactModel'
import PhoneModel from '../../../../services/contact/api_model/PhoneModel'

const ContactFormDialog = React.forwardRef((props: ContactFormDialogProps, ref: React.Ref<unknown>): JSX.Element => {

    const language = useLanguage().current

    const [name, setName] = useState(props.item?.name || '')
    const [description, setDescription] = useState(props.item?.description || '')
    const [number, setNumber] = useState(props.item?.phones ? props.item.phones[0].number : '')
    const [type, setType] = useState(props.item?.phones ? props.item.phones[0].type : ContactsConstants.MOBILE)
    const [color, setColor] = useState(props.item?.color || '')
    const [invalidName, setInvalidName] = useState(false)
    const [invalidNumber, setInvalidNumber] = useState('invalid')
    const [helperText, setHelperText] = useState('')
    
    let secNumberValue = ''
    let secTypeValue = ContactsConstants.MOBILE
    if (props.action === 'edit' && props.item)
    if (props.item.phones.length > 1) {
        secNumberValue = props.item.phones[1].number
        secTypeValue = props.item.phones[1].type
    }
    const [secNumber, setSecNumber] = useState(secNumberValue)
    const [secType, setSecType] = useState(secTypeValue)
    const [addPhone, setAddPhone] = useState(Boolean(secNumber))

    const cleanInfo = () => { //@TO-DO resolver essa bodega
        setNumber('')
        setName('')
        setType(ContactsConstants.MOBILE)
        setColor('')
        setAddPhone(false)
        setInvalidName(false)
        setInvalidNumber('invalid')
        setHelperText('')
    }

    const handleClose = () => props.setDialogOpen(0)

    const makeItem = (id = Service.makeId()): ContactModel => {
        const getPhones = (): Array<PhoneModel> => {
            const phones = new Array<PhoneModel>({ number: number, type: type })
            if (secNumber) 
                phones.push({ number: secNumber, type: secType })
            return phones
        }
        return {
            id: id,
            name: name,
            description: description,
            phones: getPhones(),
            color: color
        }
    }

    const handleSave = () => {

        const validInfo = () => {
            setInvalidName(name === '')
            setInvalidNumber(number ? '' : number)
            return name && number
        }
        const handleTakenNumber = (item: ContactModel, exists: ContactModel) => {        
            if(exists.phones.some(phone => phone.number === item.phones[0].number))
                setInvalidNumber(item.phones[0].number)
            else 
                setInvalidNumber(item.phones[1].number)
            setHelperText(`O número já está registrado no contato ${exists.name}`)
        }
        if (validInfo()){
            if (props.item?.id) {
                const item = makeItem(props.item.id)
                const exists = Service.findPhone(item.phones)
                if(!exists || exists.id === item.id)
                    Service.editContact(item)
                else handleTakenNumber(item, exists)
            } else {
                
                    const item = makeItem()
                    const exists = Service.findPhone(item.phones)
                    if(!exists) {
                        Service.addContact(item)
                        cleanInfo()
                    }
                    else handleTakenNumber(item, exists)
            }
            handleClose()
        }
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
                setAddPhoneAction={setAddPhone}
            />
            <Divider />
            <DialogContent>
                <ContactFormDialogContent 
                    values={{name,description, number, type, addPhone, secNumber, secType, invalidName, invalidNumber, helperText}}
                    sets={{setName, setDescription, setNumber, setType, setSecNumber, setSecType,}}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    aria-labelledby={language.DIALOG_CANCEL_BUTTON_LABEL}
                    onClick={handleClose}
                    color="primary">
                    {language.DIALOG_CANCEL_BUTTON_TEXT}
                </Button>
                <Button
                    aria-labelledby={language.DIALOG_SAVE_BUTTON_LABEL}
                    onClick={handleSave}
                    color="primary">
                    {language.DIALOG_SAVE_BUTTON_TEXT}
                </Button>
            </DialogActions>
        </Dialog>
    )
})


export default ContactFormDialog