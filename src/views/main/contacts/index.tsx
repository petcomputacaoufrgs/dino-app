import React, { useEffect, useState } from 'react'
import ContactItems from './contact_list_items'
import MuiSearchBar from '../../../components/mui_search_bar'
import ContactFormDialog from './contact_dialog_form'
import Contants from '../../../constants/contact/ContactsConstants'
import GoogleGrantDialog from '../../../components/google_grant_dialog'
import GoogleScope from '../../../types/auth/google/GoogleScope'
import Loader from '../../../components/loader'
import { useLanguage } from '../../../context/language'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import UserSettingsService from '../../../services/user/UserSettingsService'
import GoogleScopeService from '../../../services/auth/google/GoogleScopeService'
import ContactView from '../../../types/contact/view/ContactView'
import ContactService from '../../../services/contact/ContactService'
import PhoneService from '../../../services/contact/PhoneService'
import GoogleContactService from '../../../services/contact/GoogleContactService'
import 'bootstrap/dist/css/bootstrap.min.css'
import EssentialContactService from '../../../services/contact/EssentialContactService'
import EssentialContactView from '../../../types/contact/view/EssentialContactView'
import { IsStaff } from '../../../context/private_router'
import AddButton from '../../../components/button/circular_button/add_button'

const Contacts: React.FC = () => {

	const staff = IsStaff()
	const language = useLanguage()

	const [isLoading, setIsLoading] = useState(true)
	const [contacts, setContacts] = useState<ContactView[] | EssentialContactView[]>([])
	const [settings, setSettings] = useState<UserSettingsEntity | undefined>(
		undefined,
	)
	const [syncGoogleContacts, setSyncGoogleContacts] = useState(false)

	const [openGrantDialog, setOpenGrantDialog] = useState(false)
	const [add, setAdd] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [shouldDecline, setShouldDecline] = useState(false)

	const filteredContacts = ContactService.filterContactViews(
		contacts,
		searchTerm,
	)

	useEffect(() => {
		const loadData = async () => {
			const settings = await UserSettingsService.getFirst()
			const phones = await PhoneService.getAll()

			if(staff) {
				const eContacts = await EssentialContactService.getAll() 
				const eContactViews = EssentialContactService.getEssentialContactViews(
					eContacts,
					phones,
				)

				updateContacts(eContactViews)
			} else {
				const contacts = await ContactService.getAll() 
				const googleContacts = await GoogleContactService.getAll()
				const syncGoogleContacts = await GoogleScopeService.hasContactGrant()
	
				const contactViews = ContactService.getContactViews(
					contacts,
					phones,
					googleContacts,
				)

				updateContacts(contactViews)
				updateSyncGoogleContacts(syncGoogleContacts)
			}

			updateSettings(settings)
			finishLoading()
		}

		ContactService.addUpdateEventListenner(loadData)
		PhoneService.addUpdateEventListenner(loadData)
		GoogleContactService.addUpdateEventListenner(loadData)
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
			GoogleContactService.removeUpdateEventListenner(loadData)
			UserSettingsService.removeUpdateEventListenner(loadData)
			GoogleScopeService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

	const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
		setSearchTerm(event.target.value)
	}

	const handleAcceptGoogleGrant = async () => {
		setOpenGrantDialog(false)
		setAdd(true)
		if (settings) {
			settings.declineGoogleContacts = false
			await UserSettingsService.save(settings)
			GoogleContactService.activeGoogleContactsGrant()
		}
	}

	const handleCloseGoogleGrant = () => {
		setOpenGrantDialog(false)
		setAdd(true)
	}

	const handleDeclineGoogleGrant = () => {
		setShouldDecline(true)
		setOpenGrantDialog(false)
		setAdd(true)
	}

	const handleAddContact = () => {
		if (settings && !staff) {
			if (!syncGoogleContacts && !settings.declineGoogleContacts) {
				setOpenGrantDialog(true)
				return
			}
		}

		setAdd(true)
	}

	const handleClose = () => {
		setAdd(false)
		if (shouldDecline && settings) {
			settings.declineGoogleContacts = true
			UserSettingsService.save(settings)
		}
	}

	return (
		<div className='contacts'>
			<Loader className='contacts__loader' isLoading={isLoading}>
				<MuiSearchBar
					value={searchTerm}
					onChange={handleChange}
					placeholder={language.data.SEARCH_HOLDER}
				/>
				<ContactItems items={filteredContacts} />
			</Loader>
			<AddButton
				handleAdd={handleAddContact}
				label={language.data.NEW_CONTACT}
			/>
			<ContactFormDialog
				items={contacts}
				action={Contants.ADD}
				dialogOpen={add}
				onClose={handleClose}
			/>
			<GoogleGrantDialog
				onAccept={handleAcceptGoogleGrant}
				onDecline={handleDeclineGoogleGrant}
				onClose={handleCloseGoogleGrant}
				open={openGrantDialog}
				scopes={[GoogleScope.SCOPE_CONTACT]}
				text={language.data.GOOGLE_CONTACT_GRANT_TEXT}
				title={language.data.GOOGLE_CONTACT_GRANT_TITLE}
			/>
		</div>
	)
}

export default Contacts
