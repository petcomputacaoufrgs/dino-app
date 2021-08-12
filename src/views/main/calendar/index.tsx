import React, { useEffect, useState } from 'react'
import AddButton from '../../../components/button/icon_button/add_button'
import { useLanguage } from '../../../context/language'
import CalendarEventEntity from '../../../types/calendar/database/CalendarEventEntity'
import MonthNavBar from '../../../components/calendar/month_nav_bar'
import './styles.css'
import GoogleScopeService from '../../../services/auth/google/GoogleScopeService'
import CalendarEventService from '../../../services/calendar/CalendarEventService'
import UserSettingsService from '../../../services/user/UserSettingsService'
import CalendarEntity from '../../../types/calendar/database/CalendarEntity'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import CRUDEnum from '../../../types/enum/CRUDEnum'
import { EventDialogForm } from './event_dialog_form'
import { GoogleCalendarGrantDialog } from '../../../components/dialogs/google_grant_dialog'
import CalendarDay from '../../../components/calendar/calendar_day'
import { EventView } from '../../../components/calendar/calendar_event'

const Calendar: React.FC = () => {
	const language = useLanguage()
	const [isLoading, setIsLoading] = useState(true)
	const [events, setEvents] = useState<CalendarEventEntity[]>([])
	const [settings, setSettings] = useState<UserSettingsEntity>()
	const [openGrantDialog, setOpenGrantDialog] = useState(false)
	const [toAction, setToAction] = useState(CRUDEnum.NOP)
	const [selectedItem, setSelectedItem] = useState<EventView>()

	useEffect(() => {
		const loadUserData = async (): Promise<CalendarEventEntity[]> => {
			const syncGoogleCalendar = await GoogleScopeService.hasCalendarGrant()
			if (settings && !settings.declineGoogleCalendar) {
				if (!syncGoogleCalendar) setOpenGrantDialog(true)
			}
			return CalendarEventService.getAll()
		}

		const loadData = async () => {
			const settings = await UserSettingsService.getFirst()
			updateSettings(settings)

			const events = await loadUserData()
			events.push({ title: 'mock title' })

			updateEvents(events)
			finishLoading()
		}

		CalendarEventService.addUpdateEventListenner(loadData)
		UserSettingsService.addUpdateEventListenner(loadData)
		GoogleScopeService.addUpdateEventListenner(loadData)

		let updateEvents = (events: CalendarEventEntity[]) => {
			setEvents(events)
		}

		let updateSettings = (settings: UserSettingsEntity | undefined) => {
			setSettings(settings)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		if (isLoading) {
			loadData()
		}

		return () => {
			updateEvents = () => { }
			updateSettings = () => { }
			finishLoading = () => { }
			CalendarEventService.removeUpdateEventListenner(loadData)
			UserSettingsService.removeUpdateEventListenner(loadData)
			GoogleScopeService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

	const handleClose = () => setToAction(CRUDEnum.NOP)

	return (
		<div className='calendar'>
			<MonthNavBar />
			<CalendarDay dayOfMonth='01' dayOfWeek={language.data.MONDAY_ABREVIATION} events={[{ name: 'Lembrete Top', time: '10:00 - 11:00', color: '#d783bb' }, { name: 'Eventão', time: '9:00 - 22:00', color: '#d783bb' }]} />
			<CalendarDay dayOfMonth='02' dayOfWeek={language.data.TUESDAY_ABREVIATION} events={[]} />
			<AddButton
				label={language.data.EVENT}
				handleAdd={() => setToAction(CRUDEnum.CREATE)}
			/>
			<EventDialogForm
				open={toAction === CRUDEnum.CREATE}
				onClose={handleClose}
			/>
			<EventDialogForm
				open={toAction === CRUDEnum.UPDATE}
				onClose={handleClose}
				item={selectedItem}
			/>
			<GoogleCalendarGrantDialog
				open={openGrantDialog}
				onClose={() => setOpenGrantDialog(false)}
			/>
		</div>
	)
}

export default Calendar
