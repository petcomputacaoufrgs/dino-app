import React, { useState } from 'react'
import { useLanguage } from '../../../../../../context_provider/app_settings'
import { FormControl, RadioGroup, FormControlLabel, Radio, TextField, Grid, Button } from '@material-ui/core'
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
import WeekDayPicker from '../../../../../../components/weekday_picker'
import TitleSVG from '../../../../../../assets/icons/title.svg'
import HealingSVG from '../../../../../../assets/icons/healing.svg'
import ScheduleSVG from '../../../../../../assets/icons/schedule.svg'
import RepeatSVG from '../../../../../../assets/icons/repeat.svg'
import FormItem from './form_item'
import './styles.css'
import Week from '../../../../../../types/weekday_picker/Week'
import Weekday from '../../../../../../types/weekday_picker/Weekday'

const Form: React.FC = () => {
    const language = useLanguage().current

    const [eventType, setEventType] = useState(language.MEDICAL_APPOINTMENT_TYPE)
    const [eventName, setEventName] = useState<string>()
    const [initDate, setInitDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [repeatType, setRepeatType] = useState(EventRepeatType.NOT_REPEAT)
    const [endRepeatDate, setEndRepeatDate] = useState<Date | undefined>()
    const [repeatModalOpen, setRepeatModalOpen] = useState(false)
    const [week, setWeek] = useState(new Week(language))

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

    const handleRepeatEndDateChange = (
      date: MaterialUiPickersDate,
      value?: string | null | undefined
    ) => {
      if (date) {
        setEndRepeatDate(date)
      }
    }

    const handleWeekdayClick = (
      weekday: Weekday
    ) => {
      week.updateWeekdayByIndex(weekday.index, !weekday.isSelected)
      setWeek({...week})
    }

    const renderEventNameField = (): JSX.Element => (
      <FormItem
        iconSrc={TitleSVG}
        iconAlt={language.EVENT_TITLE_ICON_ALT}
        item={
          <TextField
            label={language.EVENT_NAME_LABEL}
            value={eventName}
            variant="standard"
            className="calendar__add_modal__event_name_text_field"
            onChange={handleEventNameChange}
          />
        }
      />
    )

    const renderEventTypeRadioGroup = (): JSX.Element => (
      <>
        <RadioGroup
          aria-label={language.EVENT_TYPE_LABEL}
          value={eventType}
          onChange={handleEventTypeChange}
        >
          <FormItem
            iconSrc={HealingSVG}
            iconAlt={''}
            item={
              <FormControlLabel
                value={EventType.MEDICINE}
                control={<Radio />}
                label={language.MEDICINE_TYPE}
              />
            }
          />
          <FormItem
            item={
              <FormControlLabel
                value={EventType.MEDICAL_APPOINTMENT}
                control={<Radio />}
                label={language.MEDICAL_APPOINTMENT_TYPE}
              />
            }
          />
        </RadioGroup>
      </>
    )

    const renderDatePicker = (): JSX.Element => (
      <>
        <FormItem
          iconSrc={ScheduleSVG}
          iconAlt={language.EVENT_DATE_ICON_ALT}
          item={
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
          }
        />
        <FormItem
          item={
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
          }
        />
      </>
    )

    const renderEventRepeatPicker = (): JSX.Element => (
      <FormItem
        iconSrc={RepeatSVG}
        iconAlt={language.EVENT_REPEAT_ICON_ALT}
        item={
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
        }
      />
    )

    const renderRepeatDataPicker = (): JSX.Element => (
      <>
        {repeatType !== EventRepeatType.NOT_REPEAT && (
          <FormItem
            item={
              <KeyboardDatePicker
                margin="normal"
                label={language.EVENT_END_DATE_LABEL}
                format={language.DATE_PICKER_DAY_FORMAT}
                value={endRepeatDate}
                onChange={handleRepeatEndDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            }
          />
        )}
      </>
    )

    const renderWeekDaySelector = (): JSX.Element => (
      <>
        {repeatType === EventRepeatType.EVERY_WEEK && (
          <FormItem
            item={
              <div className='calendar__add_modal__form__weekday_picker'>
                <p className='calendar__add_modal__form__weekday_picker__label'>
                  {language.EVENT_WEEKDAY_SELECT_LABEL}
                </p>
                <WeekDayPicker week={week} onWeekdayClick={handleWeekdayClick} />
              </div>
            }
          />
        )}
      </>
    )

    return (
      <div className="calendar__add_modal__form">
        <FormControl>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            {renderEventNameField()}
            <div className="calendar__add_modal__form__space_line" />
            {renderEventTypeRadioGroup()}
            <div className="calendar__add_modal__form__space_line" />
            {renderDatePicker()}
            <div className="calendar__add_modal__form__space_line" />
            {renderEventRepeatPicker()}
            {renderWeekDaySelector()}
            {renderRepeatDataPicker()}
            <div className="calendar__add_modal__form__space_line" />
          </MuiPickersUtilsProvider>
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