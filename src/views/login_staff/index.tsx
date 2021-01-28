import React from 'react'
import { ReactComponent as Dinosaur1 } from '../../assets/logos/dinosaur_1.svg'
import { useLanguage } from '../../context/language'
import Loader from '../../components/loader'
import LinkButton from '../../components/button/link_button'
import HistoryService from '../../services/history/HistoryService'
import PathConstants from '../../constants/app/PathConstants'
import Button from '../../components/button'
import './styles.css'

const LoginStaff = (): JSX.Element => {
	const language = useLanguage()

	return (
		<Loader isLoading={language.loading}>
			<div className='staff_login'>
				<Dinosaur1 className='staff_login__logo' />
				<h1 className='staff_login__content__message'>
					{language.data.WELCOME_MESSAGE}
				</h1>
				<div className='staff_login__content__signin'> 
					<h2 className='staff_login__content__message_2'> {language.data.STAFF_LOGIN} </h2>

                    <form className='staff_login__content__signin_form'>
                        <label htmlFor="mail">{language.data.EMAIL}</label><br/>
                        <input type="email" id="mail" /><br/>
                        <label htmlFor="password">{language.data.PASSWORD}</label><br/>
                        <input type="password" id="password"/><br/>
                        <input type="submit" value="Entrar"></input>
                    </form>

                    <div className='staff_login__content__signup'>
                        {language.data.REGISTER_QUESTION}
                        <Button onClick= {() => HistoryService.push(PathConstants.REGISTER_STAFF)}>
                            {language.data.REGISTER_TEXT}
                        </Button>
                    </div>
				</div>

				<div className='staff_login__content__info'>
					<LinkButton
						text={language.data.MENU_ABOUT_US}
						onClick={() => HistoryService.push(PathConstants.ABOUT_US)}
					/>
					<LinkButton
						text={language.data.PRIVACY_POLICY}
						onClick={() => HistoryService.push(PathConstants.PRIVACY_POLICY)}
					/>
					<LinkButton
						text={language.data.TERMS_OF_USE}
						onClick={() => HistoryService.push(PathConstants.TERMS_OF_USE)}
					/>
				</div>
			</div>
		</Loader>
	)
}

export default LoginStaff
