import React, { useContext } from 'react'
import { Avatar } from '@material-ui/core'
import { LanguageContext } from '../../../components/language_provider'
import './styles.css'
import LocalStorageService from '../../../services/local_storage/LocalStorageService'

const Home = () => {
    const languageProvider = useContext(LanguageContext)

    const language = languageProvider.currentLanguage

    const avatarSrc = LocalStorageService.getPictureUrl()

    const username = LocalStorageService.getName()
    
    return (
        <div className='home'>
            <p className='home__welcome_message'>{language.WELCOME_MESSAGE}</p>
            <Avatar src={avatarSrc} alt={language.AVATAR_ALT} className='home__avatar' />
            <p className='home__username'>{username}</p>
        </div>
    )
}

export default Home