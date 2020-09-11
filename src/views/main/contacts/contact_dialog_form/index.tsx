import React, { useState, useEffect } from 'react'
import { ContactFormDialogProps } from './props'
import Constants from '../../../../constants/ContactsConstants'
import Service from '../../../../services/contact/ContactService'
import ContactModel from '../../../../types/contact/ContactModel'
import PhoneModel from '../../../../types/contact/PhoneModel'
import ColorConstants from '../../../../constants/ColorConstants'
import View from './view'

const ContactFormDialog = ({ dialogOpen, onClose: handleClose, action, item }: ContactFormDialogProps): JSX.Element => {

  const getContact = () => {
    console.log("aaaa")
    return {
      name: item?.name || '',
      description: item?.description || '',
      color: item?.color || '',
    }
  }

  const getPhones = () => {
    return item ? item.phones : [JSON.parse(Constants.DEFAULT_PHONE) as PhoneModel]
  }

  useEffect(() => {
    if(dialogOpen) {
      setContact(getContact())
      setPhones(getPhones())
      setInvalidName(false)
      setInvalidPhone(JSON.parse(Constants.DEFAULT_INVALID_PHONE))
    } 
  }, [dialogOpen, item])

  const [contact, setContact] = useState(getContact())
  const [phones, setPhones] = useState(getPhones())
  const [invalidName, setInvalidName] = useState(false)
  const [invalidPhone, setInvalidPhone] = useState(JSON.parse(Constants.DEFAULT_INVALID_PHONE))

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
          text: `O número já está registrado no contato ${exists.name}`,
        })
    }

    function makeItem(): ContactModel {
      const frontId = item !== undefined ? item.frontId : Service.makeFrontId()
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
    setContact({...contact, color})
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
    setContact({...contact, name})
  }

  const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    const description = event.target.value as string
    setContact({...contact, description})

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
    <View
      open={dialogOpen}
      handleClose={handleClose}
      action={action}
      contact={contact}
      phones={phones}
      invalidName={invalidName}
      invalidPhone={invalidPhone}
      handleChangeName={handleChangeName}
      handleChangeDescription={handleChangeDescription}
      handleChangeNumber={handleChangeNumber}
      handleChangeType={handleChangeType}
      handleChangeColor={handleChangeColor}
      handleAddPhone={handleAddPhone}
      handleDeletePhone={handleDeletePhone}
      handleSave={handleSave}
    />
  )
}

export default ContactFormDialog
