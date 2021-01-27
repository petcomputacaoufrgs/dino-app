import React, { useState, useEffect } from 'react'
import { ContactFormDialogProps } from './props'
import ColorConstants from '../../../../constants/app/ColorConstants'
import Button from '../../../../components/button/text_button'
import { Dialog, DialogActions, DialogContent } from '@material-ui/core'
import ContactFormDialogHeader from './header'
import ContactFormDialogContent from './content'
import TransitionSlide from '../../../../components/slide_transition'
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
import './styles.css'
import DinoHr from '../../../../components/dino_hr'
import { usePrivateRouter } from '../../../../context/private_router'
import UserEnum from '../../../../types/enum/UserEnum'

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

const ContactFormDialog: React.FC<ContactFormDialogProps> = React.forwardRef(
	(
		{ dialogOpen, onClose, action, item, items },
		ref: React.Ref<unknown>,
	) => {
		const language = useLanguage()
		const [contact, setContact] = useState(getContact(item))
		const [contactPhones, setContactPhones] = useState(getPhones(item))
		const [phonesToDelete, setPhonesToDelete] = useState<PhoneEntity[]>([])
		const [invalidName, setInvalidName] = useState(false)
		const [invalidPhone, setInvalidPhone] = useState({ number: '', text: '' })
		const [selectedTreatmentLocalIds, setSelectedTreatmentLocalIds] = useState<number[]>([])
		const staff = usePrivateRouter().userPermission === UserEnum.STAFF

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
			function validInfo(): string {
				setInvalidName(StringUtils.isEmpty(contact.name))
				setInvalidPhone({ number: '', text: '' })
				return contact.name
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
				const viewWithSamePhone = PhoneService.getContactWithSamePhone(
					items,
					contactPhones,
					item,
				)

				if (viewWithSamePhone) {
					handleTakenNumber(viewWithSamePhone)
				} else {
					saveContact()
					onClose()
				}
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

    return (
      <div className="contact__form">
        <Dialog
          ref={ref}
          open={dialogOpen}
          maxWidth="xl"
          fullWidth
          onClose={onClose}
          TransitionComponent={TransitionSlide}
          disableBackdropClick
        >
          <ContactFormDialogHeader
            action={action}
						contact={contact}
						setContact={setContact}
            handleCloseDialog={onClose}
          />
          <DialogContent dividers>
            <ContactFormDialogContent
							action={action}
							contact={contact}
							setContact={setContact}
							phones={contactPhones}
							setPhones={setContactPhones}
              invalidName={invalidName}
              helperTextInvalidPhone={invalidPhone}
              handleDeletePhone={handleDeletePhone}
              handleAddPhone={handleAddPhone}
            >
              {staff && (
								<> <DinoHr />
								<SelectMultipleTreatments 
									selectedLocalIds={selectedTreatmentLocalIds}
									setSelectedLocalIds={setSelectedTreatmentLocalIds}
								/> </>
							)}
            </ContactFormDialogContent>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>
              {language.data.DIALOG_CANCEL_BUTTON_TEXT}
            </Button>
            <Button onClick={handleSave}>
              {language.data.DIALOG_SAVE_BUTTON_TEXT}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
)

export default ContactFormDialog
