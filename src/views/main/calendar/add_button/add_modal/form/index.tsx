import React, { useState } from 'react'
import { useLanguage } from '../../../../../../context_provider/app_settings'
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Grid, Button } from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import EventRepeatModal from './event_repeat_modal'
import EventType from '../../../../../../constants/calendar/EventType'
import CalendarService from '../../../../../../services/calendar/CalendarService'
import EventRepeatType from '../../../../../../constants/calendar/EventRepeatType'
import './styles.css'

const Form: React.FC = () => {
    const language = useLanguage().current

    const [eventType, setEventType] = useState(language.MEDICAL_APPOINTMENT_TYPE)
    const [eventName, setEventName] = useState('')
    const [initDate, setInitDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [repeatType, setRepeatType] = useState(EventRepeatType.NOT_REPEAT)
    const [repeatModalOpen, setRepeatModalOpen] = useState(false)

    const handleEventTypeChange = (
      event: React.ChangeEvent<HTMLInputElement>,
      value: string
    ) => {
      setEventType(value)
    }

    const handleEventNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setEventName(event.target.value);
    }

    const handleStartDateChange = (
      date: MaterialUiPickersDate,
      value?: string | null | undefined
    ) => {
      if (date) {
        setInitDate(date)
        setEndDate(date)
      }
    }

    const handleEndDateChange = (
      date: MaterialUiPickersDate,
      value?: string | null | undefined
    ) => {
      if (date) {
        setEndDate(date)
      }
    }

    const handleOpenEventRepeatModal = () => {
      setRepeatModalOpen(true)
    }

    const handleCloseEventRepeatModal = () => {
      setRepeatModalOpen(false)
    }

    const handleRepeatTypeChange = (repeatType: string) => {
      setRepeatType(repeatType)
      handleCloseEventRepeatModal()
    }

    return (
      <div className="calendar__add_modal__form">
        <FormControl>
          <TextField
            label={language.EVENT_NAME_LABEL}
            value={eventName}
            variant="standard"
            className="calendar__add_modal__event_name_text_field"
            onChange={handleEventNameChange}
          />
          <FormLabel component="legend">{language.EVENT_TYPE_LABEL}:</FormLabel>
          <RadioGroup
            aria-label={language.EVENT_TYPE_LABEL}
            value={eventType}
            onChange={handleEventTypeChange}
          >
            <FormControlLabel
              value={EventType.MEDICINE}
              control={<Radio />}
              label={language.MEDICINE_TYPE}
            />
            <FormControlLabel
              value={EventType.MEDICAL_APPOINTMENT}
              control={<Radio />}
              label={language.MEDICAL_APPOINTMENT_TYPE}
            />
          </RadioGroup>
          <div className="calendar__add_modal__form__space_line" />
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <KeyboardDatePicker
                margin="normal"
                className="calendar__add__modal__form__date_picker"
                label={language.EVENT_INIT_DATE_LABEL}
                format={language.DATE_PICKER_DAY_FORMAT}
                value={initDate}
                onChange={handleStartDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
              <KeyboardTimePicker
                margin="normal"
                className="calendar__add__modal__form__date_picker second"
                label={language.EVENT_INIT_TIME_LABEL}
                value={initDate}
                onChange={handleStartDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
              />
            </Grid>
            <Grid container justify="space-around">
              <KeyboardDatePicker
                margin="normal"
                className="calendar__add__modal__form__date_picker"
                label={language.EVENT_END_DATE_LABEL}
                format={language.DATE_PICKER_DAY_FORMAT}
                value={endDate}
                onChange={handleEndDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
              <KeyboardTimePicker
                margin="normal"
                className="calendar__add__modal__form__date_picker second"
                label={language.EVENT_END_TIME_LABEL}
                value={initDate}
                onChange={handleEndDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <div className="calendar__add_modal__form__space_line" />
          <Button
            color="primary"
            className="calendar__add__modal__event_repeat_button"
            onClick={handleOpenEventRepeatModal}
          >
            {CalendarService.getEventRepeatTypeName(
              Number(repeatType),
              language
            )}
          </Button>
          <div className="calendar__add_modal__form__space_line" />
        </FormControl>
        <EventRepeatModal
          onClose={handleCloseEventRepeatModal}
          onRepeatTypeChange={handleRepeatTypeChange}
          open={repeatModalOpen}
          repeatType={repeatType}
        />
      </div>
    )
}

export default Form