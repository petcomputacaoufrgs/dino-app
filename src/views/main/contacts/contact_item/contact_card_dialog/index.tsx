import React, { forwardRef } from 'react'
import { Dialog, Slide } from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions';
import ContactCardProps from './props'
import ContactCardHeader from './header'
import ContactCardContent from './content'

const TransitionSlide = forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} mountOnEnter unmountOnExit {...props} />;
})

const ContactCard = forwardRef((props: ContactCardProps, ref: React.Ref<unknown>): JSX.Element => {

  return (
    <Dialog
      ref={ref}
      style={{ padding: 0 }}
      fullWidth
      maxWidth='xs'
      onClose={() => props.onClose()}
      TransitionComponent={TransitionSlide}
      open={props.dialogOpen}
      aria-labelledby="CARD-dialog">

      <ContactCardHeader
        item={props.item}
        setEdit={props.setEdit}
        onClose={props.onClose}
      />
      <ContactCardContent item={props.item} />
    </Dialog >
  )
},
)

export default ContactCard
