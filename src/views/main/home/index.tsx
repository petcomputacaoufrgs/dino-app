import React, { useContext } from 'react'
import { Avatar } from '@material-ui/core'
import { LanguageProviderContext } from '../../../components/language_provider'
import './styles.css'
import LocalStorageService from '../../../services/LocalStorageService'

const Home = () => {
    const languageContext = useContext(LanguageProviderContext)

    const avatarSrc = LocalStorageService.getPictureUrl()

    const username = LocalStorageService.getName()
    
    return (
        <div className='home'>
            <p className='home__welcome_message'>{languageContext.WELCOME_MESSAGE}</p>
            <Avatar src={avatarSrc} alt={languageContext.AVATAR_ALT} className='home__avatar' />
            <p className='home__username'>{username}</p>
        </div>
    )
}

export default Home