import React, { useState } from 'react'
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Grid,
  Button,
} from '@material-ui/core'
import { useCurrentLanguage } from '../../../../../context/provider/app_settings'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import EventRepeatModal from './event_repeat_modal'
import EventType from '../../../../../constants/calendar/EventType'
import CalendarService from '../../../../../services/calendar/CalendarService'
import EventRepeatType from '../../../../../constants/calendar/EventRepeatType'
import WeekDayPicker from '../../../../../components/weekday_picker'
import TitleSVG from '../../../../../assets/icons/title.svg'
import HealingSVG from '../../../../../assets/icons/healing.svg'
import ScheduleSVG from '../../../../../assets/icons/schedule.svg'
import RepeatSVG from '../../../../../assets/icons/repeat.svg'
import AddAlertSVG from '../../../../../assets/icons/add_alert.svg'
import ColorLensSVG from '../../../../../assets/icons/color_lens.svg'
import FormItem from './form_item'
import Week from '../../../../../types/weekday_picker/Week'
import Weekday from '../../../../../types/weekday_picker/Weekday'
import AddAlarmModal from './add_alarm_modal'
import EventAlarm from '../../../../../types/calendar/EventAlarm'
import AlarmItem from './alarm_item'
import './styles.css'
import ColorConstants from '../../../../../constants/app/ColorConstants'

const Form: React.FC = () => {
  const language = useCurrentLanguage();

  const [eventType, setEventType] = useState(language.MEDICAL_APPOINTMENT_TYPE)
  const [eventName, setEventName] = useState<string>()
  const [initDate, setInitDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [repeatType, setRepeatType] = useState(EventRepeatType.NOT_REPEAT)
  const [endRepeatDate, setEndRepeatDate] = useState<Date | undefined>()
  const [repeatModalOpen, setRepeatModalOpen] = useState(false)
  const [weekdays, setWeekdays] = useState(new Week(language))
  const [addAlarmModalOpen, setAddAlarmModalOpen] = useState(false)
  const [alarms, setAlarms] = useState<EventAlarm[]>([])
  const [color, setColor] = useState(ColorConstants.COLORS[0])

  const alarmDontExists = (time: number, type: number): boolean => {
    if (time === 0) {
      return alarms.filter((a) => a.time === time).length === 0
    } else {
      return (
        alarms.filter((a) => a.time === time && a.type === type).length === 0
      )
    }
  }

  const handleEventTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    setEventType(value)
  }

  const handleEventNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEventName(event.target.value)
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

  const handleRepeatTypeChange = (repeatType: number) => {
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

  const handleWeekdayClick = (weekday: Weekday) => {
    weekdays.updateWeekdayByIndex(weekday.index, !weekday.isSelected)
    setWeekdays({ ...weekdays })
  }

  const handleOpenEventAddAlertModal = () => {
    setAddAlarmModalOpen(true)
  }

  const handleCloseAddAlarmModal = () => {
    setAddAlarmModalOpen(false)
  }

  const handleSaveNewAlarm = (time: number, type: number) => {
    const dontExists = alarmDontExists(time, type)

    if (dontExists) {
      alarms.push({
        time: time,
        type: type,
      })

      setAlarms([...alarms])
    }

    setAddAlarmModalOpen(false)
  }

  const handleAlarmDelete = (alarm: EventAlarm) => {
    const newAlarms = alarms.filter(
      (a) => a.time !== alarm.time || a.type !== alarm.type
    )

    setAlarms(newAlarms)
  }

  const handleColorChange = () => {
    const colors = ColorConstants.COLORS
    const index = colors.findIndex((c) => c === color)
    setColor(colors[(index + 1) % colors.length])
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
          className="calendar__edit_event_modal__event_name_text_field"
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
            />
            <KeyboardTimePicker
              margin="normal"
              className="calendar__add__modal__form__date_picker second"
              label={language.EVENT_INIT_TIME_LABEL}
              value={initDate}
              onChange={handleStartDateChange}
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
            />
            <KeyboardTimePicker
              margin="normal"
              className="calendar__add__modal__form__date_picker second"
              label={language.EVENT_END_TIME_LABEL}
              value={endDate}
              onChange={handleEndDateChange}
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
          {CalendarService.getEventRepeatTypeName(Number(repeatType), language)}
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
            <div className="calendar__edit_event_modal__form__weekday_picker">
              <p className="calendar__edit_event_modal__form__weekday_picker__label">
                {language.EVENT_WEEKDAY_SELECT_LABEL}
              </p>
              <WeekDayPicker
                week={weekdays}
                onWeekdayClick={handleWeekdayClick}
              />
            </div>
          }
        />
      )}
    </>
  )

  const renderAlarmItens = (): JSX.Element => (
    <>
      {alarms.map((alarm, index) => (
        <FormItem
          iconSrc={index === 0 ? AddAlertSVG : undefined}
          iconAlt={index === 0 ? language.EVENT_ALERT_ALT : undefined}
          key={index}
          item={<AlarmItem alarm={alarm} onDelete={handleAlarmDelete} />}
        />
      ))}
    </>
  )

  const renderAlarm = (): JSX.Element => (
    <FormItem
      iconSrc={alarms.length === 0 ? AddAlertSVG : undefined}
      iconAlt={alarms.length === 0 ? language.EVENT_ALERT_ALT : undefined}
      item={
        <Button
          color="primary"
          className="calendar__add__modal__event_alert_button"
          onClick={handleOpenEventAddAlertModal}
        >
          {language.EVENT_ADD_ALERT}
        </Button>
      }
    />
  )

  const renderColorSelection = (): JSX.Element => (
    <FormItem
      iconSrc={ColorLensSVG}
      iconAlt={language.CHANGE_COLOR_ARIA_LABEL}
      onIconClick={handleColorChange}
      item={
        <div className="calendar__edit_event_modal__form__color_selection">
          <p className="calendar__edit_event_modal__form__color_selection__label">
            {language.EVENT_COLOR_LABEL}:
          </p>
          <div
            className="calendar__edit_event_modal__form__color_selection__color_cicle"
            style={{ backgroundColor: color }}
          />
        </div>
      }
    />
  )

  return (
    <div className="calendar__edit_event_modal__form">
      <FormControl>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          {renderEventNameField()}
          <div className="calendar__edit_event_modal__form__space_line" />
          {renderEventTypeRadioGroup()}
          <div className="calendar__edit_event_modal__form__space_line" />
          {renderDatePicker()}
          <div className="calendar__edit_event_modal__form__space_line" />
          {renderEventRepeatPicker()}
          {renderWeekDaySelector()}
          {renderRepeatDataPicker()}
          <div className="calendar__edit_event_modal__form__space_line" />
          {renderAlarmItens()}
          {renderAlarm()}
          <div className="calendar__edit_event_modal__form__space_line" />
          {renderColorSelection()}
          <div className="calendar__edit_event_modal__form__space_line" />
        </MuiPickersUtilsProvider>
      </FormControl>
      <EventRepeatModal
        onClose={handleCloseEventRepeatModal}
        onRepeatTypeChange={handleRepeatTypeChange}
        open={repeatModalOpen}
        repeatType={repeatType}
      />
      <AddAlarmModal
        onClose={handleCloseAddAlarmModal}
        onSave={handleSaveNewAlarm}
        open={addAlarmModalOpen}
      />
    </div>
  )
}

export default Form
