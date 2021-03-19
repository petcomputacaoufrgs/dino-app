import React from 'react'
import TextField from '@material-ui/core/TextField'
import { ContactFormDialogContentProps } from './props'
import PhoneFields from './phone_fields'
import Typography from '@material-ui/core/Typography'
import Constants from '../../../../../constants/app_data/DataConstants'
import TextButton from '../../../../../components/button/text_button'
import { useLanguage } from '../../../../../context/language'
import './styles.css'

const ContactFormDialogContent: React.FC<ContactFormDialogContentProps> = (
	{contact, phones, children, errorName, errorPhone, setContact, setPhones, handleAddPhone, handleDeletePhone,}
) => {
	const language = useLanguage()

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
		phones[index].type = Number(event.target.value)
		setPhones([...phones])
	}

	const handleChangeNumber = (
		event: React.ChangeEvent<HTMLInputElement>,
		index: number,
	) => {
		phones[index].number = event.target.value as string
		setPhones([...phones])
	}

	return (
		<div className='contact__dialog_form__content'>
			<TextField
				className='dino__textfield'
				required={Constants.CONTACT_NAME.REQUIRED}
				fullWidth
				value={contact.name}
				onChange={handleChangeName}
				margin='dense'
				label={`${language.data.FORM_NAME}`}
				type='name'
				inputProps={{ maxLength: Constants.CONTACT_NAME.MAX }}
				error={errorName !== undefined}
				helperText={errorName || `${contact.name.length}/${Constants.CONTACT_NAME.MAX}`}
			/>
			<br />
			<TextField
				className='dino__textfield'
				required={Constants.CONTACT_DESCRIPTION.REQUIRED}
				multiline
				rowsMax={5}
				fullWidth
				value={contact.description}
				onChange={handleChangeDescription}
				margin='dense'
				label={`${language.data.FORM_DESCRIPTION}`}
				type='text'
				inputProps={{ maxLength: Constants.CONTACT_DESCRIPTION.MAX }}
				helperText={`${contact.description?.length}/${Constants.CONTACT_DESCRIPTION.MAX}`}
			/>
			<br />

			{phones.map((phone, index) => (
				<div key={index}>
					<PhoneFields
						type={phone.type}
						onChangeType={e => handleChangeType(e, index)}
						number={phone.number}
						onChangeNumber={e => handleChangeNumber(e, index)}
						error={errorPhone !== undefined}
						helperText={errorPhone}
						handleDeletePhone={() => handleDeletePhone(phone.number)}
					/>
					<br />
				</div>
			))}
			<TextButton className='add_phone__button' onClick={handleAddPhone}>
				<Typography variant='body2' color='textSecondary' display='block'>
					{`+ ${language.data.FORM_ADD_PHONE}`}
				</Typography>
			</TextButton>
			{children}
		</div>
	)
}

export default ContactFormDialogContent
