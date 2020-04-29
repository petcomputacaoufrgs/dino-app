import React, { useState, useContext } from 'react'
import { LanguageContext } from '../language_provider'
import Button from '../button'
import AuthService from '../../services/AuthService'
import Loader from '../loader'
import GoogleSecret from '../../config/client_secret.json'
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login'
import GoogleLogo from '../../images/google_logo.png'
import LoginButtonProps from './props'
import LoginErrorTypes from '../../constants/LoginErrorTypes'
import AuthLocalStorageService from '../../services/local_storage/AuthLocalStorageService'
import GoogleAuthConstants from '../../constants/GoogleAuthConstants'
import './styles.css'

const GoogleLoginButton = (props: LoginButtonProps) => {

    const languageContext = useContext(LanguageContext)

    const language = languageContext.currentLanguage

    const [loading, setLoading] = useState(false)

    const responseGoogle = async (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        setLoading(true)

        const authResponse = await AuthService.google_login(response as GoogleLoginResponseOffline)
        
        if (authResponse === LoginErrorTypes.SUCCESS) {
            const refreshTokenRequired = AuthLocalStorageService.isRefreshRequired()

            if (refreshTokenRequired) {
                AuthLocalStorageService.setRefreshRequiredToFalse()
            }

            languageContext.updateLanguage()
            
            return
        }

        if (authResponse === LoginErrorTypes.UNKNOW_API_ERROR) {
            props.onDinoAPIFail && props.onDinoAPIFail()
        } else if (authResponse === LoginErrorTypes.EXTERNAL_SERVICE_ERROR) {
            props.onGoogleFail && props.onGoogleFail()
        } else if (authResponse === LoginErrorTypes.REFRESH_TOKEN_LOST_ERROR) {
            props.onRefreshTokenLostError && props.onRefreshTokenLostError()
        }
            
        setLoading(false)
    }

    const loginFail = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {        
        if (props.onCancel) {
            props.onCancel()
        }

        setLoading(false)
    }

    const getPrompt = (): string => {
        const refreshTokenRequired = AuthLocalStorageService.isRefreshRequired()

        if (refreshTokenRequired) {
            return GoogleAuthConstants.PROMPT_CONSENT
        }

        return ''
    }

    const getHostRootURI = () => {
        return window.location.protocol + '//' + window.location.host
    }

    return (
        <>
            <GoogleLogin
                clientId={GoogleSecret.web.client_id}
                scope={AuthService.getDefaultScopes()}
                onSuccess={responseGoogle}
                onFailure={loginFail}
                cookiePolicy={'single_host_origin'}
                redirectUri={getHostRootURI()}
                responseType={'code'}
                accessType={'offline'}
                prompt={getPrompt()}
                render={renderProps => (
                    <Button size={props.size} imageSrc={GoogleLogo} imageAlt={props.buttonText} className='login_button__button' onClick={renderProps.onClick}>{props.buttonText}</Button>
                )}
            />
            <Loader alt={language.LOADER_ALT} loading={loading} />
        </>
    )
}

export default GoogleLoginButton