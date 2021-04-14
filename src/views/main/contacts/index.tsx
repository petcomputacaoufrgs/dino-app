import React, { useEffect, useState } from 'react'
import ContactItems from './contact_list_items'
import MuiSearchBar from '../../../components/mui_search_bar'
import ContactFormDialog from './contact_dialog_form'
import GoogleGrantDialog from '../../../components/google_grant_dialog'
import GoogleScope from '../../../types/auth/google/GoogleScope'
import DinoLoader from '../../../components/loader'
import { useLanguage } from '../../../context/language'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import UserSettingsService from '../../../services/user/UserSettingsService'
import GoogleScopeService from '../../../services/auth/google/GoogleScopeService'
import ContactView from '../../../types/contact/view/ContactView'
import ContactService from '../../../services/contact/ContactService'
import PhoneService from '../../../services/contact/PhoneService'
import EssentialContactService from '../../../services/contact/EssentialContactService'
import { IsStaff } from '../../../context/private_router'
import AddButton from '../../../components/button/circular_button/add_button'
import ContactViewService from '../../../services/contact/ContactViewService'
import EssentialPhoneService from '../../../services/contact/EssentialPhoneService'
import 'bootstrap/dist/css/bootstrap.min.css'

const Contacts: React.FC = () => {
	const staff = IsStaff()
	const language = useLanguage()
	const [isLoading, setIsLoading] = useState(true)
	const [contacts, setContacts] = useState<ContactView[]>([])
	const [settings, setSettings] = useState<UserSettingsEntity>()
	const [syncGoogleContacts, setSyncGoogleContacts] = useState(false)
	const [openGrantDialog, setOpenGrantDialog] = useState(false)
	const [toAdd, setToAdd] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [shouldDecline, setShouldDecline] = useState(false)

	const filteredContacts = ContactViewService.filterContactViews(contacts, searchTerm)

	useEffect(() => {
		const loadUserData = async () => {
			const syncGoogleContacts = await GoogleScopeService.hasContactGrant()
			updateSyncGoogleContacts(syncGoogleContacts)

			return await ContactService.getAll()
		} 

		const loadContacts = async () => (
			staff ? EssentialContactService.getAll() : loadUserData()
		)

		const loadPhones = async () => (
			staff ? EssentialPhoneService.getAll() : PhoneService.getAll()
		)

		const loadData = async () => {
			const settings = await UserSettingsService.getFirst()
			const phones = await loadPhones()
			const contacts = await loadContacts()

			const contactViews = ContactViewService.getContactViews(
				contacts,
				phones,
				staff
			)

			updateContacts(contactViews)
			updateSettings(settings)
			finishLoading()
		}

		ContactService.addUpdateEventListenner(loadData)
		PhoneService.addUpdateEventListenner(loadData)
		EssentialContactService.addUpdateEventListenner(loadData)
		EssentialPhoneService.addUpdateEventListenner(loadData)
		UserSettingsService.addUpdateEventListenner(loadData)
		GoogleScopeService.addUpdateEventListenner(loadData)

		let updateContacts = (contactViews: ContactView[]) => {
			setContacts(contactViews)
		}

		let updateSettings = (settings: UserSettingsEntity | undefined) => {
			setSettings(settings)
		}

		let updateSyncGoogleContacts = (syncGoogleContacts: boolean) => {
			setSyncGoogleContacts(syncGoogleContacts)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		if (isLoading) {
			loadData()
		}

		return () => {
			updateContacts = () => {}
			updateSettings = () => {}
			updateSyncGoogleContacts = () => {}
			finishLoading = () => {}
			ContactService.removeUpdateEventListenner(loadData)
			PhoneService.removeUpdateEventListenner(loadData)
			EssentialContactService.removeUpdateEventListenner(loadData)
			EssentialPhoneService.removeUpdateEventListenner(loadData)
			UserSettingsService.removeUpdateEventListenner(loadData)
			GoogleScopeService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading, staff])

	const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
		setSearchTerm(event.target.value)
	}

	const handleAcceptGoogleGrant = async () => {
		setOpenGrantDialog(false)
		setToAdd(true)
		if (settings) {
			settings.declineGoogleContacts = false
			await UserSettingsService.save(settings)
		}
	}

	const handleCloseGoogleGrant = () => {
		setOpenGrantDialog(false)
		setToAdd(true)
	}

	const handleDeclineGoogleGrant = () => {
		setShouldDecline(true)
		setOpenGrantDialog(false)
		setToAdd(true)
	}

	const handleAddContact = () => {
		if (settings && !staff) {
			if (!syncGoogleContacts && !settings.declineGoogleContacts) {
				setOpenGrantDialog(true)
				return
			}
		}

		setToAdd(true)
	}

	const handleClose = () => {
		setToAdd(false)
		if (shouldDecline && settings) {
			settings.declineGoogleContacts = true
			UserSettingsService.save(settings)
		}
	}

	return (
		<div className='contacts'>
			<DinoLoader className='contacts__loader' isLoading={isLoading}>
				<MuiSearchBar
					value={searchTerm}
					onChange={handleChange}
				/>
				<ContactItems items={filteredContacts} />
			</DinoLoader>
			<AddButton
				handleAdd={handleAddContact}
				label={language.data.NEW_CONTACT}
			/>
			<ContactFormDialog
				items={contacts}
				dialogOpen={toAdd}
				onClose={handleClose}
			/>
			<GoogleGrantDialog
				onAccept={handleAcceptGoogleGrant}
				onDecline={handleDeclineGoogleGrant}
				onClose={handleCloseGoogleGrant}
				open={openGrantDialog}
				scopes={[GoogleScope.CONTACT_SCOPE]}
				text={language.data.GOOGLE_CONTACT_GRANT_TEXT}
				title={language.data.GOOGLE_CONTACT_GRANT_TITLE}
			/>
		</div>
	)
}

export default Contacts
