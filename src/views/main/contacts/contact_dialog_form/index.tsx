import React, { useState } from 'react'
import { useLanguage } from '../../../../provider/app_provider'
import Button from '@material-ui/core/Button'
import { Dialog, DialogActions, DialogContent, Divider } from '@material-ui/core'
import ContactFormDialogHeader from './header'
import ContactFormDialogContent from './content'
import ContactFormDialogProps from './props'
import Constants from '../../../../constants/ContactsConstants'
import TransitionSlide from '../../../../components/slide_transition'
import Service from '../../../../services/contact/ContactsService'
import ContactModel from '../../../../types/contact/ContactModel'

const ContactFormDialog = React.forwardRef((props: ContactFormDialogProps, ref: React.Ref<unknown>): JSX.Element => {

    const language = useLanguage().current

    const [name, setName] = useState(props.item?.name || '')
    const [description, setDescription] = useState(props.item?.description || '')
    const [color, setColor] = useState(props.item?.color || '')
    const [invalidName, setInvalidName] = useState(false)
    const [invalidPhone, setInvalidPhone] = useState({number: 'invalid', text: ''})
    const [phones, setPhones] = useState(props.item ? props.item.phones : [{type: Constants.MOBILE, number: ''}])
    const [addPhone, setAddPhone] = useState(false)

    const cleanInfo = () => { //@TO-DO resolver essa bodega
        setName('')
        setPhones([{type: Constants.MOBILE, number: ''}])
        setColor('')
        setAddPhone(false)
        setInvalidName(false)
        setInvalidPhone({number: 'invalid', text: ''})
    }

    const handleClose = () => props.setDialogOpen(0)

    const handleDeletePhone = (number: string) => {
        const indexPhone = phones.findIndex(phone => phone.number === number)
        phones.splice(indexPhone, 1)
        setPhones([...phones])
    }

    const handleSave = () => {

        const validInfo = () => {
            setInvalidName(name === '')
            return name
        }
        const handleTakenNumber = (item: ContactModel, exists: ContactModel) => {     
            const phone = item.phones.find(phone => exists.phones.map(phone => phone.number).includes(phone.number))
            if(phone) setInvalidPhone({number:phone.number,text:`O número já está registrado no contato ${exists.name}`})
        }
        const makeItem = (id = Service.makeId()): ContactModel => {
            return {
                localID: id,
                name: name,
                description: description,
                phones: phones.filter(phone => phone.number !== ''),
                color: color
            }
        }
        if (validInfo()){
            if (props.action === Constants.ACTION_EDIT && props.item) {
                const item = makeItem(props.item.localID)
                const exists = Service.findPhone(item.phones)
                if(!exists || exists.localID === item.localID){
                    Service.editContact(item)
                    handleClose()
                }
                else handleTakenNumber(item, exists)
            } else {
                const item = makeItem()
                const exists = Service.findPhone(item.phones)
                if(!exists) {
                    Service.addContact(item)
                    cleanInfo()
                    handleClose()
                }
                else handleTakenNumber(item, exists)
            }
        }
    }

    return (
        <Dialog
            ref={ref}
            open={Boolean(props.dialogOpen)}
            fullWidth
            onClose={handleClose}
            TransitionComponent={TransitionSlide}
            aria-labelledby="form-dialog">
            <ContactFormDialogHeader
                action={props.action}
                name={name}
                phones={phones}
                color={color}
                setColor={setColor}
                setAddPhoneAction={setAddPhone}
            />
            <Divider />
            <DialogContent>
                <ContactFormDialogContent 
                    values={{name,description, phones, addPhone, invalidName, helperText: invalidPhone}}
                    sets={{setName, setDescription, setPhones, setAddPhone}}
                    handleDeletePhone={handleDeletePhone}
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