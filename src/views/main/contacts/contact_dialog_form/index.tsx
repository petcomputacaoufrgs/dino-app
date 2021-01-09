import React, { useState, useEffect } from 'react'
import { ContactFormDialogProps } from './props'
import ColorConstants from '../../../../constants/app/ColorConstants'
import Button from '../../../../components/button/text_button'
import { Dialog, DialogActions, DialogContent } from '@material-ui/core'
import ContactFormDialogHeader from './header'
import ContactFormDialogContent from './content'
import TransitionSlide from '../../../../components/slide_transition'
import ContactEntity from '../../../../types/contact/database/ContactEntity'
import PhoneEntity from '../../../../types/contact/database/PhoneEntity'
import ContactsConstants from '../../../../constants/contact/ContactsConstants'
import StringUtils from '../../../../utils/StringUtils'
import ContactView from '../../../../types/contact/view/ContactView'
import Utils from '../../../../utils/Utils'
import { useLanguage } from '../../../../context/language'
import GoogleContactEntity from '../../../../types/contact/database/GoogleContactEntity'
import ContactService from '../../../../services/contact/ContactService'
import PhoneService from '../../../../services/contact/PhoneService'
import GoogleContactService from '../../../../services/contact/GoogleContactService'
import './styles.css'

const getContact = (item: ContactView | undefined): ContactEntity => {
  return item ? item.contact : {
      name: '',
      description: '',
      color: undefined,
    }
}

const getPhones = (item: ContactView | undefined): PhoneEntity[] => {
  return item ? item.phones : []
}

const ContactFormDialog = React.forwardRef(
  (
    {
      dialogOpen,
      onClose,
      action,
      item,
      items,
    }: ContactFormDialogProps,
    ref: React.Ref<unknown>
  ): JSX.Element => {
    const language = useLanguage()
    const [contact, setContact] = useState(getContact(item))
    const [contactPhones, setContactPhones] = useState(getPhones(item))
    const [phonesToDelete, setPhonesToDelete] = useState<PhoneEntity[]>([])
    const [invalidName, setInvalidName] = useState(false)
    const [invalidPhone, setInvalidPhone] = useState({number: '', text: ''})

    useEffect(() => {
      if (dialogOpen) {
        setContact(getContact(item))
        setContactPhones(getPhones(item))
        setInvalidName(false)
        setInvalidPhone({
          number: '',
          text: '',
        })
      }
    }, [dialogOpen, item])

    const handleSave = (): void => {
      function validInfo(): string {
        setInvalidName(StringUtils.isEmpty(contact.name))
        return contact.name
      }

      function handleTakenNumber(viewWithSamePhone: ContactView) {
        const phone = contactPhones.find((phone) =>
          viewWithSamePhone.phones
            .map((phone) => phone.number)
            .includes(phone.number)
        )
        if (phone)
          setInvalidPhone({
            number: phone.number,
            text: `${language.data.CONTACT_NUMBER_ALREADY_EXISTS} ${viewWithSamePhone.contact.name}`,
          })
      }

      if (validInfo()) {
        const viewWithSamePhone = PhoneService.getContactWithSamePhone(items, contactPhones, item)

        if (viewWithSamePhone) {
          handleTakenNumber(viewWithSamePhone)
        } else {
          saveContact()
          onClose()
        }
      }
    }

    const saveContact = async () => {
      if (action === ContactsConstants.ACTION_EDIT) {
        if (item && Utils.isNotEmpty(item.contact.localId)) {
          await ContactService.save(contact)
          await savePhones(contact)
        }
      } else if (action === ContactsConstants.ACTION_ADD) {
        const savedContact = await ContactService.save(contact)

        if (savedContact) {
          await savePhones(savedContact)
        }
      }
    }

    const savePhones = async (contact: ContactEntity) => {
      const newPhones = contactPhones.filter((phone) => phone.number !== '')
      newPhones.forEach((phone) => (phone.localContactId = contact.localId))
      if (newPhones.length > 0) {
        await PhoneService.saveAll(newPhones)
      }

      if (phonesToDelete.length > 0) {
        await PhoneService.deleteAll(phonesToDelete)
      }

      await saveGoogleContact(contact)
    }

    const saveGoogleContact = async (contact: ContactEntity) => {
      if (item && item.googleContact) {
        await GoogleContactService.save(item.googleContact)
      } else {
        const googleContact: GoogleContactEntity = {
          localContactId: contact.localId
        }

        await GoogleContactService.save(googleContact)
      }
    }

    const handleChangeColor = () => {
      const colors = ColorConstants.COLORS
      const index = colors.findIndex((c) => c === contact.color)
      const color = colors[(index + 1) % colors.length]
      setContact({ ...contact, color })
    }

    const handleAddPhone = () => {
      contactPhones.push({
        number: '',
        type: ContactsConstants.MOBILE,
      })
      setContactPhones([...contactPhones])
    }

    const handleDeletePhone = (number: string) => {
      const indexPhone = contactPhones.findIndex(
        (phone) => phone.number === number
      )
      phonesToDelete.push(contactPhones[indexPhone])
      contactPhones.splice(indexPhone, 1)
      setPhonesToDelete([...phonesToDelete])
      setContactPhones([...contactPhones])
    }

    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
      const name = event.target.value as string
      setContact({ ...contact, name })
    }

    const handleChangeDescription = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const description = event.target.value as string
      setContact({ ...contact, description })
    }

    const handleChangeType = (
      event: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => {
      contactPhones[index].type = Number(event.target.value)
      setContactPhones([...contactPhones])
    }

    const handleChangeNumber = (
      event: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => {
      contactPhones[index].number = event.target.value as string
      setContactPhones([...contactPhones])
    }

    return (
      <div className="contact__form">
        <Dialog
          ref={ref}
          style={{ margin: '0px' }}
          open={dialogOpen}
          maxWidth="xl"
          fullWidth
          onClose={onClose}
          TransitionComponent={TransitionSlide}
        >
          <ContactFormDialogHeader
            action={action}
            name={contact.name}
            color={contact.color}
            handleChangeColor={handleChangeColor}
            handleCloseDialog={onClose}
          />
          <DialogContent dividers>
            <ContactFormDialogContent
              name={contact.name}
              description={contact.description ? contact.description : ''}
              phones={contactPhones}
              helperText={invalidPhone}
              invalidName={invalidName}
              handleChangeName={handleChangeName}
              handleChangeDescription={handleChangeDescription}
              handleChangeType={handleChangeType}
              handleChangeNumber={handleChangeNumber}
              handleDeletePhone={handleDeletePhone}
              handleAddPhone={handleAddPhone}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>
              {language.data.DIALOG_CANCEL_BUTTON_TEXT}
            </Button>
            <Button onClick={handleSave}>
              {language.data.DIALOG_SAVE_BUTTON_TEXT}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
)

export default ContactFormDialog
