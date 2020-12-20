import React, { useState, useEffect } from 'react'
import AddAlarmModalProps from './props'
import Button from '../../../../../../components/button/text_button'
import {
  Dialog,
  DialogContent,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from '@material-ui/core'
import StringUtils from '../../../../../../utils/StringUtils'
import NumberUtils from '../../../../../../utils/NumberUtils'
import EventAlarmType from '../../../../../../constants/calendar/EventAlarmType'
import { useUserSettings } from '../../../../../../context/provider/user_settings'
import './styles.css'

const DEFAULT_TIME = 30
const DEFAULT_ALARM_TYPE = EventAlarmType.MINUTE

const AddAlarmModal: React.FC<AddAlarmModalProps> = ({
  onClose,
  open,
  onSave,
}) => {
  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)
  const [dialogOpen, setDialogOpen] = useState(open)
  const [alarmType, setAlarmType] = useState(DEFAULT_ALARM_TYPE)
  const [time, setTime] = useState(DEFAULT_TIME)
  const [saved, setSaved] = useState(false)

  const handleClose = () => {
    onClose()
  }

  const handleTimeTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    const newType = NumberUtils.safeParseNumber(value)
    setAlarmType(newType)

    switch (newType) {
      case EventAlarmType.DAY:
        if (time > 28) setTime(28)
        break
      case EventAlarmType.HOUR:
        if (time > 120) setTime(120)
        break
      case EventAlarmType.MINUTE:
        if (time > 600) setTime(600)
        break
    }
  }

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = NumberUtils.safeParseNumber(event.target.value)

    switch (alarmType) {
      case EventAlarmType.DAY:
        setTime(newTime > 28 ? 28 : newTime)
        break
      case EventAlarmType.HOUR:
        setTime(newTime > 120 ? 120 : newTime)
        break
      case EventAlarmType.MINUTE:
        setTime(newTime > 600 ? 600 : newTime)
        break
    }
  }

  const handleSave = () => {
    if (!saved) {
      setSaved(true)
      onSave(time, alarmType)
    }
  }

  const getAlarmTypeLabel = (value: number, base: string) => {
    const baseFormated = StringUtils.upperCaseFirstLetter(base)

    if (value === alarmType) {
      return `${baseFormated} ${language.BEFORE}`
    }

    return baseFormated
  }

  useEffect(() => {
    if (open) {
      setTime(DEFAULT_TIME)
      setAlarmType(DEFAULT_ALARM_TYPE)
      setSaved(false)
    }
    setDialogOpen(open)
  }, [open])

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      className="calendar__edit_event_modal__form__add_alarm_modal"
      maxWidth="sm"
      style={{ zIndex: 1200 }}
    >
      <DialogContent>
        <FormControl>
          <div className="calendar__edit_event_modal__form__add_alarm_modal__time">
            <TextField
              label={language.EVENT_ADD_ALARM_LABEL}
              value={time}
              className="calendar__edit_event_modal__form__add_alarm_modal__time__text_field"
              variant="outlined"
              onChange={handleTimeChange}
            />
          </div>
          <RadioGroup
            aria-label={language.EVENT_ADD_ALARM_TYPE_LABEL}
            value={alarmType}
            onChange={handleTimeTypeChange}
          >
            <FormControlLabel
              value={EventAlarmType.MINUTE}
              control={<Radio />}
              label={getAlarmTypeLabel(EventAlarmType.MINUTE, language.MINUTES)}
            />
            <FormControlLabel
              value={EventAlarmType.HOUR}
              control={<Radio />}
              label={getAlarmTypeLabel(EventAlarmType.HOUR, language.HOURS)}
            />
            <FormControlLabel
              value={EventAlarmType.DAY}
              control={<Radio />}
              label={getAlarmTypeLabel(EventAlarmType.DAY, language.DAYS)}
            />
          </RadioGroup>
          <Button
            ariaLabel={language.CALENDAR_EDIT_BUTTON_ARIA_LABEL}
            onClick={handleSave}
            className="calendar__edit_event_modal__form__add_alarm_modal__save_button"
          >
            Salvar
          </Button>
        </FormControl>
      </DialogContent>
    </Dialog>
  )
}

export default AddAlarmModal
