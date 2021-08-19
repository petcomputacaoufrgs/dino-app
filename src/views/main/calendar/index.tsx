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
import CalendarSettings from '../../../components/calendar/calendar_settings'
import DinoTabPanel from '../../../components/tab_panel'
import { IndeterminateCheckBoxTwoTone } from '@material-ui/icons'
import CalendarEventTypeEntity from '../../../types/calendar/database/CalendarEventTypeEntity'

const Calendar: React.FC = () => {
	const language = useLanguage()
	const [isLoading, setIsLoading] = useState(true)
	//const [events, setEvents] = useState<CalendarEventEntity[]>([])
	const [settings, setSettings] = useState<UserSettingsEntity>()
	const [openGrantDialog, setOpenGrantDialog] = useState(false)
	const [toAction, setToAction] = useState(CRUDEnum.NOP)
	const [selectedItem, setSelectedItem] = useState<EventView>()

	const mockCalendarDays = [
		{
			dayOfMonth: '01',
			events: [
				{ name: 'Lembrete Top', time: '10:00 - 11:00', color: '#d783bb' },
				{ name: 'Eventão', time: '9:00 - 22:00', color: '#d1810d' },
			],
		},
		{
			dayOfMonth: '02',
			events: [],
		},
	]

	const renderCalendar = () => {
		return (
			<div className='calendar'>
				<MonthNavBar />
				{mockCalendarDays.map((e, index) => (
					<CalendarDay
						key={index}
						dayOfMonth={e.dayOfMonth}
						dayOfWeek={language.data.MONDAY_ABREVIATION}
						events={e.events}
					/>
				))}
				<AddButton
					label={language.data.EVENT}
					handleAdd={() => setToAction(CRUDEnum.CREATE)}
				/>
				<EventDialogForm
					open={toAction === CRUDEnum.CREATE || toAction === CRUDEnum.UPDATE}
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
			//setEvents(events)
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
			updateEvents = () => {}
			updateSettings = () => {}
			finishLoading = () => {}
			CalendarEventService.removeUpdateEventListenner(loadData)
			UserSettingsService.removeUpdateEventListenner(loadData)
			GoogleScopeService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

	const handleClose = () => setToAction(CRUDEnum.NOP)

	const mockEventTypes = [
		{ icon: 'calendar', title: 'Evento', color: '#afd153', isUniversal: 1 },
		{ icon: 'faq', title: 'Lembrete', color: '#ab1e53', isUniversal: 1 },
		{
			icon: 'faq',
			title: 'Personalizadooooo',
			color: '#ab5e13',
			isUniversal: 0,
		},
	] as CalendarEventTypeEntity[]

	return (
		<DinoTabPanel
			panels={[
				{ Label: language.data.MENU_CALENDAR, Component: renderCalendar() },
				{
					Label: language.data.MENU_SETTINGS,
					Component: <CalendarSettings eventTypes={mockEventTypes} />,
				},
			]}
		/>
	)
}

export default Calendar
