import React from 'react'
import { useLanguage } from '../../context/language'
import Loader from '../../components/loader'
import LinkButton from '../../components/button/link_button'
import HistoryService from '../../services/history/HistoryService'
import PathConstants from '../../constants/app/PathConstants'
import './styles.css'

const RegisterStaff = (): JSX.Element => {
	const language = useLanguage()

	return (
		<Loader isLoading={language.loading}>
			<div className='staff_registry'>
				<h2 className='staff_registry__content__message_2'> {language.data.STAFF_REGISTER} </h2>

                <form className='staff_registry__content__signin_form'>
					<label htmlFor="fname">{language.data.NAME}</label><br/>
                    <input type="text" id="mail" /><br/>
					<label htmlFor="lname">{language.data.LAST_NAME}</label><br/>
                    <input type="text" id="mail" /><br/>
                    <label htmlFor="mail">{language.data.EMAIL}</label><br/>
                    <input type="email" id="mail" /><br/>
                    <label htmlFor="password">{language.data.PASSWORD}</label><br/>
                    <input type="password" id="password"/><br/>
					<label htmlFor="password">{language.data.CONFIRM_PASSWORD}</label><br/>
                    <input type="password" id="password"/><br/>
					<input type="checkbox"  required={true}/>
  					<label htmlFor="agreement" id="agreement"> {language.data.AGREEMENT}</label>
                    <input type="submit" value={language.data.REGISTER_TEXT}></input>
                </form>

				<div className='staff_registry__content__info'>
					<LinkButton
						text={language.data.TERMS_OF_USE}
						onClick={() => HistoryService.push(PathConstants.TERMS_OF_USE)}
					/>
					<LinkButton
						text={language.data.MENU_ABOUT_US}
						onClick={() => HistoryService.push(PathConstants.ABOUT_US)}
					/>
					<LinkButton
						text={language.data.PRIVACY_POLICY}
						onClick={() => HistoryService.push(PathConstants.PRIVACY_POLICY)}
					/>
						
				</div>
			</div>

		</Loader>
	)
}

export default RegisterStaff
