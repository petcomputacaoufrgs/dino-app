import React, { useState, useEffect } from 'react'
import ContactFormDialogProps from './props'
import ContactFormDialogHeader from './header'
import ContactFormDialogContent from './content'
import ContactEntity from '../../../../types/contact/database/ContactEntity'
import PhoneEntity from '../../../../types/contact/database/PhoneEntity'
import Constants from '../../../../constants/app_data/DataConstants'
import StringUtils from '../../../../utils/StringUtils'
import ContactView, { ContactType, PhoneType } from '../../../../types/contact/view/ContactView'
import { useLanguage } from '../../../../context/language'
import ContactService from '../../../../services/contact/ContactService'
import PhoneService from '../../../../services/contact/PhoneService'
import EssentialContactService from '../../../../services/contact/EssentialContactService'
import SelectMultipleTreatments from '../../../../components/settings/select_multiple_treatments'
import EssentialContactEntity from '../../../../types/contact/database/EssentialContactEntity'
import DinoHr from '../../../../components/dino_hr'
import { IsStaff } from '../../../../context/private_router'
import DinoDialog from '../../../../components/dialogs/dino_dialog'
import EssentialPhoneEntity from '../../../../types/contact/database/EssentialPhoneEntity'
import EssentialPhoneService from '../../../../services/contact/EssentialPhoneService'
import ContactViewService from '../../../../services/contact/ContactViewService'
import './styles.css'

const getContact = (item?: ContactView): ContactType =>
	item ? item.contact : { name: '', description: '', }

const getPhones = (item?: ContactView): PhoneType[] =>
	item ? item.phones : [{ number: '', type: Constants.CONTACT_PHONE_CODE_MOBILE, }]

const getTreatmentLocalIds = (item?: ContactView): number[] => 
	item ? (item?.contact as EssentialContactEntity).treatmentLocalIds || [] : []

const ContactFormDialog: React.FC<ContactFormDialogProps> = (
	{
		dialogOpen,
		onClose,
		item,
		items
	}) => {
	const staff = IsStaff()
	const language = useLanguage()
	const [contact, setContact] = useState(getContact(item))
	const [contactPhones, setContactPhones] = useState(getPhones(item))
	const [phonesToDelete, setPhonesToDelete] = useState<PhoneEntity[]>([])
	const [errorName, setErrorName] = useState<string>()
	const [errorPhone, setErrorPhone] = useState<string>()
	const [selectedTreatmentLocalIds, setSelectedTreatmentLocalIds] = useState<number[]>(getTreatmentLocalIds(item))
	
	useEffect(() => {
		if (dialogOpen) {
			setContact(getContact(item))
			setContactPhones(getPhones(item))
			setErrorName(undefined)
			setErrorPhone(undefined)
			setSelectedTreatmentLocalIds(getTreatmentLocalIds(item))
		}
	}, [dialogOpen, item])

	const handleSave = () => {
		function validInfo(): boolean {
			if (StringUtils.isEmpty(contact.name)) {
				setErrorName(language.data.EMPTY_FIELD_ERROR)
				return false
			}

			if (staff) {
				const hasAtLeastOnePhone = contactPhones.some(p => StringUtils.isNotEmpty(p.number))
				if (!hasAtLeastOnePhone) {
					setErrorPhone(language.data.ESSENTIAL_CONTACT_MUST_HAVE_PHONE)
					return false
				}
			}
				
			const hasViewWithSamePhone = ContactViewService.getContactWithSamePhone(items, contactPhones, item)
				
			if (hasViewWithSamePhone) {
				handleTakenNumber(hasViewWithSamePhone)
					
				return false
			}

			return true
		}

		function handleTakenNumber(viewWithSamePhone: ContactView) {
			const phone = contactPhones.find(phone =>
				viewWithSamePhone.phones
					.map(phone => phone.number)
					.includes(phone.number),
			)
			if (phone) setErrorPhone(`${language.data.CONTACT_NUMBER_ALREADY_EXISTS} ${viewWithSamePhone.contact.name}`)
		}

		if (validInfo()) {
			saveContact()
			onClose()
		}
	}

	const saveContact = async () => {
		async function savePhones(contact: ContactEntity | EssentialContactEntity) {
			const newPhones = contactPhones.filter(phone => phone.number !== '')
			console.log(newPhones)
			if (staff) {
				newPhones.forEach(ePhone => ((ePhone as EssentialPhoneEntity).localEssentialContactId = contact.localId))
			} else {
				newPhones.forEach(phone => ((phone as PhoneEntity).localContactId = contact.localId))
			}

			if (newPhones.length > 0) {
				console.log(newPhones)
				staff ? await EssentialPhoneService.saveAll(newPhones) : await PhoneService.saveAll(newPhones)
			}

			if (phonesToDelete.length > 0) {
				staff ? await EssentialPhoneService.deleteAll(phonesToDelete) : await PhoneService.deleteAll(phonesToDelete)
			}
		}

		async function saveContactAndPhones() {
			const saved = await ContactService.save(contact)
			if (saved) {
				await savePhones(saved)
			}
		}

		async function saveEssentialContactAndPhones() {
			const essentialContact: EssentialContactEntity = {
				...contact,
				treatmentLocalIds: selectedTreatmentLocalIds,
				isUniversal: selectedTreatmentLocalIds.length > 0 ? 0 : 1,
			}

			const saved = await EssentialContactService.save(essentialContact)
			if (saved) {
				await savePhones(saved)
			}
		}

		staff ? saveEssentialContactAndPhones() : saveContactAndPhones()
	}

	const handleAddPhone = () => {
		contactPhones.push({
			number: '',
			type: Constants.CONTACT_PHONE_CODE_MOBILE,
		})
		setContactPhones([...contactPhones])
	}

	const handleDeletePhone = (number: string) => {
		if (!staff || contactPhones.length > 1) {
			const indexPhone = contactPhones.findIndex(
				phone => phone.number === number,
			)
			phonesToDelete.push(contactPhones[indexPhone])
			contactPhones.splice(indexPhone, 1)
			setPhonesToDelete([...phonesToDelete])
			setContactPhones([...contactPhones])
		} else {
			setErrorPhone(language.data.ESSENTIAL_CONTACT_MUST_HAVE_PHONE)
		}
	}

	const handleChangeTreatments = (ids: number[]) => {
		setSelectedTreatmentLocalIds([...ids])
	}

	const renderSelectTreatments = () => {
		return (
			<>
				<DinoHr />
				<SelectMultipleTreatments
					selectedLocalIds={selectedTreatmentLocalIds}
					handleChange={handleChangeTreatments}
				/>
			</>
		)
	}

	return (
		<div className="contact__form">
			<DinoDialog
				open={dialogOpen}
				onClose={onClose}
				onSave={handleSave}
				header={
					<ContactFormDialogHeader
						contact={contact}
						setContact={setContact}
						handleCloseDialog={onClose}
					/>
				}
			>
				<ContactFormDialogContent
					contact={contact}
					setContact={setContact}
					phones={contactPhones}
					setPhones={setContactPhones}
					errorName={errorName}
					errorPhone={errorPhone}
					handleDeletePhone={handleDeletePhone}
					handleAddPhone={handleAddPhone}
				>
					{staff && renderSelectTreatments()}
				</ContactFormDialogContent>
			</DinoDialog>
		</div>
	)
}

export default ContactFormDialog
