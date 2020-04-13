import React, { useState, Fragment, useContext } from 'react'
import Button from '../button'
import AuthService from '../../services/AuthService'
import LogoutSVG from '../../images/logout.svg'
import Loader from '../loader'
import { LanguageProviderContext } from '../language_provider'
import './styles.css'

/**
 * @description Botão para logout
 */
const LogoutButton = () => {

    const languageContext = useContext(LanguageProviderContext)

    const [loading, setLoading] = useState(false)

    const logout = () => {
        setLoading(true)

        AuthService.logout()
    }

    return (
        <Fragment>
            <Button 
                imageSrc={LogoutSVG} 
                imageAlt={languageContext.LOGOUT_BUTTON_DESCRIPTION} 
                onClick={logout}
                className='logout_button'>
                Sair
            </Button>
            <Loader alt={languageContext.LOADER_ALT} loading={loading} />
        </Fragment>
    )
}

export default LogoutButton