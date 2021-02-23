import React from 'react'
import TextField from '@material-ui/core/TextField'
import { ContactFormDialogContentProps } from './props'
import PhoneFields from './phone_fields'
import Typography from '@material-ui/core/Typography'
import Constants from '../../../../../constants/contact/ContactsConstants'
import TextButton from '../../../../../components/button/text_button'
import { useLanguage } from '../../../../../context/language'
import './styles.css'

const ContactFormDialogContent: React.FC<ContactFormDialogContentProps> = (
	props,
) => {
	const language = useLanguage()

	const isNumberTaken = (tel: string): boolean => props.helperTextInvalidPhone?.number === tel

	const isNumberInvalid = (tel: string) => isNumberTaken(tel)

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
		<div className='contact__dialog_form__content'>
			<TextField
				className='dino_textfield'
				required
				fullWidth
				value={props.contact.name}
				onChange={handleChangeName}
				margin='dense'
				id='name'
				label={`${language.data.FORM_NAME}`}
				type='name'
				inputProps={{ maxLength: Constants.NAME_MAX }}
				error={props.invalidName}
				helperText={(props.invalidName && language.data.INVALID_VALUE) 
					|| `${props.contact.name.length}/${Constants.NAME_MAX}`}
			/>
			<br />
			<TextField
				className='dino_textfield'
				multiline
				rowsMax={5}
				fullWidth
				value={props.contact.description}
				onChange={handleChangeDescription}
				margin='dense'
				id='description'
				label={`${language.data.FORM_DESCRIPTION}`}
				type='text'
				inputProps={{ maxLength: Constants.DESCRIPTION_MAX }}
				error={props.contact.description?.length === Constants.DESCRIPTION_MAX}
				helperText={`${props.contact.description?.length}/${Constants.DESCRIPTION_MAX}`}
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
						helperText={isNumberTaken(phone.number) ? props.helperTextInvalidPhone?.text : ''}
						handleDeletePhone={() => props.handleDeletePhone(phone.number)}
					/>
					<br />
				</div>
			))}
			<TextButton className='add_phone__button' onClick={props.handleAddPhone}>
				<Typography variant='body2' color='textSecondary' display='block'>
					{'+ ' + language.data.FORM_ADD_PHONE}
				</Typography>
			</TextButton>
			{props.children}
		</div>
	)
}

export default ContactFormDialogContent
