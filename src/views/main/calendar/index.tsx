import React, { useEffect, useRef, useState } from 'react'
import AddButton from '../../../components/button/icon_button/add_button'
import { useLanguage } from '../../../context/language'
import MonthNavBar from '../../../components/calendar/month_nav_bar'
import GoogleScopeService from '../../../services/auth/google/GoogleScopeService'
import CalendarEventService from '../../../services/calendar/EventService'
import UserSettingsService from '../../../services/user/UserSettingsService'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import CRUDEnum from '../../../types/enum/CRUDEnum'
import { EventDialogForm, getNewEventView } from './event_dialog_form'
import CardEvent from './calendar_card_event'
import { GoogleCalendarGrantDialog } from '../../../components/dialogs/google_grant_dialog'
import CalendarSettings from './calendar_settings'
import DinoTabPanel from '../../../components/tab_panel'
import EventTypeEntity from '../../../types/calendar/database/EventTypeEntity'
import { DayView, EventView } from '../../../types/calendar/view/CalendarView'
import CalendarEventTypeService from '../../../services/calendar/EventTypeService'
import CalendarDay from './calendar_day'
import AgreementDialog from '../../../components/dialogs/agreement_dialog'
import DateUtils from '../../../utils/DateUtils'
import StringUtils from '../../../utils/StringUtils'
import { HasStaffPowers } from '../../../context/private_router'
import './styles.css'

