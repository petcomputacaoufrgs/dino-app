import React, { useState } from 'react'
import { ContactFormDialogProps } from './props'
import Constants from '../../../../constants/ContactsConstants'
import Service from '../../../../services/contact/ContactsService'
import ContactModel from '../../../../types/contact/ContactModel'
import View from './view'

const ContactFormDialog = React.forwardRef(
  ({ dialogOpen, setDialogOpen, action, item } : ContactFormDialogProps,
    ref: React.Ref<unknown>): JSX.Element => {

    const [name, setName] = useState(item?.name || '')
    const [description, setDescription] = useState(item?.description || '')
    const [color, setColor] = useState(item?.color || '')
    const [invalidName, setInvalidName] = useState(false)
    const [invalidPhone, setInvalidPhone] = useState(Constants.DEFAULT_INVALID_PHONE)
    const [phones, setPhones] = useState(item ? item.phones : [Constants.DEFAULT_PHONE])

    const cleanInfo = () => {
      //TO-DO: resolver essa bodega
      setName('')
      setPhones([Constants.DEFAULT_PHONE])
      setColor('')
      setInvalidName(false)
      setInvalidPhone(Constants.DEFAULT_INVALID_PHONE)
    }

    const handleClose = () => setDialogOpen(0)

    const handleSave = () => {

      function validInfo(): string {
        setInvalidName(name === '')
        return name
      }
      function handleTakenNumber(item: ContactModel, exists: ContactModel) {
        const phone = item.phones.find((phone) =>
          exists.phones.map((phone) => phone.number).includes(phone.number)
        )
        if (phone)
          setInvalidPhone({number: phone.number, text: `O número já está registrado no contato ${exists.name}`})
      }
      function makeItem(frontId = Service.makeId()): ContactModel {
        return { frontId, name, description, phones: phones.filter(phone => phone.number !== ''), color }
      }

      if (validInfo()) {
        if (action === Constants.ACTION_EDIT && item) {

          const newItem = makeItem(item.frontId)
          const exists = Service.findPhone(newItem.phones)

          if (!exists || exists.frontId === newItem.frontId) {
            Service.editContact(newItem)
            handleClose()
          } else handleTakenNumber(newItem, exists)

        } else {

          const newItem = makeItem()
          const exists = Service.findPhone(newItem.phones)
          if (!exists) {
            Service.addContact(newItem)
            cleanInfo()
            handleClose()
          } else handleTakenNumber(newItem, exists)
        }
      }
    }

    const handleChangeColor = () => {
      const colors = Object.values(Constants.COLORS)
      colors.forEach((colorObj, i) => {
        if (colorObj === color) 
          setColor(colors[(i + 1) % colors.length])
      })
    }

    const handleAddPhone = () => {
      phones.push(Constants.DEFAULT_PHONE)
      setPhones([...phones])
    }
    const handleDeletePhone = (number: string) => {
      const indexPhone = phones.findIndex((phone) => phone.number === number)
      phones.splice(indexPhone, 1)
      setPhones([...phones])
    }
    const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value as string)
    }
    const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
      setDescription(event.target.value as string)
    }
    const handleChangeType = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      phones[index].type = Number(event.target.value)
      setPhones([...phones])
    }
    const handleChangeNumber = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
      phones[index].number = event.target.value as string
      setPhones([...phones])
    }

    return (
      <View
        ref={ref}
        open={Boolean(dialogOpen)}
        handleClose={handleClose}
        action={action}
        name={name}
        phones={phones} 
        color={color} 
        description={description} 
        invalidName={invalidName}
        invalidPhone={invalidPhone}
        handleChangeName={handleChangeName}
        handleChangeDescription={handleChangeDescription}
        handleChangeNumber={handleChangeNumber}
        handleChangeType={handleChangeType}
        handleAddPhone={handleAddPhone}
        handleDeletePhone={handleDeletePhone}
        handleChangeColor={handleChangeColor} 
        handleSave={handleSave}
      />
    )
  }
)

export default ContactFormDialog
