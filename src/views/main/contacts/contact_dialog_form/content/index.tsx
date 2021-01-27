import React from 'react'
import TextField from '@material-ui/core/TextField'
import { ContactFormDialogContentProps } from './props'
import PhoneFields from './phone_fields'
import Typography from '@material-ui/core/Typography'
import Constants from '../../../../../constants/contact/ContactsConstants'
import TextButton from '../../../../../components/button/text_button'
import { useLanguage } from '../../../../../context/language'
import './styles.css'
import ContactsConstants from '../../../../../constants/contact/ContactsConstants'

const ContactFormDialogContent: React.FC<ContactFormDialogContentProps> = (
	props,
) => {
	const language = useLanguage()

	const isNumberTaken = (tel: string): boolean => props.helperTextInvalidPhone.number === tel

	const isNumberInvalid = (tel: string) => isNumberTaken(tel)

	const isNameInvalid = (name: string) => name.length === Constants.NAME_MAX || props.invalidName

	const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
		const name = event.target.value as string
		props.setContact({ ...props.contact, name })
	}

	const handleChangeDescription = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const description = event.target.value as string
		props.setContact({ ...props.contact, description })
	}

	const handleChangeType = (
		event: React.ChangeEvent<HTMLInputElement>,
		index: number,
	) => {
		props.phones[index].type = Number(event.target.value)
		props.setPhones([...props.phones])
	}

	const handleChangeNumber = (
		event: React.ChangeEvent<HTMLInputElement>,
		index: number,
	) => {
		props.phones[index].number = event.target.value as string
		props.setPhones([...props.phones])
	}

	return (
		<div className='dialog_form__content'>
			<TextField
				required
				fullWidth
				value={props.contact.name}
				onChange={handleChangeName}
				margin='dense'
				id='name'
				label={`${language.data.FORM_NAME}`}
				type='name'
				inputProps={{ maxLength: Constants.NAME_MAX }}
				error={isNameInvalid(props.contact.name)}
			/>
			<br />
			<TextField
				fullWidth
				value={props.contact.description}
				onChange={handleChangeDescription}
				margin='dense'
				id='description'
				label={`${language.data.FORM_DESCRIPTION}`}
				type='text'
				inputProps={{ maxLength: Constants.DESCRIPTION_MAX }}
				error={props.contact.description?.length === Constants.DESCRIPTION_MAX}
			/>
			<br />

			{props.phones.map((phone, index) => (
				<div key={index}>
					<PhoneFields
						type={phone.type}
						onChangeType={e => handleChangeType(e, index)}
						number={phone.number}
						onChangeNumber={e => handleChangeNumber(e, index)}
						error={isNumberInvalid(phone.number)}
						helperText={
							isNumberTaken(phone.number) ? props.helperTextInvalidPhone.text : ''
						}
						handleDeletePhone={() => props.handleDeletePhone(phone.number)}
					/>
					<br />
				</div>
			))}
			<TextButton className='add-phone__button' onClick={props.handleAddPhone}>
				<Typography variant='body2' color='textSecondary' display='block'>
					{'+ ' + language.data.FORM_ADD_PHONE}
				</Typography>
			</TextButton>
			{props.children}
		</div>
	)
}

export default ContactFormDialogContent
