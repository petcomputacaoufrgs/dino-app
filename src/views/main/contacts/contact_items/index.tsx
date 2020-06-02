import React, { useState } from 'react'
import ContactItemsProps from './props'
import ContactItemCard from '../contact_item/contact_item_card'
import ContactItemList from '../contact_item/contact_item_list'
import { List, Modal, Divider, } from '@material-ui/core'
import { Backdrop, Slide } from '@material-ui/core'
import useStyles from '../styles'
import AddContactButton from '../add_contact_button'
import ContactFormDialog from '../add_contact_dialog'
import ContactsConstants from '../../../../constants/ContactsConstants'


const ContactItems = (props: ContactItemsProps): JSX.Element => {

  const classes = useStyles(props)

  const [name, setName] = useState('Nome do carinha')
  const [number, setNumber] = useState('')
  const [type, setType] = useState(ContactsConstants.MOBILE)
  const [color, setColor] = useState('')

  const [selectedItem, setSelectedItem] = useState(0)
  const [open, setOpen] = useState(false)
  const [edit, setEdit] = useState(false)

  const handleOpen = (id: number) => {
    setOpen(true)
    setSelectedItem(id)
  }

  const handleClose = () => setOpen(false)

  const isContactOpen = (id: number): boolean => open && selectedItem === id

  return (
    <div>
      <List className={classes.list}>
        {props.items.map((contact) => (
          <div key={contact.id}>
            <ContactItemList
              item={contact}
              onOpen={() => handleOpen(contact.id)}
            />
            <Modal
              className={classes.modal}
              open={isContactOpen(contact.id)}
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              //BackdropProps={{ timeout: 500 }}
              disableAutoFocus

            >
              <Slide
                in={isContactOpen(contact.id)}
                direction="up"
                mountOnEnter
                unmountOnExit
              >
                <ContactItemCard item={contact} closeCard={handleClose} setEdit={setEdit} />
              </Slide>
            </Modal>
            <Divider />
          </div>
        ))}
      </List>
      <AddContactButton />
      <ContactFormDialog
        itemId={selectedItem}
        action="edit"
        dialogOpen={edit}
        setDialogOpen={setEdit}
        name={name}
        setName={setName}
        number={number}
        setNumber={setNumber}
        type={type}
        setType={setType}
        color={color}
        setColor={setColor}
      />
    </div>
  )
}

export default ContactItems
