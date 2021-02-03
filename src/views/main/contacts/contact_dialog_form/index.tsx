import React, { useState, useEffect } from 'react'
import { ContactFormDialogProps } from './props'
import ContactFormDialogHeader from './header'
import ContactFormDialogContent from './content'
import ContactEntity from '../../../../types/contact/database/ContactEntity'
import PhoneEntity from '../../../../types/contact/database/PhoneEntity'
import Constants from '../../../../constants/contact/ContactsConstants'
import StringUtils from '../../../../utils/StringUtils'
import ContactView from '../../../../types/contact/view/ContactView'
import Utils from '../../../../utils/Utils'
import { useLanguage } from '../../../../context/language'
import ContactService from '../../../../services/contact/ContactService'
import PhoneService from '../../../../services/contact/PhoneService'
import GoogleContactService from '../../../../services/contact/GoogleContactService'
import EssentialContactService from '../../../../services/contact/EssentialContactService'
import SelectMultipleTreatments from '../../../../components/settings/select_multiple_treatments'
import EssentialContactEntity from '../../../../types/contact/database/EssentialContactEntity'
import DinoHr from '../../../../components/dino_hr'
import { IsStaff } from '../../../../context/private_router'
import './styles.css'
import DinoDialog from '../../../../components/dialogs/dino_dialog'

const getContact = (item: ContactView | undefined): ContactEntity => {
	return item
		? item.contact
		: {
				name: '',
				description: '',
				color: undefined,
		  }
}

const getPhones = (item: ContactView | undefined): PhoneEntity[] => {
	return item
		? item.phones
		: [
				{
					number: '',
					type: Constants.MOBILE,
				},
		  ]
}

const ContactFormDialog: React.FC<ContactFormDialogProps> = ({ dialogOpen, onClose, action, item, items }) => {
		const language = useLanguage()
		const [contact, setContact] = useState(getContact(item))
		const [contactPhones, setContactPhones] = useState(getPhones(item))
		const [phonesToDelete, setPhonesToDelete] = useState<PhoneEntity[]>([])
		const [invalidName, setInvalidName] = useState(false)
		const [invalidPhone, setInvalidPhone] = useState({ number: 'dummy text', text: '' })
		const [selectedTreatmentLocalIds, setSelectedTreatmentLocalIds] = useState<number[]>([])
		const staff = IsStaff()

		useEffect(() => {
			if (dialogOpen) {
				setContact(getContact(item))
				setContactPhones(getPhones(item))
				setInvalidName(false)
				setInvalidPhone({ number: 'dummy text', text: '' })
				setSelectedTreatmentLocalIds([])
			}
		}, [dialogOpen, item])

		const handleSave = (): void => {

			function validInfo(): boolean {

				const nameIsNotEmpty = !StringUtils.isEmpty(contact.name)
				if(!nameIsNotEmpty){
					setInvalidName(StringUtils.isEmpty(contact.name))
				}
				
				const atLeastOnePhoneNotEmptyAsStaff = !staff || contactPhones.some(p => p.number !== '')
				if(!atLeastOnePhoneNotEmptyAsStaff) {
					setInvalidPhone({number: '', text: 'Contato Essencial deve ter um telefone'})
				}

				const hasViewWithSamePhone = PhoneService.getContactWithSamePhone(items, contactPhones, item)
				if (hasViewWithSamePhone) {
					handleTakenNumber(hasViewWithSamePhone)
				}

				return nameIsNotEmpty && atLeastOnePhoneNotEmptyAsStaff && !hasViewWithSamePhone
			}

			function handleTakenNumber(viewWithSamePhone: ContactView) {
				const phone = contactPhones.find(phone =>
					viewWithSamePhone.phones
						.map(phone => phone.number)
						.includes(phone.number),
				)
				if (phone)
					setInvalidPhone({
						number: phone.number,
						text: `${language.data.CONTACT_NUMBER_ALREADY_EXISTS} ${viewWithSamePhone.contact.name}`,
					})
			}

			if (validInfo()) {
					saveContact()
					onClose()
			}
		}

		const saveContact = async () => {

			async function savePhones(
				contact: ContactEntity | EssentialContactEntity,
			) {
				const newPhones = contactPhones.filter(phone => phone.number !== '')

				if (staff) {
					newPhones.forEach(phone => (phone.localEssentialContactId = contact.localId))
				} else {
					newPhones.forEach(phone => (phone.localContactId = contact.localId))
				}

				if (newPhones.length > 0) {
					await PhoneService.saveAll(newPhones)
				}

				if (phonesToDelete.length > 0) {
					await PhoneService.deleteAll(phonesToDelete)
				}

				if(item && 'googleContact' in item) {
					await GoogleContactService.saveGoogleContact(
						contact,
						item.googleContact,
					)
				}
			}

			async function saveContactAndPhones() {
				const saved = await ContactService.save(contact)
				if (saved) {
					await savePhones(saved)
				}
			}

			async function saveEssentialContactAndPhones() {
				const newEssentialContact: EssentialContactEntity = {
					...contact,
					treatmentLocalIds: selectedTreatmentLocalIds,
					isUniversal: selectedTreatmentLocalIds.length > 0 ? 0 : 1,
				}
				
				const saved = await EssentialContactService.save(newEssentialContact)
				if (saved) {
					await savePhones(saved)
				}
			}

			const isEditAndItemIsValid = item && Utils.isNotEmpty(item.contact.localId)

			if(action === Constants.ADD || isEditAndItemIsValid) {
				staff ? saveEssentialContactAndPhones() : saveContactAndPhones()
			}
		}

		const handleAddPhone = () => {
			contactPhones.push({
				number: '',
				type: Constants.MOBILE,
			})
			setContactPhones([...contactPhones])
		}

		const handleDeletePhone = (number: string) => {
			const indexPhone = contactPhones.findIndex(
				phone => phone.number === number,
			)
			phonesToDelete.push(contactPhones[indexPhone])
			contactPhones.splice(indexPhone, 1)
			setPhonesToDelete([...phonesToDelete])
			setContactPhones([...contactPhones])
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
					handleClose={onClose}
					handleSave={handleSave}
					header={
						<ContactFormDialogHeader
							contact={contact}
							setContact={setContact}
							handleCloseDialog={onClose}
						/>}
        >
					<ContactFormDialogContent
						contact={contact}
						setContact={setContact}
						phones={contactPhones}
						setPhones={setContactPhones}
						invalidName={invalidName}
						helperTextInvalidPhone={invalidPhone}
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
