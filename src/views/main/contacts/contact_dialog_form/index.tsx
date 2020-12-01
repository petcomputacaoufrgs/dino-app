import React, { useState, useEffect } from 'react'
import { ContactFormDialogProps } from './props'
import Constants from '../../../../constants/contact/ContactsConstants'
import Service from '../../../../services/contact/ContactService'
import ContactModel from '../../../../types/contact/ContactModel'
import PhoneModel from '../../../../types/contact/PhoneModel'
import ColorConstants from '../../../../constants/app/ColorConstants'
import Button from '../../../../components/button/text_button'
import { Dialog, DialogActions, DialogContent } from '@material-ui/core'
import ContactFormDialogHeader from './header'
import ContactFormDialogContent from './content'
import TransitionSlide from '../../../../components/slide_transition'
import { useCurrentLanguage } from '../../../../context/provider/app_settings'
import './styles.css'

const getContact = (item: ContactModel | undefined) => {
  return {
    name: item?.name || '',
    description: item?.description || '',
    color: item?.color,
  }
}

const getPhones = (item: ContactModel | undefined) => {
  return item
    ? item.phones
    : [JSON.parse(Constants.DEFAULT_PHONE) as PhoneModel]
}

const ContactFormDialog = React.forwardRef(
  (
    { dialogOpen, onClose: handleClose, action, item }: ContactFormDialogProps,
    ref: React.Ref<unknown>
  ): JSX.Element => {
    const language = useCurrentLanguage()

    useEffect(() => {
      if (dialogOpen) {
        setContact(getContact(item))
        setPhones(getPhones(item))
        setInvalidName(false)
        setInvalidPhone(JSON.parse(Constants.DEFAULT_INVALID_PHONE))
      }
    }, [dialogOpen, item])

    const [contact, setContact] = useState(getContact(item))
    const [phones, setPhones] = useState(getPhones(item))
    const [invalidName, setInvalidName] = useState(false)
    const [invalidPhone, setInvalidPhone] = useState(
      JSON.parse(Constants.DEFAULT_INVALID_PHONE)
    )

    const handleSave = (): void => {
      function validInfo(): string {
        setInvalidName(contact.name === '')
        return contact.name
      }

      function handleTakenNumber(item: ContactModel, exists: ContactModel) {
        const phone = item.phones.find((phone) =>
          exists.phones.map((phone) => phone.number).includes(phone.number)
        )
        if (phone)
          setInvalidPhone({
            number: phone.number,
            text: `${language.CONTACT_NUMBER_ALREADY_EXISTS} ${exists.name}`,
          })
      }

      function makeItem(): ContactModel {
        const frontId =
          item !== undefined ? item.frontId : Service.makeFrontId()
        return {
          frontId,
          id: item?.id,
          name: contact.name,
          description: contact.description,
          color: contact.color,
          phones: phones.filter((phone) => phone.number !== ''),
        }
      }

      if (validInfo()) {
        const newItem = makeItem()
        const exists = Service.findItemByPhones(newItem.phones)

        if (action === Constants.ACTION_EDIT) {
          if (!exists || exists.frontId === newItem.frontId) {
            Service.editContact(newItem)
            handleClose()
          } else handleTakenNumber(newItem, exists)
        } else {
          if (!exists) {
            Service.addContact(newItem)
            handleClose()
          } else handleTakenNumber(newItem, exists)
        }
      }
    }

    const handleChangeColor = () => {
      const colors = ColorConstants.COLORS
      const index = colors.findIndex((c) => c === contact.color)
      const color = colors[(index + 1) % colors.length]
      setContact({ ...contact, color })
    }

    const handleAddPhone = () => {
      phones.push(JSON.parse(Constants.DEFAULT_PHONE))
      setPhones([...phones])
    }

    const handleDeletePhone = (number: string) => {
      const indexPhone = phones.findIndex((phone) => phone.number === number)
      phones.splice(indexPhone, 1)
      setPhones([...phones])
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
      phones[index].type = Number(event.target.value)
      setPhones([...phones])
    }

    const handleChangeNumber = (
      event: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => {
      phones[index].number = event.target.value as string
      setPhones([...phones])
    }

    return (
      <div className="contact__form">
        <Dialog
          ref={ref}
          style={{ margin: '0px' }}
          open={dialogOpen}
          maxWidth="xl"
          fullWidth
          onClose={handleClose}
          TransitionComponent={TransitionSlide}
        >
          <ContactFormDialogHeader
            action={action}
            name={contact.name}
            color={contact.color}
            handleChangeColor={handleChangeColor}
            handleCloseDialog={handleClose}
          />
          <DialogContent dividers>
            <ContactFormDialogContent
              name={contact.name}
              description={contact.description}
              phones={phones}
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
            <Button onClick={handleClose}>
              {language.DIALOG_CANCEL_BUTTON_TEXT}
            </Button>
            <Button onClick={handleSave}>
              {language.DIALOG_SAVE_BUTTON_TEXT}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
)

export default ContactFormDialog
