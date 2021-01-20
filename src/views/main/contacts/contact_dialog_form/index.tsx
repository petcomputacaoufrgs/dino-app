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
import ContactsConstants from '../../../../constants/contact/ContactsConstants'
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
					type: ContactsConstants.MOBILE,
				},
		  ]
}

const ContactFormDialog = React.forwardRef(
	(
		{ dialogOpen, onClose, action, item, items }: ContactFormDialogProps,
		ref: React.Ref<unknown>,
	) => {
		const language = useLanguage()
		const [contact, setContact] = useState(getContact(item))
		const [contactPhones, setContactPhones] = useState(getPhones(item))
		const [phonesToDelete, setPhonesToDelete] = useState<PhoneEntity[]>([])
		const [invalidName, setInvalidName] = useState(false)
		const [invalidPhone, setInvalidPhone] = useState({ number: '', text: '' })
		const [selectedTreatmentLocalIds, setSelectedTreatmentLocalIds] = useState<
			number[]
		>([])

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

				let attr = 'localEssentialContactId'
				if (action !== ContactsConstants.ACTION_ADD_ESSENTIAL) {
					attr = 'localContactId'
				}

				newPhones.forEach(phone => (phone[attr] = contact.localId))

				if (newPhones.length > 0) {
					await PhoneService.saveAll(newPhones)
				}

				if (phonesToDelete.length > 0) {
					await PhoneService.deleteAll(phonesToDelete)
				}

				await GoogleContactService.saveGoogleContact(
					contact,
					item?.googleContact,
				)
			}

			switch (action) {
				case ContactsConstants.ACTION_EDIT:
					if (item && Utils.isNotEmpty(item.contact.localId)) {
						const savedContact = await ContactService.save(contact)
						if (savedContact) {
							await savePhones(savedContact)
						}
					}
					break
				case ContactsConstants.ACTION_ADD:
					const savedContact = await ContactService.save(contact)
					if (savedContact) {
						await savePhones(savedContact)
					}
					break
				case ContactsConstants.ACTION_ADD_ESSENTIAL:
					const newEssentialContact: EssentialContactEntity = {
						...contact,
						treatmentLocalIds: selectedTreatmentLocalIds,
						isUniversal: selectedTreatmentLocalIds.length > 0 ? 1 : 0,
					}

					const savedEssentialContact = await EssentialContactService.save(
						newEssentialContact,
					)
					if (savedEssentialContact) {
						await savePhones(savedEssentialContact)
					}
					break
			}
		}

		const handleChangeColor = () => {
			const colors = ColorConstants.COLORS
			const index = colors.findIndex(c => c === contact.color)
			const color = colors[(index + 1) % colors.length]
			setContact({ ...contact, color })
		}

		const handleAddPhone = () => {
			contactPhones.push({
				number: '',
				type: ContactsConstants.MOBILE,
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

		const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
			const name = event.target.value as string
			setContact({ ...contact, name })
		}

		const handleChangeDescription = (
			event: React.ChangeEvent<HTMLInputElement>,
		) => {
			const description = event.target.value as string
			setContact({ ...contact, description })
		}

		const handleChangeType = (
			event: React.ChangeEvent<HTMLInputElement>,
			index: number,
		) => {
			contactPhones[index].type = Number(event.target.value)
			setContactPhones([...contactPhones])
		}

		const handleChangeNumber = (
			event: React.ChangeEvent<HTMLInputElement>,
			index: number,
		) => {
			contactPhones[index].number = event.target.value as string
			setContactPhones([...contactPhones])
		}

		return (
			<div className='contact__form'>
				<Dialog
					ref={ref}
					style={{ margin: '0rem' }}
					open={dialogOpen}
					maxWidth='xl'
					fullWidth
					onClose={onClose}
					TransitionComponent={TransitionSlide}
					disableBackdropClick
				>
					<ContactFormDialogHeader
						action={action}
						name={contact.name}
						color={contact.color}
						handleChangeColor={handleChangeColor}
						handleCloseDialog={onClose}
					/>
					<DialogContent dividers>
						<ContactFormDialogContent
							name={contact.name}
							description={contact.description || ''}
							phones={contactPhones}
							helperText={invalidPhone}
							invalidName={invalidName}
							handleChangeName={handleChangeName}
							handleChangeDescription={handleChangeDescription}
							handleChangeType={handleChangeType}
							handleChangeNumber={handleChangeNumber}
							handleDeletePhone={handleDeletePhone}
							handleAddPhone={handleAddPhone}
						>
							{action === ContactsConstants.ACTION_ADD_ESSENTIAL ? (
								<SelectMultipleTreatments
									selectedLocalIds={selectedTreatmentLocalIds}
									setSelectedLocalIds={setSelectedTreatmentLocalIds}
								/>
							) : (
								<></>
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
	},
)

export default ContactFormDialog
