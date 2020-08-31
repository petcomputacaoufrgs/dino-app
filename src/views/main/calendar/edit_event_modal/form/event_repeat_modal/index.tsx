import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core'
import { useLanguage } from '../../../../../../context_provider/app_settings'
import EventRepeatModalProps from './props'
import EventRepeatType from '../../../../../../constants/calendar/EventRepeatType'
import './styles.css'
import NumberUtils from '../../../../../../utils/NumberUtils'

const EventRepeatModal: React.FC<EventRepeatModalProps> = ({ open, onClose, repeatType: eventRepeatType, onRepeatTypeChange: onEventRepeatTypeChange }) => {

    const [dialogOpen, setDialogOpen] = useState(open) 
    const [repeatType, setRepeatType] = useState(eventRepeatType)

    const language = useLanguage().current

    useEffect(() => {
      setDialogOpen(open)
    }, [open])

    useEffect(() => {
      setRepeatType(eventRepeatType)
    }, [eventRepeatType])

    const handleClose = () => {
      onClose()
    }

    const handleRepeatTypeChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      value: string
    ) => {
      onEventRepeatTypeChange(NumberUtils.safeParseInt(value))
    }

    return (
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        className="calendar__edit_event_modal__form__event_repeat_modal"
        maxWidth="sm"
        style={{ zIndex: 1200 }}
      >
        <DialogContent>
          <FormControl>
            <RadioGroup
              aria-label={language.EVENT_REPEAT_TYPE_LABEL}
              value={repeatType}
              onChange={handleRepeatTypeChange}
            >
              <FormControlLabel
                value={EventRepeatType.NOT_REPEAT}
                control={<Radio />}
                label={language.EVENT_REPEAT_NOT_REPEAT}
              />
              <FormControlLabel
                value={EventRepeatType.EVERY_DAY}
                control={<Radio />}
                label={language.EVENT_REPEAT_EVERY_DAY}
              />
              <FormControlLabel
                value={EventRepeatType.EVERY_WEEK}
                control={<Radio />}
                label={language.EVENT_REPEAT_EVERY_WEEK}
              />
              <FormControlLabel
                value={EventRepeatType.EVERY_MONTH}
                control={<Radio />}
                label={language.EVENT_REPEAT_EVERY_MONTH}
              />
              <FormControlLabel
                value={EventRepeatType.EVERY_YEAR}
                control={<Radio />}
                label={language.EVENT_REPEAT_EVERY_YEAR}
              />
              <FormControlLabel
                value={EventRepeatType.CUSTOMIZED}
                control={<Radio />}
                label={language.EVENT_REPEAT_EVERY_CUSTOMIZED}
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
      </Dialog>
    )        
}

export default EventRepeatModal