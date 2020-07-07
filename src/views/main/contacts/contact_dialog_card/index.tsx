import React, { forwardRef } from 'react'
import { Dialog } from '@material-ui/core'
import ContactCardProps from './props'
import ContactCardHeader from './header'
import ContactCardContent from './content'
import TransitionSlide from '../../../../components/slide_transition'

const ContactCard = forwardRef(
  (props: ContactCardProps, ref: React.Ref<unknown>): JSX.Element => {
    return (
      <Dialog
        ref={ref}
        style={{ padding: 0 }}
        fullWidth
        maxWidth="xs"
        onClose={props.onClose}
        TransitionComponent={TransitionSlide}
        open={props.dialogOpen}
        aria-labelledby="card with contact info"
      >
        <ContactCardHeader
          item={props.item}
          setEdit={props.setEdit}
          setDelete={props.setDelete}
          onClose={props.onClose}
        />
        <ContactCardContent item={props.item} />
      </Dialog>
    )
  }
)

export default ContactCard
