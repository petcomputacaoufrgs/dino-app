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
import ContactView, { ContactType } from '../../../types/contact/view/ContactView'
import ContactService from '../../../services/contact/ContactService'
import PhoneService from '../../../services/contact/PhoneService'
import EssentialContactService from '../../../services/contact/EssentialContactService'
import { HasStaffPowers } from '../../../context/private_router'
import AddButton from '../../../components/button/circular_button/add_button'
import EssentialPhoneService from '../../../services/contact/EssentialPhoneService'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Star, Public } from '@material-ui/icons'
import DinoFilterList from '../../../components/list_components/filter_list'
import ListTitle from '../../../components/list_components/list_title'
import { cameFromEssential, filterContactViews, getContactFilter, getContactViews, 
	isUniversalEssential } from '../../../services/contact/ContactViewService'

export const renderIcon = (contact: ContactType) => {

	if(cameFromEssential(contact))
		return <Star /> 
	if(isUniversalEssential(contact)) 
		return <Public /> 
	if(contact.name)
		return contact.name[0].toUpperCase()
		
	return '?'	
}

const Contacts: React.FC = () => {
	const hasStaffPowers = HasStaffPowers()
	const language = useLanguage()
	const [isLoading, setIsLoading] = useState(true)
	const [contacts, setContacts] = useState<ContactView[]>([])
	const [settings, setSettings] = useState<UserSettingsEntity>()
	const [syncGoogleContacts, setSyncGoogleContacts] = useState(false)
	const [openGrantDialog, setOpenGrantDialog] = useState(false)
	const [toAdd, setToAdd] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [shouldDecline, setShouldDecline] = useState(false)
	const [filters, setFilters] = useState(getContactFilter(hasStaffPowers, language))

	let searchContacts = filterContactViews(contacts, searchTerm)

	const handleChangeChecked = (index: number) => {
		const filter = filters[index]
		filter.checked = !filter.checked
		setFilters([...filters])
	} 

	let filteredContacts = searchContacts.filter(c => filters.some(f => f.checked && f.validator(c.contact)))

	useEffect(() => {
		const loadUserData = async () => {
			const syncGoogleContacts = await GoogleScopeService.hasContactGrant()
			updateSyncGoogleContacts(syncGoogleContacts)

			return await ContactService.getAll()
		} 

		const loadContacts = async () => (
			hasStaffPowers ? EssentialContactService.getAll() : loadUserData()
		)

		const loadPhones = async () => (
			hasStaffPowers ? EssentialPhoneService.getAll() : PhoneService.getAll()
		)

		const loadData = async () => {
			const settings = await UserSettingsService.getFirst()
			const phones = await loadPhones()
			const contacts = await loadContacts()

			const contactViews = getContactViews(
				contacts,
				phones,
				hasStaffPowers
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
	}, [isLoading, hasStaffPowers])

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
		if (settings && !hasStaffPowers) {
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
				<div className="dino__flex_row" style={{"flex": "auto"}}>
					<ListTitle title={language.data.MENU_CONTACTS} />
					<DinoFilterList 
						filters={filters} 
						onChangeChecked={handleChangeChecked} 
					/>
				</div>
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
