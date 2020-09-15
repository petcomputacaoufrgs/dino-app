import React, { forwardRef } from 'react'
import { Dialog } from '@material-ui/core'
import ContactCardProps from './props'
import ContactCardHeader from './header'
import ContactCardContent from './content'
import TransitionSlide from '../../../../components/slide_transition'

const ContactCard = forwardRef(
  (
    { item, dialogOpen, onClose, setEdit, setDelete }: ContactCardProps,
    ref: React.Ref<unknown>
  ): JSX.Element => {
    return (
      <Dialog
        ref={ref}
        style={{ padding: 0 }}
        fullWidth
        maxWidth="xs"
        onClose={onClose}
        TransitionComponent={TransitionSlide}
        open={dialogOpen}
      >
        <ContactCardHeader
          item={item}
          setEdit={setEdit}
          setDelete={setDelete}
          onClose={onClose}
        />
        <ContactCardContent item={item} />
      </Dialog>
    )
  }
)

export default ContactCard
