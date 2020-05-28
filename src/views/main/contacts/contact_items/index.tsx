import React, { useState } from 'react'
import ContactItemsProps from './props'
import ContactItemCard from '../contact_item/contact_item_card'
import ContactItemList from '../contact_item/contact_item_list'
import { List, Modal, Divider, } from '@material-ui/core'
import { Backdrop, Slide } from '@material-ui/core'
import useStyles from '../styles'

const ContactItems = (props: ContactItemsProps): JSX.Element => {

  const classes = useStyles(props)

  const [selectedItem, setSelectedItem] = useState(0)
  const [open, setOpen] = useState(false)

  const handleOpen = (id: number) => {
    setOpen(true)
    setSelectedItem(id)
  }

  const handleClose = () => setOpen(false)

  const isContactOpen = (id: number): boolean => open && selectedItem === id

  return (
    <List className={classes.list}>
      {props.items.map((contact) => (
        <div key={contact.id}>
          <ContactItemList
            item={contact}
            onClick={() => handleOpen(contact.id)}
          />
          <Modal
            className={classes.modal}
            open={isContactOpen(contact.id)}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
            disableAutoFocus

          >
            <Slide
              in={isContactOpen(contact.id)}
              direction="up"
              mountOnEnter
              unmountOnExit
            >
              <ContactItemCard item={contact} />
            </Slide>
          </Modal>
          <Divider />
        </div>
      ))}
    </List>
  )
}

export default ContactItems
