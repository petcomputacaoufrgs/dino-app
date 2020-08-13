import React from 'react'
import { Dialog } from '@material-ui/core'
import TransitionSlide from '../../../../components/slide_transition'
import DayModalHours from './day_modal_hours'
import DayModalProps from './props'
import { isMobile } from 'react-device-detect'
import './styles.css'

const DayModal = React.forwardRef<React.Ref<unknown>, DayModalProps>(
  ({ day, open, onClose }, ref) => {
    return (
        <Dialog
          ref={ref}
          open={open}
          fullWidth
          maxWidth={"sm"}
          onClose={onClose}
          TransitionComponent={TransitionSlide}
          aria-labelledby="form-dialog"
          className={`calendar__day__modal ${isMobile ? `mobile` : `desktop`}`}
        >
          <DayModalHours day={day} />
        </Dialog>
    )
  }
)

export default DayModal