const Calendar: React.FC = () => {
	const language = useLanguage()
	const hasStaffPowers = HasStaffPowers()

	const [isLoading, setIsLoading] = useState(true)
	const [todayIndex, setTodayIndex] = useState<number>()
	const [date, setDate] = useState<Date>(new Date())
	const [dayViews, setDayViews] = useState<DayView[]>()
	const [eventTypes, setEventTypes] = useState<EventTypeEntity[]>()
	const [settings, setSettings] = useState<UserSettingsEntity>()
	const [openGrantDialog, setOpenGrantDialog] = useState(false)
	const [toAction, setToAction] = useState(CRUDEnum.NOP)
	const [selectedItem, setSelectedItem] = useState<EventView>()
	const [syncGoogleCalendar, setSyncGoogleCalendar] = useState(false)

	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const makeTodayIndex = () => {
			const now = new Date()
			if (DateUtils.isSameMonth(now, date)) {
				setTodayIndex(now.getDate() - 1)
			} else setTodayIndex(undefined)
		}

		const makeViewOfMonth = () => {
			const firstWeekDay = new Date(
				date.getFullYear(),
				date.getMonth(),
			).getDay()
			const monthLength = DateUtils.getMonthDaysLength(
				date.getMonth(),
				date.getFullYear(),
			)
			const weekDayNamesAbr = DateUtils.getWeekDayNamesAbrArray(language.data)
			const month = new Array<DayView>(monthLength)
			for (let index = 0; index < monthLength; index++) {
				const day = index + 1
				month[index] = {
					dayOfMonth: day < 10 ? '0' + day : `${day}`,
					dayOfWeek:
						weekDayNamesAbr[(index + firstWeekDay) % weekDayNamesAbr.length],
					events: [],
				}
			}
			makeTodayIndex()
			return month
		}

		const pushEventViewsToMonth = async (
			monthView: DayView[],
			types: EventTypeEntity[],
		) => {
			const events = await CalendarEventService.getAll()

			events.forEach(e => {
				const type = types.find(t => t.localId === e.typeLocalId) //TODO otimizar

				const eventView: EventView = { event: e, type: type }

				const index = e.start.getDate() - 1
				const day: DayView | undefined = monthView[index]
				if (day && DateUtils.isSameMonth(e.start, date))
					day.events.push(eventView)
			})
		}

		const loadUserData = async (
			types: EventTypeEntity[],
		): Promise<DayView[]> => {
			const syncGoogleCalendar = await GoogleScopeService.hasCalendarGrant()
			setSyncGoogleCalendar(syncGoogleCalendar)

			const monthView = makeViewOfMonth()

			await pushEventViewsToMonth(monthView, types)

			return monthView
		}

		const loadData = async () => {
			const settings = await UserSettingsService.getFirst()
			updateSettings(settings)

			const types = await CalendarEventTypeService.getAll()
			updateEventTypes(types)

			const dayViews = await loadUserData(types)

			updateDayViews(dayViews)
			finishLoading()
		}

		CalendarEventService.addUpdateEventListenner(loadData)
		CalendarEventTypeService.addUpdateEventListenner(loadData)
		UserSettingsService.addUpdateEventListenner(loadData)
		GoogleScopeService.addUpdateEventListenner(loadData)

		let updateDayViews = (dayViews: DayView[]) => {
			setDayViews(dayViews)
		}

		let updateEventTypes = (types: EventTypeEntity[]) => {
			setEventTypes(
				types.sort((a, b) =>
					StringUtils.normalize(a.title) > StringUtils.normalize(b.title)
						? 1
						: -1,
				),
			)
		}

		let updateSettings = (settings?: UserSettingsEntity) => {
			setSettings(settings)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		if (isLoading) {
			loadData()
		}

		ref.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
		})

		return () => {
			updateDayViews = () => {}
			updateEventTypes = () => {}
			updateSettings = () => {}
			finishLoading = () => {}
			CalendarEventService.removeUpdateEventListenner(loadData)
			CalendarEventTypeService.removeUpdateEventListenner(loadData)
			UserSettingsService.removeUpdateEventListenner(loadData)
			GoogleScopeService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

	const handleClose = () => {
		setToAction(CRUDEnum.NOP)
		setSelectedItem(undefined)
	}

	const handleAdd = () => {
		if (
			settings &&
			!settings.declineGoogleCalendar &&
			!hasStaffPowers &&
			!syncGoogleCalendar
		) {
			return setOpenGrantDialog(true)
		}

		setToAction(CRUDEnum.CREATE)
	}

	const handleClick = (item: EventView) => {
		setToAction(CRUDEnum.READ)
		setSelectedItem(item)
	}

	const handleClickEmpty = (dayOfMonth: string) => {
		const clickedDate = new Date(
			date.getFullYear(),
			date.getMonth(),
			Number(dayOfMonth),
		)
		const newEventView = getNewEventView(clickedDate)
		setSelectedItem(newEventView)
		setToAction(CRUDEnum.CREATE)
	}

	const handleEditOption = () => setToAction(CRUDEnum.UPDATE)

	const handleDeleteOption = () => setToAction(CRUDEnum.DELETE)

	const handleAcceptDialogAndDeleteItem = () => {
		if (selectedItem) CalendarEventService.delete(selectedItem.event)
		handleClose()
	}

	const handleChangeDate = (currentDate: Date) => {
		setDate(currentDate)
		setIsLoading(true)
	}

	const isToday = (index: number) => index === todayIndex

	const renderCalendar = () => {
		return (
			<div className='calendar'>
				<MonthNavBar date={date} onChangeDate={handleChangeDate} />
				{dayViews?.map((e, index) => (
					<div ref={isToday(index) ? ref : undefined} key={index}>
						<CalendarDay
							item={e}
							onClickEvent={handleClick}
							onClickEmpty={handleClickEmpty}
							today={isToday(index)}
						/>
					</div>
				))}
				<AddButton label={language.data.EVENT} handleAdd={handleAdd} />
				<EventDialogForm
					open={toAction === CRUDEnum.CREATE || toAction === CRUDEnum.UPDATE}
					onClose={handleClose}
					item={selectedItem}
					eventTypes={eventTypes}
				/>
				<GoogleCalendarGrantDialog
					open={openGrantDialog}
					onClose={() => setOpenGrantDialog(false)}
				/>
				<AgreementDialog
					open={toAction === CRUDEnum.DELETE}
					description={language.data.DELETE_ITEM_OPTION_TEXT}
					question={language.data.deleteItemText(language.data.EVENT)}
					onAgree={handleAcceptDialogAndDeleteItem}
					onDisagree={() => setToAction(CRUDEnum.NOP)}
				/>
				{selectedItem && (
					<CardEvent
						open={toAction === CRUDEnum.READ}
						item={selectedItem}
						onClose={handleClose}
						onEdit={handleEditOption}
						onDelete={handleDeleteOption}
					/>
				)}
			</div>
		)
	}

	return (
		<DinoTabPanel
			panels={[
				{ Label: language.data.MENU_CALENDAR, Component: renderCalendar() },
				{
					Label: language.data.MENU_SETTINGS,
					Component: <CalendarSettings eventTypes={eventTypes} />,
				},
			]}
		/>
	)
}

export default Calendar
