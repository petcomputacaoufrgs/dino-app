import React, { useEffect, useState } from 'react'
import { cameFromEssential, filterContactViews, getContactViews, isUniversalEssential } from '../../../services/contact/ContactViewService'
import ContactItems from './contact_list_items'
import DinoSearchBar from '../../../components/search_bar'
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
import { Star, Public } from '@material-ui/icons'
import DinoFilterList from '../../../components/list_components/filter_list'
import ListTitle from '../../../components/list_components/list_title'
import { getContactFilter } from '../../../utils/FilterUtils'
import CRUDEnum from '../../../types/enum/CRUDEnum'
import 'bootstrap/dist/css/bootstrap.min.css'

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
	const [toAction, setToAction] = useState(CRUDEnum.NOP)
	const [searchTerm, setSearchTerm] = useState('')
	const [shouldDecline, setShouldDecline] = useState(false)
	const [filters, setFilters] = useState(getContactFilter(hasStaffPowers, language))

	let filteredContacts = filterContactViews(contacts, searchTerm)
	.filter(c => filters.some(f => f.checked && f.validator(c.contact)))

	const handleChangeChecked = (index: number) => {
		const filter = filters[index]
		filter.checked = !filter.checked
		setFilters([...filters])
	} 

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
		handleCreate()
		if (settings) {
			settings.declineGoogleContacts = false
			await UserSettingsService.save(settings)
		}
	}

	const handleCloseGoogleGrant = () => {
		setOpenGrantDialog(false)
		handleCreate()
	}

	const handleDeclineGoogleGrant = () => {
		setShouldDecline(true)
		setOpenGrantDialog(false)
		handleCreate()
	}

	const handleAddContact = () => {
		if (settings && !hasStaffPowers) {
			if (!syncGoogleContacts && !settings.declineGoogleContacts) {
				setOpenGrantDialog(true)
				return
			}
		}
		handleCreate()
	}

	const handleClose = () => {
		setToAction(CRUDEnum.NOP)
		if (shouldDecline && settings) {
			settings.declineGoogleContacts = true
			UserSettingsService.save(settings)
		}
	}

	const handleCreate = () => setToAction(CRUDEnum.CREATE)

	return (
		<div className='contacts'>
			<DinoLoader className='contacts__loader' isLoading={isLoading}>
				<DinoSearchBar
					value={searchTerm}
					onChange={handleChange}
				/>
				<div className="dino__flex_row dino__list_and_filter">
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
				dialogOpen={toAction === CRUDEnum.CREATE}
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
