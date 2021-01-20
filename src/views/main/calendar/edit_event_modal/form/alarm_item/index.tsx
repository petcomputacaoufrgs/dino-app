import React from 'react'
import AlarmItemProps from './props'
import EventAlarmType from '../../../../../../constants/calendar/EventAlarmType'
import LogAppErrorService from '../../../../../../services/log_app_error/LogAppErrorService'
import DeleteSVG from '../../../../../../assets/icons/delete.svg'
import Button from '../../../../../../components/button'
import { useLanguage } from '../../../../../../context/language'
import './styles.css'

const AlarmItem: React.FC<AlarmItemProps> = ({ alarm, onDelete }) => {
	const language = useLanguage()

	const handleDelete = () => {
		onDelete(alarm)
	}

	const getTypeName = () => {
		switch (alarm.type) {
			case EventAlarmType.MINUTE:
				return alarm.time === 1 ? language.data.MINUTE : language.data.MINUTES
			case EventAlarmType.HOUR:
				return alarm.time === 1 ? language.data.HOUR : language.data.HOURS
			case EventAlarmType.DAY:
				return alarm.time === 1 ? language.data.DAYS : language.data.DAYS
			default:
				LogAppErrorService.logModel({
					date: new Date(),
					error: 'Invalid alarm type saved: ' + alarm.type,
					title: 'Event Alarm Type',
					file: 'AlarmItem',
				})
				return language.data.EVENT_INVALID_ALARM_TYPE
		}
	}

	return (
		<div className='calendar__add__modal__event_alert_item'>
			<div className='calendar__add__modal__event_alert_item__info'>
				{alarm.time !== 0 ? (
					<>
						{alarm.time} {getTypeName()} {language.data.BEFORE}
					</>
				) : (
					<>{language.data.EVENT_ALARM_ZERO}</>
				)}
			</div>
			<Button
				ariaLabel={language.data.CALENDAR_DELETE_BUTTON_ARIA_LABEL}
				onClick={handleDelete}
				className='calendar__add__modal__event_alert_item__delete_button'
			>
				<img
					src={DeleteSVG}
					alt={language.data.EVENT_ALARM_DELETE_ALT}
					className='calendar__add__modal__event_alert_item__delete_button__image'
				/>
			</Button>
		</div>
	)
}

export default AlarmItem
