import React, { useState, useEffect } from 'react'
import { ContactFormDialogProps } from './props'
import Constants from '../../../../constants/ContactsConstants'
import Service from '../../../../services/contact/ContactService'
import ContactModel from '../../../../types/contact/ContactModel'
import PhoneModel from '../../../../types/contact/PhoneModel'
import View from './view'
import ColorConstants from '../../../../constants/ColorConstants'

const ContactFormDialog = ({
  dialogOpen,
  setDialogOpen,
  action,
  item,
}: ContactFormDialogProps): JSX.Element => {
  const [name, setName] = useState(item?.name || '')
  const [description, setDescription] = useState(item?.description || '')
  const [color, setColor] = useState(item?.color || '')
  const [invalidName, setInvalidName] = useState(false)
  const [invalidPhone, setInvalidPhone] = useState(
    JSON.parse(Constants.DEFAULT_INVALID_PHONE)
  )
  const [phones, setPhones] = useState(
    item ? item.phones : [JSON.parse(Constants.DEFAULT_PHONE) as PhoneModel]
  )

  useEffect(() => {
    setName(item?.name || '')
    setDescription(item?.description || '')
    setPhones(
      item ? item.phones : [JSON.parse(Constants.DEFAULT_PHONE) as PhoneModel]
    )
    setColor(item?.color || '')
    setInvalidName(false)
    setInvalidPhone(JSON.parse(Constants.DEFAULT_INVALID_PHONE))

    return () => {
      setName('')
      setPhones([{ type: Constants.MOBILE, number: '' }])
      setDescription('')
      setColor('')
      setInvalidName(false)
      setInvalidPhone(JSON.parse(Constants.DEFAULT_INVALID_PHONE))
    }
  }, [dialogOpen, item])

  const handleClose = () => setDialogOpen(0)

  const handleSave = (): void => {
    function validInfo(): string {
      setInvalidName(name === '')
      return name
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
        name,
        description,
        phones: phones.filter((phone) => phone.number !== ''),
        color,
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
    const index = colors.findIndex((c) => c === color)
    setColor(colors[(index + 1) % colors.length])
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
    setName(event.target.value as string)
  }

  const handleChangeDescription = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value as string)
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
      handleChangeColor={handleChangeColor}
      handleAddPhone={handleAddPhone}
      handleDeletePhone={handleDeletePhone}
      handleSave={handleSave}
    />
  )
}

export default ContactFormDialog
