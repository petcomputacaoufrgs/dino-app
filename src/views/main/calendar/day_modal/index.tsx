import React, { useEffect } from 'react'
import { Dialog } from '@material-ui/core'
import TransitionSlide from '../../../../components/slide_transition'
import Content from './content'
import DayModalProps from './props'
import { isMobile } from 'react-device-detect'
import Header from './header'
import AddButton from '../add_button'
import './styles.css'

const DayModal = React.forwardRef<React.Ref<unknown>, DayModalProps>(
  ({ day, events, open, onClose }, ref) => {
    return (
      <Dialog
        ref={ref}
        open={open}
        fullWidth
        maxWidth={'sm'}
        onClose={onClose}
        TransitionComponent={TransitionSlide}
        aria-labelledby="form-dialog"
        className={`calendar__day__modal ${isMobile ? `mobile` : `desktop`}`}
      >
        <Header day={day} onClose={onClose} />
        <Content day={day} events={events} />
        <AddButton />
      </Dialog>
    )
  }
)

export default DayModal